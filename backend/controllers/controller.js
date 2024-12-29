import bcrypt from "bcrypt";
const saltRounds = 10;
import jwt from "jsonwebtoken";
import { Driver } from "../models/driver.js";
import { User } from "../models/user.js";
import Ambulance from "../models/Ambulance.js";
//register
export const userRegister = async (req, res) => {
  const { email, phone, password, confirmpassword } = req.body;

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  if (password != confirmpassword) {
    return res.status(400).send({ message: "Passwords do not match." });
  }
  const oldUser = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (oldUser) {
    return res.status(400).send({ message: "user already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await User.create({
      email: email,
      phone,
      password: hashedPassword,
      Dob: null,
      gender: null,
      fullname: null,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

// Login function with JWT authentication
export const userLogin = async (req, res) => {
  const { email, password, role } = req.body;
  let user;

  if (role === "user") {
    user = await User.findOne({ email: email });
  }

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    if (user && isPasswordCorrect) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
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

export const userLogout = async (req, res) => {
  res.status(200).send({ message: "Logged out successfully" });
};

// select user data
export const UserData = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user data", error: error.message });
  }
};

// update user (using JWT)
export const UpdateUser = async (req, res) => {
  const { fullname, email, gender, dob } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, // Get userId from the JWT token
      { fullname, email, gender, Dob: dob },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const UpdateUserPassword = async (req, res) => {
  const { password, newpassword, confirmnewpassword, role, email } = req.body;
  let user, driver;

  if (role === "user") {
    user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Incorrect current password" });
    }
    if (newpassword !== confirmnewpassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const updatedUser = await User.findByIdAndUpdate(
        req.user.userId,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }

  if (role === "driver") {
    driver = await Driver.findOne({ email });

    if (!driver) {
      return res.status(404).send({ message: "driver not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, driver.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Incorrect current password" });
    }
    if (newpassword !== confirmnewpassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newpassword, 10);
      const updatedUser = await Driver.findByIdAndUpdate(
        req.driver.driverId,
        { password: hashedPassword },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "Driver not found" });
      }

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};

export const driversnearby = async (req, res) => {
  const {
    latitude,
    longitude,
    deslatitude,
    deslongitude,
    radius = 50,
  } = req.body;

  if (!latitude || !longitude || !deslongitude || !deslatitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
  }

  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers
    return distance; // Return distance in kilometers
  };

  const distance = haversineDistance(
    latitude,
    longitude,
    deslatitude,
    deslongitude
  );

  console.log(
    `The distance between the two points is ${distance * 1000} meters.`
  );
  const radiusInMeters = radius * 1000;

  try {
    const ambulances = await Ambulance.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [latitude, longitude] },
          distanceField: "distance",
          maxDistance: radiusInMeters,
          spherical: true,
        },
      },
      {
        $lookup: {
          from: "drivers", // Look up the driver details
          localField: "driver", // Field in Ambulance schema
          foreignField: "_id", // Match to the driver collection's _id
          as: "driverDetails", // Alias for the driver details
        },
      },
      {
        $unwind: {
          path: "$driverDetails", // Unwind driverDetails to make it a single object
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $limit: 100,
      },
    ]);
    res.status(200).json({ ambulances, totaldistance: distance * 1000 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching ambulances", error });
  }
};

export const driverlocation = async (req, res) => {
  console.log("Backend - Fetching all drivers' locations");

  try {
    const drivers = await Driver.find(
      {},
      { fullname: 1, "location.coordinates": 1, _id: 0 }
    );

    // Format the data so that it's more easily consumed by the frontend
    const formattedDrivers = drivers.map((driver) => ({
      fullname: driver.fullname,
      latitude: driver.location.coordinates[0], // Latitude is the second element in the coordinates array
      longitude: driver.location.coordinates[1], // Longitude is the first element
    }));

    console.log("Formatted Driver Data: ", formattedDrivers);
    res.status(200).json(formattedDrivers);
  } catch (error) {
    console.error("Error fetching driver locations:", error);
    res.status(500).json({ message: "Error fetching driver locations." });
  }
};
