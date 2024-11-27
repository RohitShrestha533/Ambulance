import bcrypt from "bcrypt";
const saltRounds = 10;
import { Hospital } from "../models/hospital.js";

export const hospitalData = async (req, res) => {
  console.log("Session data:", req.session); // Check session
  if (req.session.hospital_Name) {
    return res.send({ hospitalName: req.session.hospital_Name });
  } else {
    return res.status(404).send({ message: "No hospital data found" });
  }
};

export const getUnverifiedHospitals = async (req, res) => {
  try {
    console.log("Fetching unverified hospitals...");
    const unverifiedHospitals = await Hospital.find({ approved: "no" });
    console.log(unverifiedHospitals);

    res.status(200).json(unverifiedHospitals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unverified hospitals" });
  }
};

export const hospitalcheckAuth = async (req, res) => {
  if (req.session.hospitalId) {
    return res.status(200).send({ isAuthenticated: true });
  }
  return res.status(401).send({ isAuthenticated: false });
};
//register
export const hospitalRegister = async (req, res) => {
  const {
    hospitalName,
    registrationNumber,
    address,
    email,
    adminName,
    adminContact,
    password,
    ambulanceCount,
    hospitalType,
    operatingHours,
    coordinates,
    emergencyContact,
  } = req.body;
  console.log(req.body);
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(adminContact)) {
    return res
      .status(400)
      .send({ message: "adminContact number must be 10 digits." });
  }

  const oldHospital = await Hospital.findOne({
    $or: [{ email: email }, { registrationNumber: registrationNumber }],
  });

  if (oldHospital) {
    return res.status(400).send({ message: "Hospital already Registered" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const approved = "no";

  try {
    await Hospital.create({
      email: email,
      password: hashedPassword,
      hospitalName,
      registrationNumber,
      address,
      adminName,
      adminContact,
      ambulanceCount,
      hospitalType,
      operatingHours,
      coordinates,
      emergencyContact,
      approved: approved,
    });
    res.send({ status: "ok", data: "Hospital detail sent" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
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
      req.session.hospitalId = hospital._id;
      req.session.hospital_Name = hospital.hospitalName;
      console.log(req.session);
      res.status(200).send({ status: 200, message: "Login successful" });
    } else {
      res.status(400).send({ status: 400, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//logout
export const hospitalLogout = async (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to log out" });
    }
    console.log(req.session);
    res.status(200).send({ message: "Logged out successfully" });
  });
};
