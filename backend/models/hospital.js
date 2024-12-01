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
    emergencyContact: { type: Number, unique: true },
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    ambulances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" }],
    approved: { type: String },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true }
);

hospitalSchema.index({ location: "2dsphere" });

export const Hospital = mongoose.model("Hospital", hospitalSchema);
