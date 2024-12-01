import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    password: String,
    fullname: String,
    licenseNumber: { type: String, unique: true },
    hospitalName: String,
    gender: String,
    Dob: Date,
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    ambulanceNumber: { type: String, required: true },

    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }, // Reference to the hospital
    ambulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
      required: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

driverSchema.index({ location: "2dsphere" });

export const Driver = mongoose.model("Driver", driverSchema);
