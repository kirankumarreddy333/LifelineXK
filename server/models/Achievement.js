const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "🏅" },
    points: { type: Number, default: 0 },
    criteria: {
      type: { type: String, enum: ["donations", "points"], default: "donations" },
      value: { type: Number, default: 1 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);

