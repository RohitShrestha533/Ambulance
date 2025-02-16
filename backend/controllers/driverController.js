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
  const session = await mongoose.startSession();

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
        type: "Point",
        coordinates: location.coordinates,
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

  driver = await Driver.findOne({ email: email });

  if (!driver) {
    return res.status(404).send({ message: "Driver not found" });
  }

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

export const UpdateDriver = async (req, res) => {
  const { fullname, email, gender, dob } = req.body;

  try {
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.driver.driverId,
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

    const bookings = await Booking.find({
      driverId,
      bookingstatus: { $nin: ["completed", "cancelled"] },
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "fullname phone",
      });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking history" });
  }
};

export const drivercancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const driverId = booking.driverId;

    if (!driverId) {
      return res
        .status(400)
        .json({ message: "Driver information not found for this booking" });
    }
    if (booking.bookingstatus !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending bookings can be cancelled" });
    }

    booking.bookingstatus = "cancelled";
    await booking.save();
    const driverUpdate = await Driver.findByIdAndUpdate(
      driverId,
      { isBooked: false },
      { session, new: true }
    );

    if (!driverUpdate) {
      throw new Error("Driver not found");
    }

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

export const completeBooking = async (req, res) => {
  let session;
  try {
    const driverId = req.driver.driverId;
    const { bookingId, msg, latitude, longitude } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;

      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance * 1000;
    };

    const userLatitude = booking.userlocation.coordinates[1];
    const userLongitude = booking.userlocation.coordinates[0];

    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      latitude,
      longitude
    );

    console.log(`Distance to destination: ${distance} meters`);
    let price;
    const initialDistance = booking.distance;
    const totalDistance = initialDistance + distance;
    console.log(totalDistance);
    if (booking.ambulanceType === "Basic") {
      price = totalDistance * 0.05;
    } else if (booking.ambulanceType === "Advance") {
      price = totalDistance * 0.1;
    } else if (booking.ambulanceType === "Transport") {
      price = totalDistance * 0.03;
    } else {
      price = totalDistance * 0.04;
    }

    console.log("Calculated price:", price);

    session = await mongoose.startSession();
    session.startTransaction();

    if (msg === "completed") {
      if (booking.bookingstatus !== "picked") {
        return res
          .status(400)
          .json({ message: "Only picked bookings can be completed" });
      }
      booking.bookingstatus = "completed";
      booking.distance = totalDistance;
      booking.price = price;
      booking.destinationlocation = {
        type: "Point",
        coordinates: [longitude, latitude], // Save destination latitude and longitude
      };

      await booking.save();

      const driverUpdate = await Driver.findByIdAndUpdate(
        driverId,
        { isBooked: false },
        { new: true }
      );

      if (!driverUpdate) {
        return res.status(404).json({ message: "Driver not found" });
      }

      await session.commitTransaction();
      session.endSession();
      return res.json({ message: "Booking completed successfully" });
    }

    return res.status(400).json({ message: "Invalid status message" });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error("Error completing booking:", error);
    res.status(500).json({ message: "Failed to complete booking" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const driverId = req.driver.driverId;
    const { bookingId, msg } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    if (msg === "confirmed") {
      if (booking.bookingstatus !== "pending") {
        return res
          .status(400)
          .json({ message: "Only pending bookings can be confirmed" });
      }
      booking.bookingstatus = "confirmed";
      await booking.save();

      const driverUpdate = await Driver.findByIdAndUpdate(
        driverId,
        { isBooked: true },
        { new: true }
      );

      if (!driverUpdate) {
        return res.status(404).json({ message: "Driver not found" });
      }
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: "Booking confirmed successfully" });
    }

    if (msg === "picked") {
      if (booking.bookingstatus !== "confirmed") {
        return res
          .status(400)
          .json({ message: "Only confirmed bookings can be picked" });
      }
      booking.bookingstatus = "picked";
      await booking.save();
      return res.json({ message: "Patient picked successfully" });
    }

    if (msg === "completed") {
      if (booking.bookingstatus !== "picked") {
        return res
          .status(400)
          .json({ message: "Only picked bookings can be completed" });
      }
      booking.bookingstatus = "completed";
      await booking.save();
      const driverUpdate = await Driver.findByIdAndUpdate(
        driverId,
        { isBooked: false },
        { new: true }
      );

      if (!driverUpdate) {
        return res.status(404).json({ message: "Driver not found" });
      }
      await session.commitTransaction();
      session.endSession();
      return res.json({ message: "Booking completed successfully" });
    }

    return res.status(400).json({ message: "Invalid status message" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error confirming booking:", error);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

export const updateDriverLocation = async (req, res) => {
  const driverId = req.driver.driverId;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }
  try {
    const driver = await Driver.findOneAndUpdate(
      driverId,
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
        },
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Location updated successfully", driver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const pickup = async (req, res) => {
  try {
    const driverId = req.driver.driverId;

    const booking = await Booking.findOne({
      driverId,
      bookingstatus: "pending",
    }).select("userlocation destinationlocation");

    if (!booking) {
      return res.status(200).json({
        message: "No active bookings found",
        userLocation: null,
        destination: null,
      });
    }

    res.json({
      userLocation: {
        latitude: booking.userlocation.coordinates[1],
        longitude: booking.userlocation.coordinates[0],
      },
      destination: {
        latitude: booking.destinationlocation.coordinates[1],
        longitude: booking.destinationlocation.coordinates[0],
      },
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res
      .status(500)
      .json({ message: "Server error", userLocation: null, destination: null });
  }
};
