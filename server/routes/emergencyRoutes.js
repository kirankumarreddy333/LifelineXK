const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  createEmergencyRequest,
  getEmergencyRequests,
  fulfillEmergency,
} = require("../controllers/emergencyController");

router.get("/", getEmergencyRequests);
router.post("/", createEmergencyRequest); // public for emergencies
router.put("/:id/fulfill", protect, fulfillEmergency);

module.exports = router;

