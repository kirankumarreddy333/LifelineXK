const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: "" },
    bloodGroup: { type: String, required: true },
    phone: { type: String, required: true },
    age: { type: Number, min: 18, max: 65 },
    gender: { type: String, enum: ["Male", "Female", "Other", ""], default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, required: true },
    address: { type: String, default: "" },
    available: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    avatar: { type: String, default: "" },
    totalDonations: { type: Number, default: 0 },
    lastDonation: { type: Date, default: null },
    rewardPoints: { type: Number, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound indexes for fast filtered searches
donorSchema.index({ state: 1, district: 1, city: 1, bloodGroup: 1 });
donorSchema.index({ available: 1, verified: 1 });

module.exports = mongoose.model("Donor", donorSchema);

