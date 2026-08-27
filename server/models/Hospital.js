const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    phone: { type: String, default: "" },
    emergencyPhone: { type: String, default: "" },
    bloodBankAvailable: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    website: { type: String, default: "" },
  },
  { timestamps: true }
);

hospitalSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model("Hospital", hospitalSchema);

