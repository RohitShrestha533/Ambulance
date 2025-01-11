import bcrypt from "bcrypt";
const saltRounds = 10;

import { Admin } from "../models/admin.js";
import { Driver } from "../models/driver.js";

import jwt from "jsonwebtoken";
import { Booking } from "../models/Booking.js";
import { Hospital } from "../models/hospital.js";

export const adminRegister = async (req, res) => {
  const { email, phone, password, confirmpassword } = req.body;

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  if (password != confirmpassword) {
    return res.status(400).send({ message: "Passwords do not match." });
  }
  const oldAdmin = await Admin.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (oldAdmin) {
    return res.status(400).send({ message: "admin already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await Admin.create({
      email: email,
      phone,
      password: hashedPassword,
      Dob: null,
      gender: null,
      fullname: null,
    });
    res.send({ status: "ok", data: "Admin Created" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  let admin,
    role = "admin";
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  if (role === "admin") {
    admin = await Admin.findOne({ email });
  }

  if (!admin) {
    console.log("not");
    return res.status(404).send({ message: "Admin not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    if (admin && isPasswordCorrect) {
      const token = jwt.sign(
        { adminId: admin._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send({
        status: 200,
        message: "Login successful",
        token,
      });
    } else {
      res.status(400).send({ status: 400, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//logout
export const adminLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
};

export const AdminData = async (req, res) => {
  const adminId = req.admin.adminId;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    res.status(200).send({ admin });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching admin data", error: error.message });
  }
};

export const UpdateAdmin = async (req, res) => {
  const adminId = req.admin.adminId;
  const { fullname, phone, Dob, gender } = req.body;
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { fullname, phone, Dob, gender },
      { new: true }
    );

    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Admin updated successfully",
      admin: updatedAdmin,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const revenuechart = async (req, res) => {
  console.log("backedn");
  try {
    const revenueData = await Booking.aggregate([
      {
        $match: {
          bookingstatus: "completed",
        },
      },
      {
        $lookup: {
          from: "drivers",
          localField: "driverId",
          foreignField: "_id",
          as: "driverDetails",
        },
      },
      {
        $unwind: "$driverDetails",
      },
      {
        $group: {
          _id: "$driverDetails.hospital",
          totalPrice: { $sum: "$price" },
        },
      },
      {
        $lookup: {
          from: "hospitals",
          localField: "_id",
          foreignField: "_id",
          as: "hospitalDetails",
        },
      },
      {
        $unwind: "$hospitalDetails",
      },
      {
        $project: {
          hospitalName: "$hospitalDetails.hospitalName",
          totalPrice: 1,
        },
      },
    ]);
    res.status(200).json(revenueData);
  } catch (err) {
    console.error("Error fetching revenue data:", err);
    res
      .status(500)
      .json({ message: "Error fetching revenue data", error: err });
  }
};

// export const bookingdetails = async (req, res) => {
//   try {
//     const stats = await Booking.aggregate([
//       {
//         $match: { bookingstatus: "completed" },
//       },
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$price" },
//           totalBookings: { $sum: 1 },
//         },
//       },
//       {
//         $project: { _id: 0, totalRevenue: 1, totalBookings: 1 },
//       },
//     ]);

//     const totalRevenue = stats.length > 0 ? stats[0].totalRevenue : 0;
//     const totalBookings = stats.length > 0 ? stats[0].totalBookings : 0;
//     const countdriver = await Driver.countDocuments();
//     const counthospital = await Hospital.countDocuments();
//     console.log(countdriver, counthospital);
//     res.status(200).json({
//       totalRevenue,
//       totalBookings,
//       totaldrivers: countdriver,
//       totalhospitals: counthospital,
//     });
//   } catch (error) {
//     console.error("Error in bookingdetails:", error);
//     res.status(500).json({ message: "Error fetching booking stats" });
//   }
// };

export const bookingdetails = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $match: { bookingstatus: "completed" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
          totalBookings: { $sum: 1 },
          advanceCount: {
            $sum: { $cond: [{ $eq: ["$ambulanceType", "Advance"] }, 1, 0] },
          },
          basicCount: {
            $sum: { $cond: [{ $eq: ["$ambulanceType", "Basic"] }, 1, 0] },
          },
          transportCount: {
            $sum: { $cond: [{ $eq: ["$ambulanceType", "Transport"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalBookings: 1,
          advanceCount: 1,
          basicCount: 1,
          transportCount: 1,
        },
      },
    ]);

    const totalRevenue = stats.length > 0 ? stats[0].totalRevenue : 0;
    const totalBookings = stats.length > 0 ? stats[0].totalBookings : 0;
    const advanceCount = stats.length > 0 ? stats[0].advanceCount : 0;
    const basicCount = stats.length > 0 ? stats[0].basicCount : 0;
    const transportCount = stats.length > 0 ? stats[0].transportCount : 0;

    const countdriver = await Driver.countDocuments();
    const counthospital = await Hospital.countDocuments();
    console.log(countdriver, counthospital);
    console.log(advanceCount, basicCount, transportCount);

    res.status(200).json({
      totalRevenue,
      totalBookings,
      totaldrivers: countdriver,
      totalhospitals: counthospital,
      advanceBookings: advanceCount,
      basicBookings: basicCount,
      transportBookings: transportCount,
    });
  } catch (error) {
    console.error("Error in bookingdetails:", error);
    res.status(500).json({ message: "Error fetching booking stats" });
  }
};
