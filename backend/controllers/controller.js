import bcrypt from "bcrypt";
const saltRounds = 10;
import jwt from "jsonwebtoken";

import { User } from "../models/user.js";

//register
export const userRegister = async (req, res) => {
  const { email, phone, password, confirmpassword } = req.body;

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send({ message: "Phone number must be 10 digits." });
  }

  if (password != confirmpassword) {
    return res.status(400).send({ message: "Passwords do not match." });
  }
  const oldUser = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (oldUser) {
    return res.status(400).send({ message: "user already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    await User.create({
      email: email,
      phone,
      password: hashedPassword,
      Dob: null,
      gender: null,
      fullname: null,
    });
    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
};

// Login function with JWT authentication
export const userLogin = async (req, res) => {
  const { email, password, role } = req.body;
  let user;

  if (role === "user") {
    user = await User.findOne({ email: email });
  }

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Incorrect password" });
  }

  try {
    if (user && isPasswordCorrect) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "15d" }
      );

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

export const userLogout = async (req, res) => {
  res.status(200).send({ message: "Logged out successfully" });
};

// select user data
export const UserData = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ user });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching user data", error: error.message });
  }
};

// update user (using JWT)
export const UpdateUser = async (req, res) => {
  const { fullname, email, gender, dob } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, // Get userId from the JWT token
      { fullname, email, gender, Dob: dob },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
