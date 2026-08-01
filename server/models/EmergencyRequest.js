const mongoose = require("mongoose");

const emergencyRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: { type: String, required: true, trim: true },
    bloodGroup: { type: String, required: true },
    units: { type: Number, default: 1, min: 1 },
    hospitalName: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "fulfilled", "closed"],
      default: "open",
    },
    fulfilledBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true }
);

emergencyRequestSchema.index({ status: 1, bloodGroup: 1, expiresAt: 1 });

module.exports = mongoose.model("EmergencyRequest", emergencyRequestSchema);

