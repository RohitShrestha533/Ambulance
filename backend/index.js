import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { Admin } from "./models/admin.js";
import { User } from "./models/user.js";
import { Driver } from "./models/driver.js";
import session from "express-session";
import { connectDB } from "./db/connectDB.js";
import router from "./routes/route.js";
import userRoutes from "./routes/userroute.js";
import adminRoutes from "./routes/adminroute.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Hospital } from "./models/hospital.js";
import bcrypt from "bcrypt";
const saltRounds = 10;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8081",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("CORS")) {
    console.error("CORS error: ", err);
    return res.status(403).send("CORS error: Request blocked.");
  }
  next(err);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "2019/08/26",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

// Generate OTP function
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
}
// Create the email transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or any other service you prefer
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP to user's email
const sendOTP = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP for Password Reset",
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("OTP sent: " + info.response);
    }
  });
};

let otpStorage = {}; // This will hold the OTP temporarily (usually you store this in a database)

app.post("/sendOtp", async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  otpStorage[email] = otp; // Store OTP temporarily

  // Send OTP to user's email
  sendOTP(email, otp);

  res.json({ message: "OTP sent to your email" });
});
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).send({ message: "User not found" });
  }
  const otp = generateOTP();
  otpStorage[email] = otp; // Store OTP temporarily

  // Send OTP to user's email
  sendOTP(email, otp);

  res.json({ message: "OTP sent to your email" });
});
app.post("/hospital/forgot-password", async (req, res) => {
  const { email } = req.body;
  const hospital = await Hospital.findOne({ email });
  if (!hospital) {
    return res.status(404).send({ message: "User not found" });
  }
  const otp = generateOTP();
  otpStorage[email] = otp; // Store OTP temporarily

  // Send OTP to user's email
  sendOTP(email, otp);

  res.json({ message: "OTP sent to your email" });
});
app.post("/api/forgot-password", async (req, res) => {
  const { email, role } = req.body;
  let result;
  if (role === "User") {
    result = await User.findOne({ email });
  } else {
    result = await Driver.findOne({ email });
  }
  if (!result) {
    return res.status(404).send({ message: "User not found" });
  }
  const otp = generateOTP();
  otpStorage[email] = otp; // Store OTP temporarily

  // Send OTP to user's email
  sendOTP(email, otp);

  res.json({ message: "OTP sent to your email" });
});
app.post("/api/change-password", async (req, res) => {
  const { email, newPassword, role } = req.body;
  try {
    console.log(email, newPassword, role);
    let fp;
    if (role === "User") {
      fp = await User.findOne({ email: email });
    } else {
      fp = await Driver.findOne({ email: email });
    }
    if (!fp) {
      return res.status(404).send({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    fp.password = hashedPassword;
    await fp.save();

    res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Endpoint for verifying OTP
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStorage[email] === otp) {
    res.json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});
app.use("/admin", adminRoutes);
app.use("/", userRoutes);
app.use("/", router);
app.get("/", (req, res) => {
  res.send("hi");
});
app.listen(PORT, "0.0.0.0", () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
