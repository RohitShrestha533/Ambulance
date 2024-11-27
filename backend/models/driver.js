import mongoose from "mongoose";
const driverSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone: { type: Number, unique: true },
    password: String,
    fullname: String,
    ambulanceType: String,
    licenseNumber: Number,
    ambulanceNumber: String,
    hospitalName: String,
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

export const Driver = mongoose.model("Driver", driverSchema);
