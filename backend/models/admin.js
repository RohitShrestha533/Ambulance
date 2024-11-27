import mongoose from "mongoose";
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone: { type: Number, unique: true },
    password: String,
    fullname: String,
    gender: String,
    Dob: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("admin", adminSchema);
