import bcrypt from "bcrypt";
const saltRounds = 10;
import { Hospital } from "../models/hospital.js";
import jwt from "jsonwebtoken";

const hospitalJWT = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies.hospitaltoken;

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

    const unverifiedCount = await Hospital.countDocuments({ approved: "no" });

    // console.log("Unverified Hospitals:", unverifiedHospitals);
    // console.log("Unverified Hospitals Count:", unverifiedCount);

    res
      .status(200)
      .json({ count: unverifiedCount, hospitals: unverifiedHospitals });
  } catch (error) {
    console.error("Error fetching unverified hospitals:", error);
    res.status(500).json({ error: "Failed to fetch unverified hospitals" });
  }
};

export const approveHospital = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { approved: "yes" },
      { new: true }
    );

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    res.status(200).json(hospital);
  } catch (error) {
    console.error("Error approving hospital:", error);
    res.status(500).json({ error: "Failed to approve hospital" });
  }
};

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

  // console.log("Received data:", req.body);

  // Validation
  const phoneRegex = /^[0-9]{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !hospitalName ||
    !registrationNumber ||
    !address ||
    !email ||
    !adminName ||
    !adminContact ||
    !password ||
    !emergencyContact
  ) {
    return res.status(400).send({ message: "All fields are required." });
  }

  if (!phoneRegex.test(adminContact) || !phoneRegex.test(emergencyContact)) {
    return res
      .status(400)
      .send({ message: "Contact numbers must be 10 digits." });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: "Invalid email format." });
  }

  try {
    const existingHospital = await Hospital.findOne({
      $or: [
        { email: email },
        { registrationNumber: registrationNumber },
        { adminContact: adminContact },
        { emergencyContact: emergencyContact },
      ],
    });

    if (existingHospital) {
      return res.status(400).send({ message: "Hospital already registered." });
    }
    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return res.status(400).send({
        message:
          "Coordinates must be an array with two numbers: [longitude, latitude].",
      });
    }

    const [longitude, latitude] = coordinates;
    if (typeof longitude !== "number" || typeof latitude !== "number") {
      return res.status(400).send({
        message: "Coordinates should be numbers.",
      });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Default approval status
    const approved = "no";

    // Create hospital record
    const newHospital = await Hospital.create({
      hospitalName,
      registrationNumber,
      address,
      email,
      adminName,
      adminContact,
      password: hashedPassword,
      ambulanceCount,
      hospitalType,
      operatingHours,
      location: { type: "Point", coordinates: [longitude, latitude] },
      emergencyContact,
      approved,
    });

    res.status(200).send({
      status: "ok",
      message: "Hospital registered successfully.",
      // hospitalId: newHospital._id,
    });
  } catch (error) {
    console.error("Error registering hospital:", error.message);
    res.status(500).send({
      status: "error",
      message: "Internal server error. Please try again later.",
    });
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
      // console.log("Generated Token:", token); // Logs the token if successful
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
