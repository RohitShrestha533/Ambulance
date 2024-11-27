import bcrypt from "bcrypt";
const saltRounds = 10;

import { Admin } from "../models/admin.js";

export const checkAuth = async (req, res) => {
  if (req.session.adminId) {
    return res.status(200).send({ isAuthenticated: true });
  }
  return res.status(401).send({ isAuthenticated: false });
};

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
      req.session.adminId = admin._id;
      res.status(200).send({ status: 200, message: "Login successful" });
    } else {
      res.status(400).send({ status: 400, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

//logout
export const adminLogout = async (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: "Failed to log out" });
    }
    res.status(200).send({ message: "Logged out successfully" });
  });
};

// select admin data
export const AdminData = async (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).send({ message: "Not authenticated" });
  }

  try {
    const admin = await Admin.findById(req.session.adminId);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }
    console.log("Fetched :", req.session.adminId);
    res.status(200).send({ admin });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching admin data", error: error.message });
  }
};
//update  admin
export const UpdateAdmin = (req, res) => {
  if (!req.session.adminId) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  const { fullname, email, gender, dob } = req.body;

  Admin.findByIdAndUpdate(
    req.session.adminId,
    { fullname, email, gender, Dob: dob },
    { new: true }
  )
    .then((admin) => {
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "admin not found" });
      }
      res.json({ success: true, message: "admin updated successfully", admin });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    });
};
