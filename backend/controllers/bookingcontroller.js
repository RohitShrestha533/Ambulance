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

  // Validate if all fields are provided
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

    // If it's in the "Lat: <latitude>, Lng: <longitude>" format
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return {
      type: "Point",
      coordinates: [longitude, latitude], // [longitude, latitude]
    };
  };

  const formattedUserLocation = parseLocation(userLocation);
  const formattedDestination = parseLocation(destination);

  // Log the parsed values to check if the format is correct
  console.log("Formatted User Location:", formattedUserLocation);
  console.log("Formatted Destination:", formattedDestination);

  if (!formattedUserLocation || !formattedDestination) {
    return res.status(400).json({ message: "Invalid location format" });
  }

  try {
    // Assuming req.user contains the authenticated user's ID
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    // Create a new booking entry
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

    // Save the booking
    const savedBooking = await newBooking.save();

    // Send response
    res.status(200).json(savedBooking);
  } catch (error) {
    console.error("Error booking ambulance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const driverId = req.driver.driverId;

    const bookings = await Booking.find({ driverId: driverId }).select(
      " userlocation destinationlocation price bookingstatus"
    );

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
