const BloodRequest = require("../models/BloodRequest");
const Notification = require("../models/Notification");
const Donor = require("../models/Donor");
const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

// @desc    Create a blood request
// @route   POST /api/requests
// @access  Private
exports.createRequest = asyncHandler(async (req, res) => {
  const {
    patientName,
    bloodGroup,
    units,
    hospitalName,
    location,
    state,
    district,
    city,
    contactName,
    contactPhone,
    urgency,
    reason,
  } = req.body;

  const request = await BloodRequest.create({
    user: req.user._id,
    patientName,
    bloodGroup,
    units: units || 1,
    hospitalName,
    location,
    state,
    district,
    city,
    contactName,
    contactPhone,
    urgency: urgency || "normal",
    reason,
  });

  // Notify matching donors
  if (request.status === "open") {
    const matchingDonors = await Donor.find({
      bloodGroup,
      available: true,
      verified: true,
    }).select("user");

    const notificationPromises = matchingDonors.map((d) => {
      if (!d.user) return null;
      return Notification.create({
        user: d.user,
        type: "request",
        title: `Blood request for ${bloodGroup}`,
        message: `${patientName} needs ${units || 1} unit(s) of ${bloodGroup} blood at ${hospitalName || location || "a nearby hospital"}.`,
        link: "/blood-requests",
      });
    });
    await Promise.all(notificationPromises.filter(Boolean));
  }

  res.status(201).json(request);
});

// @desc    Get all requests (filtered)
// @route   GET /api/requests?bloodGroup=&urgency=&status=&city=&page=&limit=
// @access  Public
exports.getRequests = asyncHandler(async (req, res) => {
  const { bloodGroup, urgency, status, city, state, page = 1, limit = 9 } = req.query;
  const query = {};
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (urgency) query.urgency = urgency;
  if (status) query.status = status;
  if (city) query.city = { $regex: city, $options: "i" };
  if (state) query.state = state;

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 9;
  const skip = (pageNum - 1) * limitNum;

  const total = await BloodRequest.countDocuments(query);
  const requests = await BloodRequest.find(query)
    .sort({ urgency: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("user", "name email phone avatar");

  res.json({
    requests,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// @desc    Get request by id
// @route   GET /api/requests/:id
// @access  Public
exports.getRequestById = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id).populate("user", "name email phone");
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }
  res.json(request);
});

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (
    req.user.role !== "admin" &&
    request.user.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to update this request");
  }

  const updated = await BloodRequest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.json(updated);
});

// @desc    Mark request fulfilled
// @route   PUT /api/requests/:id/fulfill
// @access  Private
exports.fulfillRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  request.status = "fulfilled";
  await request.save();

  // Notify requester
  if (request.user) {
    await Notification.create({
      user: request.user,
      type: "system",
      title: "Request fulfilled 🎉",
      message: `Your blood request for ${request.bloodGroup} has been fulfilled.`,
      link: "/blood-requests",
    });
  }

  res.json(request);
});

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private/Admin
exports.deleteRequest = asyncHandler(async (req, res) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (
    req.user.role !== "admin" &&
    request.user.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this request");
  }

  await request.deleteOne();
  res.json({ message: "Request deleted" });
});

