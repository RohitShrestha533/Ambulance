import bcrypt from "bcrypt";
const saltRounds = 10;
import { Hospital } from "../models/hospital.js";
import jwt from "jsonwebtoken";
import { Driver } from "../models/driver.js";
import Ambulance from "../models/Ambulance.js";
import { Booking } from "../models/Booking.js";
import mongoose from "mongoose";

export const hospitalJWT = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.hospitaltoken;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Token is not valid" });
    }

    req.hospital = decoded;
    next();
  });
};
export const Hospitalpassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    console.log(email, newPassword);
    const hospital = await Hospital.findOne({ email: email });
    if (!hospital) {
      return res.status(404).send({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    hospital.password = hashedPassword;
    await hospital.save();

    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
export const hospitalData = async (req, res) => {
  const hospitalId = req.hospital.hospitalId;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ message: "hospital not found" });
    }
    res.status(200).send({ hospital });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching hospital data", error: error.message });
  }
};

export const getUnverifiedHospitals = async (req, res) => {
  try {
    console.log("Fetching unverified hospitals...");

    const unverifiedHospitals = await Hospital.find({ approved: "no" });

    const unverifiedCount = await Hospital.countDocuments({ approved: "no" });

    // console.log("Unverified Hospitals:", unverifiedHospitals);
    // console.log("Unverified Hospitals Count:", unverifiedCount);

    res
      .status(200)
      .json({ count: unverifiedCount, hospitals: unverifiedHospitals });
  } catch (error) {
    console.error("Error fetching unverified hospitals:", error);
    res.status(500).json({ error: "Failed to fetch unverified hospitals" });
  }
};

export const approveHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { approved: "yes" },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error approving hospital:", error);
    res.status(500).json({ error: "Failed to approve hospital" });
  }
};

export const hospitalRegister = async (req, res) => {
  const {
    hospitalName,
    registrationNumber,
    email,
    adminName,
    adminContact,
    password,
    ambulanceCount,
    coordinates,
    emergencyContact,
  } = req.body;

  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !hospitalName ||
    !registrationNumber ||
    !email ||
    !adminName ||
    !adminContact ||
    !password ||
    !emergencyContact
  ) {
    return res.status(400).send({ message: "All fields are required." });
  }

  if (!phoneRegex.test(adminContact) || !phoneRegex.test(emergencyContact)) {
    return res
      .status(400)
      .send({ message: "Contact numbers must be 10 digits." });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Invalid email format." });
  }

  try {
    const existingHospital = await Hospital.findOne({
      $or: [
        { email: email },
        { registrationNumber: registrationNumber },
        { adminContact: adminContact },
        { emergencyContact: emergencyContact },
      ],
    });

    if (existingHospital) {
      return res.status(400).send({ message: "Hospital already registered." });
    }
    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return res.status(400).send({
        message:
          "Coordinates must be an array with two numbers: [longitude, latitude].",
      });
    }

    const [longitude, latitude] = coordinates;
    if (typeof longitude !== "number" || typeof latitude !== "number") {
      return res.status(400).send({
        message: "Coordinates should be numbers.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const approved = "no";

    const newHospital = await Hospital.create({
      hospitalName,
      registrationNumber,
      email,
      adminName,
      adminContact,
      password: hashedPassword,
      ambulanceCount,
      location: { type: "Point", coordinates: [longitude, latitude] },
      emergencyContact,
      approved,
    });

    res.status(200).send({
      status: "ok",
      message: "Hospital registered successfully.",
    });
  } catch (error) {
    console.error("Error registering hospital:", error.message);
    res.status(500).send({
      status: "error",
      message: "Internal server error. Please try again later.",
    });
  }
};

export const hospitalLogin = async (req, res) => {
  const { email, password } = req.body;
  let hospital,
    role = "hospital";
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  if (role === "hospital") {
    hospital = await Hospital.findOne({ email });
  }
  if (!hospital) {
    console.log("not");
    return res.status(404).send({ message: "hospital not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, hospital.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  if (hospital.approved === "no") {
    return res.status(400).send({ message: "wait for admin approval" });
  }

  try {
    if (hospital && isPasswordCorrect) {
      const token = jwt.sign(
        { hospitalId: hospital._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send({
        status: 200,
        message: "Login successful",
        token,
        name: hospital.hospitalName,
      });
    } else {
      res.status(400).send({ status: 400, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//logout
export const hospitalLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
};

export const hospitaldriverData = async (req, res) => {
  const hospitalId = req.hospital.hospitalId;

  try {
    const drivers = await Driver.find({ hospital: hospitalId })
      .populate("ambulance", "ambulanceType")
      .exec();

    const driverDataWithAmbulanceType = drivers.map((driver) => ({
      ...driver.toObject(),
      ambulanceType: driver.ambulance ? driver.ambulance.ambulanceType : "N/A",
    }));

    res.status(200).send({ drivers: driverDataWithAmbulanceType });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error fetching drivers" });
  }
};

export const UpdateHospitalData = async (req, res) => {
  const hospitalId = req.hospital.hospitalId;
  const { adminName, adminContact, ambulanceCount, emergencyContact } =
    req.body;
  try {
    const updatedHospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { adminName, adminContact, ambulanceCount, emergencyContact },
      { new: true }
    );

    if (!updatedHospital) {
      return res
        .status(404)
        .json({ success: false, message: "Hospital not found" });
    }

    res.json({
      success: true,
      message: "Hospital updated successfully",
      admin: updatedHospital,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const hospitalUpdateDriver = async (req, res) => {
  const hospitalId = req.hospital.hospitalId;
  const { driverId } = req.params;
  const {
    fullname,
    phone,
    licenseNumber,
    email,
    ambulanceType,
    gender,
    status,
  } = req.body;
  console.log("lc ", licenseNumber);
  if (
    !fullname ||
    !phone ||
    !email ||
    !gender ||
    !ambulanceType ||
    !licenseNumber ||
    !status
  ) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  const session = await mongoose.startSession(); // Start a session for the transaction

  try {
    session.startTransaction();

    const driver = await Driver.findOneAndUpdate(
      { _id: driverId, hospital: hospitalId },
      { fullname, phone, email, gender, licenseNumber, status },
      { new: true }
    );

    if (!driver) {
      await session.abortTransaction();
      return res.status(404).json({
        error: "Driver not found or not associated with this hospital",
      });
    }

    const ambulance = await Ambulance.findOneAndUpdate(
      { driver: driverId },
      { ambulanceType },
      { new: true }
    );

    if (!ambulance) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ error: "No ambulance found for this driver" });
    }

    await session.commitTransaction();

    res.status(200).json({
      message: "Driver and ambulance updated successfully",
      driver,
      ambulance,
    });
  } catch (error) {
    console.error("Error updating hospital's driver information:", error);
    await session.abortTransaction();
    res.status(500).json({
      error: "Failed updating driver's information or ambulance",
    });
  } finally {
    session.endSession();
  }
};
export const getNearbyHospitals = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    console.log("Latitude:", latitude, "Longitude:", longitude);

    if (!latitude || !longitude) {
      return res
        .status(400)
        .json({ error: "Latitude and Longitude are required" });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const hospitals = await Hospital.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lat, lon] },
          distanceField: "distance", // Distance from the point
          spherical: true,
        },
      },
    ]);

    // If you want to format the distance or add it in a specific way
    const hospitalsWithDistance = hospitals.map((hospital) => ({
      ...hospital,
      distance: hospital.distance.toFixed(2), // Format distance (optional)
    }));

    return res.json(hospitalsWithDistance); // Send hospitals along with distance
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error);
    res.status(500).json({ error: "Failed to fetch nearby hospitals" });
  }
};

export const hospitalbookings = async (req, res) => {
  try {
    const hospitalId = req.hospital?.hospitalId; // Ensure hospitalId exists
    if (!hospitalId) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }

    // Execute the aggregation query
    const stats = await Booking.aggregate([
      {
        $match: {
          bookingstatus: "completed",
          hospital: new mongoose.Types.ObjectId(hospitalId),
        },
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
          advanceRevenue: {
            $sum: {
              $cond: [{ $eq: ["$ambulanceType", "Advance"] }, "$price", 0],
            },
          },
          basicRevenue: {
            $sum: {
              $cond: [{ $eq: ["$ambulanceType", "Basic"] }, "$price", 0],
            },
          },
          transportRevenue: {
            $sum: {
              $cond: [{ $eq: ["$ambulanceType", "Transport"] }, "$price", 0],
            },
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
          advanceRevenue: 1,
          basicRevenue: 1,
          transportRevenue: 1,
        },
      },
    ]);

    const driverCount = await Driver.countDocuments({ hospital: hospitalId });
    // console.log(driverCount);
    // Handle empty stats array
    if (!stats.length) {
      return res.status(200).json({
        message: "No booking stats found for this hospital.",
        stats: null,
      });
    }

    // Send the aggregated stats to the frontend
    res.status(200).json({
      message: "Booking stats retrieved successfully.",
      stats: stats[0],
      driverCount,
    });
  } catch (error) {
    console.error("Error in hospitalbookings:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Error fetching booking stats", error: error.message });
  }
};
export const HospitalCart = async (req, res) => {
  try {
    const hospitalId = req.hospital?.hospitalId; // Ensure hospitalId exists
    if (!hospitalId) {
      return res.status(400).json({ message: "Invalid hospital ID" });
    }
    const driverRevenues = await Booking.aggregate([
      {
        $match: {
          hospital: new mongoose.Types.ObjectId(hospitalId),
        },
      },
      {
        $group: {
          _id: "$driverId", // Group by driverId
          totalRevenue: { $sum: "$price" }, // Sum up the price for each driver
        },
      },
      {
        $lookup: {
          from: "drivers", // Replace with the actual Driver collection name
          localField: "_id", // driverId from bookings
          foreignField: "_id", // _id in Driver collection
          as: "driverDetails",
        },
      },
      {
        $unwind: "$driverDetails", // Flatten the driver details array
      },
      {
        $project: {
          _id: 0,
          driverId: "$_id", // Include driverId
          driverName: "$driverDetails.fullname", // Include driver name (adjust based on your schema)
          totalRevenue: 1, // Include the calculated total revenue
        },
      },
    ]);

    console.log(driverRevenues);
    res.status(200).json({
      message: "Chart details retrieved successfully.",
      driverRevenues,
    });
  } catch (error) {
    console.error("Error in hospitalbookings:", error.message, error.stack);
    res
      .status(500)
      .json({ message: "Error fetching booking stats", error: error.message });
  }
};

export const hospitaldriverDelete = async (req, res) => {
  const session = await mongoose.startSession(); // Start a session for the transaction
  try {
    session.startTransaction();
    const hospitalId = req.hospital?.hospitalId; // Middleware should set this
    const { driverId } = req.body;
    console.log("ABC", driverId);
    if (!hospitalId) {
      throw new Error("Invalid hospital ID");
    }

    if (!driverId) {
      throw new Error("Driver ID is required");
    }

    // Find the driver and validate ownership
    const driver = await Driver.findOne({
      _id: driverId,
      hospital: hospitalId,
    }).session(session);
    if (!driver) {
      throw new Error("Driver not found or does not belong to this hospital");
    }

    // Find the ambulance associated with the driver
    const ambulance = await Ambulance.findOne({
      driver: driverId,
      hospital: hospitalId,
    }).session(session);
    if (!ambulance) {
      throw new Error("Ambulance not found for this driver in the hospital");
    }

    // Delete the driver
    await Driver.deleteOne({ _id: driverId }).session(session);

    // Delete the ambulance
    await Ambulance.deleteOne({ _id: ambulance._id }).session(session);

    // Update the hospital's arrays
    await Hospital.updateOne(
      { _id: hospitalId },
      {
        $pull: {
          drivers: driverId,
          ambulances: ambulance._id,
        },
      },
      { session }
    );

    await session.commitTransaction();
    res.status(200).json({
      message: "Driver and associated ambulance deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error deleting driver and ambulance:", error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
