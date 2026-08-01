const EmergencyRequest = require("../models/EmergencyRequest");
const Notification = require("../models/Notification");
const Donor = require("../models/Donor");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

// @desc    Create emergency request
// @route   POST /api/emergency
// @access  Public
exports.createEmergencyRequest = asyncHandler(async (req, res) => {
  const {
    patientName,
    bloodGroup,
    units,
    hospitalName,
    location,
    city,
    state,
    contactName,
    contactPhone,
    reason,
  } = req.body;

  if (!bloodGroup || !hospitalName || !location || !contactPhone) {
    res.status(400);
    throw new Error("Blood group, hospital, location and contact phone are required");
  }

  const emergency = await EmergencyRequest.create({
    user: req.user ? req.user._id : undefined,
    patientName,
    bloodGroup,
    units: units || 1,
    hospitalName,
    location,
    city,
    state,
    contactName: contactName || "Unknown",
    contactPhone,
    reason,
  });

  // Notify ALL matching verified donors near the location
  const matchingDonors = await Donor.find({
    bloodGroup,
    available: true,
    verified: true,
  }).select("user name phone city");

  const notificationPromises = matchingDonors.map((d) => {
    if (!d.user) return null;
    return Notification.create({
      user: d.user,
      type: "emergency",
      title: `🚨 EMERGENCY: ${bloodGroup} needed`,
      message: `${patientName} urgently needs ${units || 1} unit(s) of ${bloodGroup} at ${hospitalName}, ${location}. Please help!`,
      link: "/emergency-board",
    });
  });
  await Promise.all(notificationPromises.filter(Boolean));

  res.status(201).json(emergency);
});

// @desc    Get emergency board (open emergency requests)
// @route   GET /api/emergency
// @access  Public
exports.getEmergencyRequests = asyncHandler(async (req, res) => {
  const { bloodGroup, city, state } = req.query;
  const query = { status: "open", expiresAt: { $gt: new Date() } };
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (city) query.city = { $regex: city, $options: "i" };
  if (state) query.state = state;

  const emergencies = await EmergencyRequest.find(query)
    .sort({ createdAt: -1 })
    .populate("user", "name phone avatar");

  res.json(emergencies);
});

// @desc    Mark emergency as fulfilled
// @route   PUT /api/emergency/:id/fulfill
// @access  Private
exports.fulfillEmergency = asyncHandler(async (req, res) => {
  const emergency = await EmergencyRequest.findById(req.params.id);
  if (!emergency) {
    res.status(404);
    throw new Error("Emergency request not found");
  }

  emergency.status = "fulfilled";
  if (req.user && !emergency.fulfilledBy.includes(req.user._id)) {
    emergency.fulfilledBy.push(req.user._id);
  }
  await emergency.save();

  res.json(emergency);
});

