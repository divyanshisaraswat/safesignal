import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    type: String,
    message: String,
    simulated: { type: Boolean, default: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const journeySchema = new mongoose.Schema({
  token: { type: String, unique: true },      // owner's secret
  shareCode: { type: String, unique: true },  // given to trusted contact
  destination: String,
  contactName: String,
  expectedArrival: Date,
  status: {
    type: String,
    enum: ["Active", "Safe", "Delayed", "Need Assistance"],
    default: "Active",
  },
  alerts: [alertSchema],
  expiresAt: Date, // MongoDB deletes the document automatically after this time
});

// Privacy: auto-delete journeys.
journeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Journey", journeySchema);