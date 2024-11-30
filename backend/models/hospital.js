import mongoose from "mongoose";
const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String },
    registrationNumber: { type: String, unique: true },
    address: { type: String },
    email: { type: String, unique: true },
    adminName: { type: String },
    adminContact: { type: Number, unique: true },
    password: { type: String },
    ambulanceCount: { type: Number },
    hospitalType: { type: String },
    operatingHours: { type: String },
    coordinates: { type: String },
    emergencyContact: { type: Number, unique: true },
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    approved: { type: String },
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

export const Hospital = mongoose.model("hospital", hospitalSchema);
