import bcrypt from "bcrypt";
const saltRounds = 10;

import { Admin } from "../models/admin.js";

import jwt from "jsonwebtoken";

//register
export const adminRegister = async (req, res) => {
  const { email, phone, password, confirmpassword } = req.body;

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  if (password != confirmpassword) {
    return res.status(400).send({ message: "Passwords do not match." });
  }
  const oldAdmin = await Admin.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (oldAdmin) {
    return res.status(400).send({ message: "admin already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await Admin.create({
      email: email,
      phone,
      password: hashedPassword,
      Dob: null,
      gender: null,
      fullname: null,
    });
    res.send({ status: "ok", data: "Admin Created" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  let admin,
    role = "admin";
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  if (role === "admin") {
    admin = await Admin.findOne({ email });
  }

  if (!admin) {
    console.log("not");
    return res.status(404).send({ message: "Admin not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, admin.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    if (admin && isPasswordCorrect) {
      const token = jwt.sign(
        { adminId: admin._id },
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

export const adminLogout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "Logged out successfully" });
};

export const AdminData = async (req, res) => {
  const adminId = req.admin.adminId;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    res.status(200).send({ admin });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching admin data", error: error.message });
  }
};
