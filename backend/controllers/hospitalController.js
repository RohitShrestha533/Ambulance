import bcrypt from "bcrypt";
const saltRounds = 10;
import { Hospital } from "../models/hospital.js";
import jwt from "jsonwebtoken";

const hospitalJWT = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Token is not valid" });
    }

    req.hospital = decoded;
    next();
  });
};
export { hospitalJWT };

export const hospitalData = async (req, res) => {
  const hospitalId = req.hospital.hospitalId;

  try {
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).send({ message: "hospital not found" });
    }
    res.status(200).send({ hospital });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching hospital data", error: error.message });
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
      const token = jwt.sign(
        { hospitalId: hospital._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      console.log("Generated Token:", token); // Logs the token if successful
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

//logout

export const hospitalLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
};
