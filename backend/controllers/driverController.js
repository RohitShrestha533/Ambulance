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

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  const oldDriver = await Driver.findOne({
    $or: [
      { email: email },
      { ambulanceNumber: ambulanceNumber },
      { licenseNumber: licenseNumber },
    ],
  });

  if (oldDriver) {
    return res.status(400).send({ message: "Driver already Registered" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const hospitalId = req.hospital.hospitalId;
  try {
    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
      return res.status(404).send("Hospital not found");
    }

    await Driver.create({
      driverName,
      ambulanceNumber,
      licenseNumber,
      phone,
      ambulanceType,
      email: email,
      password: hashedPassword,
      hospitalName: hospital.hospitalName,
    });

    res.send({ status: "ok", data: "Driver detail sent" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};
