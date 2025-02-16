import Ambulance from "../models/Ambulance.js";
import { Booking } from "../models/Booking.js";
import { Driver } from "../models/driver.js";
import mongoose from "mongoose";
export const bookambulance = async (req, res) => {
  const {
    ambulanceId,
    driverId,
    hospitalId,
    distance,
    userLocation,
    destination,
    price,
    ambulanceType,
  } = req.body;

  if (
    !ambulanceId ||
    !driverId ||
    !hospitalId ||
    !distance ||
    !userLocation ||
    !destination ||
    !price ||
    !ambulanceType
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const d = await Driver.findById(driverId);
  console.log("driver ", d.location);
  console.log("user ", userLocation);
  console.log("destination ", destination);
  const parseLocation = (location) => {
    const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
    const match = location.match(regex);

    if (!match) {
      const coordinates = location
        .split(",")
        .map((coord) => parseFloat(coord.trim()));
      if (coordinates.length === 2) {
        return {
          type: "Point",
          coordinates: [coordinates[1], coordinates[0]],
        };
      }
      return null;
    }

    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return {
      type: "Point",
      coordinates: [longitude, latitude],
    };
  };

  const formattedUserLocation = parseLocation(userLocation);
  const formattedDestination = parseLocation(destination);

  console.log("Formatted User Location:", formattedUserLocation);
  console.log("Formatted Destination:", formattedDestination);

  if (!formattedUserLocation || !formattedDestination) {
    return res.status(400).json({ message: "Invalid location format" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    const newBooking = new Booking({
      ambulanceId,
      driverId,
      hospital: hospitalId,
      userId,
      distance,
      userlocation: formattedUserLocation,
      destinationlocation: formattedDestination,
      price,
      ambulanceType,
      bookingstatus: "pending",
    });

    const savedBooking = await newBooking.save();

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message: "Booking successful",
      bookingId: savedBooking._id,
      status: savedBooking.bookingstatus,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error booking ambulance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sosbook = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Coordinates are required" });
    }

    const nearestDrivers = await Driver.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [latitude, longitude] },
          distanceField: "distance",
          maxDistance: 20000,
          spherical: true,
        },
      },
      {
        $match: {
          isBooked: false,
          status: "Active",
        },
      },
      {
        $sort: { distance: 1 },
      },
      {
        $limit: 1,
      },
    ]);

    if (!nearestDrivers) {
      return res.status(404).json({ message: "No available drivers found" });
    }
    console.log("ab", nearestDrivers[0]._id);
    const driverId = nearestDrivers[0]._id;
    const ambulanceId = nearestDrivers[0].ambulance;
    const hospitalId = nearestDrivers[0].hospital;
    console.log(hospitalId);
    const distance = nearestDrivers[0].distance;
    console.log("ambu", ambulanceId);
    const ambu = await Ambulance.findById(ambulanceId);
    const ambulanceType = ambu.ambulanceType;
    console.log("ambu", ambulanceType);

    const newBooking = new Booking({
      ambulanceId,
      driverId,
      hospital: hospitalId,
      userId,
      distance,
      userlocation: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      destinationlocation: {
        type: "Point",
        coordinates: [],
      },
      price: null,
      ambulanceType: ambulanceType,
      bookingstatus: "pending",
    });

    const savedBooking = await newBooking.save();

    console.log("lkjj ", nearestDrivers[0].distance);
    console.log("lkjj ", nearestDrivers);
    res.status(200).json(nearestDrivers[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding nearest driver", error });
  }
};
export const getAllBookings = async (req, res) => {
  try {
    const driverId = req.driver.driverId;

    const bookings = await Booking.find({
      driverId: driverId,
    }).sort({ createdAt: -1 });

    if (!bookings) {
      return res
        .status(404)
        .json({ message: "No bookings found for this driver" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

export const userbookingHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Fetching bookings for user ID:", userId);

    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "driverId",
        select: "fullname phone",
      })
      .populate({
        path: "ambulanceId",
        select: "ambulanceNumber",
      });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Failed to fetch booking history" });
  }
};

export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
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

    booking.bookingstatus = "cancelled";
    await booking.save();

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};
