import bcrypt from "bcrypt";
const saltRounds = 10;
import { Driver } from "../models/driver.js";
import { Hospital } from "../models/hospital.js";
import { Booking } from "../models/Booking.js";
import Ambulance from "../models/Ambulance.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
export const driverJWT = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.drivertoken;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Token is not valid" });
    }

    req.driver = decoded;
    next();
  });
};

export const driverRegister = async (req, res) => {
  console.log("Received data:", req.body);
  const {
    driverName,
    licenseNumber,
    ambulanceNumber,
    email,
    phone,
    password,
    ambulanceType,
  } = req.body;

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }
  const session = await mongoose.startSession(); // Start a session for the transaction

  try {
    session.startTransaction();
    const hospitalId = req.hospital?.hospitalId;
    if (!hospitalId) {
      return res.status(400).send({ message: "Hospital ID is missing." });
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ message: "Hospital not found." });
    }

    const currentDriverCount = await Driver.countDocuments({
      hospital: hospitalId,
    });

    if (currentDriverCount >= hospital.ambulanceCount) {
      return res
        .status(400)
        .send({ message: "Driver limit reached. Cannot add more drivers." });
    }

    const existingDriver = await Driver.findOne({
      $or: [{ email }, { ambulanceNumber }, { licenseNumber }, { phone }],
    });

    if (existingDriver) {
      return res.status(400).send({ message: "Driver already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const location = hospital.location;

    const newAmbulance = await Ambulance.create({
      ambulanceNumber,
      ambulanceType,
      hospital: hospitalId,
      location: {
        type: "Point", // Geospatial type
        coordinates: location.coordinates, // Use the hospital's coordinates
      },
    });

    const newDriver = await Driver.create({
      fullname: driverName,
      ambulanceNumber,
      licenseNumber,
      phone,
      email,
      password: hashedPassword,
      hospitalName: hospital.hospitalName,
      hospital: hospitalId,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      ambulance: newAmbulance._id,
    });
    newAmbulance.driver = newDriver._id;
    await newAmbulance.save();

    hospital.ambulances.push(newAmbulance._id);
    await hospital.save();

    hospital.drivers.push(newDriver._id);
    await hospital.save();

    await session.commitTransaction();
    res.status(201).send({
      status: "ok",
      data: "Driver and ambulance registered successfully.",
    });
  } catch (error) {
    console.error("Error during driver registration:", error.message);
    res
      .status(500)
      .send({ status: "error", message: "Internal server error." });
  }
};

export const driverLogin = async (req, res) => {
  const { email, password } = req.body;
  let driver;

  // Find driver by email
  driver = await Driver.findOne({ email: email });

  if (!driver) {
    return res.status(404).send({ message: "Driver not found" });
  }

  // Compare password
  const isPasswordCorrect = await bcrypt.compare(password, driver.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    const token = jwt.sign(
      { driverId: driver._id, role: "driver" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    console.log(token);
    res.status(200).send({
      status: 200,
      message: "Driver login successful",
      token,
    });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

export const driverLogout = async (req, res) => {
  res.status(200).send({ message: "Logged out successfully" });
};

// select driver data
export const DriverData = async (req, res) => {
  const driverId = req.driver.driverId;

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).send({ message: "driver not found" });
    }
    res.status(200).send({ driver });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching driver data", error: error.message });
  }
};

// update driver (using JWT)
export const UpdateDriver = async (req, res) => {
  const { fullname, email, gender, dob } = req.body;

  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.driver.driverId, // Get driverId from the JWT token
      { fullname, email, gender, Dob: dob },
      { new: true }
    );

    if (!updatedDriver) {
      return res
        .status(404)
        .json({ success: false, message: "Driver not found" });
    }

    res.json({
      success: true,
      message: "Driver detail updated successfully",
      driver: updatedDriver,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const driverbookingHistory = async (req, res) => {
  try {
    const driverId = req.driver.driverId;
    console.log("Fetching bookings for driver ID:", driverId);

    const bookings = await Booking.find({ driverId, bookingstatus: "pending" })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "fullname phone",
      });
    res.json(bookings);
  } catch (error) {
    // console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Failed to fetch booking history" });
  }
};

export const drivercancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingstatus !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be cancelled" });
    }

    booking.bookingstatus = "cancelled"; // or "cancelled"
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.bookingstatus !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be confirmed" });
    }

    booking.bookingstatus = "confirmed"; // or "cancelled"
    await booking.save();

    res.json({ message: "Booking confirmed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};
