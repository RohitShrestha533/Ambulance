import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String },
    registrationNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    adminName: { type: String },
    adminContact: { type: Number, unique: true },
    password: { type: String },
    ambulanceCount: { type: Number },
    emergencyContact: { type: Number, unique: true },
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    ambulances: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" }],
    approved: { type: String },
    lastLogin: {
      type: Date,
      default: Date.now,
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
