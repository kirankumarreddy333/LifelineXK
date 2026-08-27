const mongoose = require("mongoose");

const donationHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "Donor" },
    recipientName: { type: String, default: "" },
    bloodGroup: { type: String, required: true },
    units: { type: Number, default: 1, min: 1 },
    hospitalName: { type: String, default: "" },
    location: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    pointsEarned: { type: Number, default: 0 },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

donationHistorySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model("DonationHistory", donationHistorySchema);

