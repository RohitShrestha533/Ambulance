import bcrypt from "bcrypt";
const saltRounds = 10;
import { Driver } from "../models/driver.js";
import { Hospital } from "../models/hospital.js";

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

  // Validate phone number format
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  try {
    // Fetch the hospital ID from the request
    const hospitalId = req.hospital?.hospitalId;
    if (!hospitalId) {
      return res.status(400).send({ message: "Hospital ID is missing." });
    }

    // Find the hospital
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ message: "Hospital not found." });
    }

    // Count the number of drivers already associated with this hospital
    const currentDriverCount = await Driver.countDocuments({
      hospital: hospitalId,
    });

    // Check if the hospital has reached its driver limit
    if (currentDriverCount >= hospital.ambulanceCount) {
      return res
        .status(400)
        .send({ message: "Driver limit reached. Cannot add more drivers." });
    }

    // Check for existing driver
    const existingDriver = await Driver.findOne({
      $or: [{ email }, { ambulanceNumber }, { licenseNumber }],
    });

    if (existingDriver) {
      return res.status(400).send({ message: "Driver already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the new driver
    const newDriver = await Driver.create({
      driverName,
      ambulanceNumber,
      licenseNumber,
      phone,
      ambulanceType,
      email,
      password: hashedPassword,
      hospitalName: hospital.hospitalName,
      hospital: hospitalId,
    });
    // Update the hospital's drivers array with the new driver's ID
    hospital.drivers.push(newDriver._id);
    await hospital.save();
    res
      .status(201)
      .send({ status: "ok", data: "Driver registered successfully." });
  } catch (error) {
    console.error("Error during driver registration:", error.message);
    res
      .status(500)
      .send({ status: "error", message: "Internal server error." });
  }
};
