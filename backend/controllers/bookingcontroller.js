import { Booking } from "../models/Booking.js";

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
          coordinates: [coordinates[1], coordinates[0]], // [longitude, latitude]
        };
      }
      return null;
    }

    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return {
      type: "Point",
      coordinates: [longitude, latitude], // [longitude, latitude]
    };
  };

  const formattedUserLocation = parseLocation(userLocation);
  const formattedDestination = parseLocation(destination);

  console.log("Formatted User Location:", formattedUserLocation);
  console.log("Formatted Destination:", formattedDestination);

  if (!formattedUserLocation || !formattedDestination) {
    return res.status(400).json({ message: "Invalid location format" });
  }

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
      hospitalId,
      userId,
      distance,
      userlocation: formattedUserLocation,
      destinationlocation: formattedDestination,
      price,
      ambulanceType,
      bookingstatus: "pending",
    });

    const savedBooking = await newBooking.save();

    res.status(200).json({
      message: "Booking successful",
      bookingId: savedBooking._id,
      status: savedBooking.bookingstatus,
    });
  } catch (error) {
    console.error("Error booking ambulance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const driverId = req.driver.driverId;

    const bookings = await Booking.find({ driverId: driverId })
      .select(" userlocation destinationlocation price bookingstatus")
      .sort({ createdAt: -1 });

    if (!bookings || bookings.length === 0) {
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
