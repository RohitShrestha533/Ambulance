import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance",
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ambulanceType: { type: String, required: true },
    distance: { type: Number, required: true },
    price: {
      type: Number,
    },
    userlocation: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    destinationlocation: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    bookingstatus: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
bookingSchema.index({ location: "2dsphere" });

export const Booking = mongoose.model("Booking", bookingSchema);
