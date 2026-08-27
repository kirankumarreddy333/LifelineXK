const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: { type: String, required: true, trim: true },
    bloodGroup: { type: String, required: true },
    units: { type: Number, default: 1, min: 1 },
    hospitalName: { type: String, default: "" },
    location: { type: String, default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    contactName: { type: String, required: true, trim: true },
    contactPhone: { type: String, required: true },
    urgency: {
      type: String,
      enum: ["normal", "urgent", "emergency"],
      default: "normal",
    },
    reason: { type: String, default: "" },
    status: {
      type: String,
      enum: ["open", "fulfilled", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ bloodGroup: 1, status: 1, urgency: 1 });

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);

