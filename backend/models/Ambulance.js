import mongoose from "mongoose";

const ambulanceSchema = new mongoose.Schema({
  ambulanceNumber: { type: String, required: true },
  ambulanceType: {
    type: String,
    required: true,
  },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
});

ambulanceSchema.index({ location: "2dsphere" });

export default mongoose.model("Ambulance", ambulanceSchema);
