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
        token, // Send the token in the response
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
  console.log("Backend - Fetching all ambulances");

  const {
    latitude,
    longitude,
    radius = 50, // Default radius in kilometers (can be adjusted in the request)
  } = req.body;

  // Validate that latitude and longitude are provided
  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and Longitude are required" });
  }

  // Convert degrees to radians (this is for the haversine distance calculation, not used in this case)
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  // Haversine formula to calculate distance between two points on the Earth
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

  // Calculate the distance (although not needed for fetching all ambulances)
  const distance = haversineDistance(latitude, longitude, latitude, longitude);
  console.log(
    `The distance to the user's current location is ${distance * 1000} meters.`
  );

  const radiusInMeters = radius * 1000; // Convert radius from kilometers to meters (not used here)

  try {
    // Fetch all ambulances without filtering by location
    const ambulances = await Ambulance.aggregate([
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
        $limit: 100, // Limit to 100 ambulances (if there are more than 100)
      },
    ]);

    // Send all ambulances along with the distance information (even if it's not used here)
    res.status(200).json({ ambulances, totaldistance: distance * 1000 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching ambulances", error });
  }
};
