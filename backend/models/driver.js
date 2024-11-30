import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone: { type: String, unique: true },  
    password: String,
    fullname: String,
    ambulanceType: String,
    licenseNumber: { type: String, unique: true }, 
    ambulanceNumber: String,
    hospitalName: String,
    gender: String,
    Dob: Date,
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: { type: String, enum: ['Point'], required: true },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

driverSchema.index({ location: '2dsphere' });

export const Driver = mongoose.model("Driver", driverSchema);
