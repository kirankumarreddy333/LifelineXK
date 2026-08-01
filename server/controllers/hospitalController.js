const Hospital = require("../models/Hospital");
const { asyncHandler } = require("../utils/asyncHandler");

// @desc    Get all hospitals
// @route   GET /api/hospitals?city=&state=&bloodBank=&q=&page=&limit=
// @access  Public
exports.getHospitals = asyncHandler(async (req, res) => {
  const { city, state, bloodBank, q, page = 1, limit = 9 } = req.query;
  const query = {};
  if (city) query.city = { $regex: city, $options: "i" };
  if (state) query.state = state;
  if (bloodBank === "true") query.bloodBankAvailable = true;
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 9;
  const skip = (pageNum - 1) * limitNum;

  const total = await Hospital.countDocuments(query);
  const hospitals = await Hospital.find(query)
    .sort({ verified: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.json({ hospitals, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

// @desc    Get hospital by id
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospitalById = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findById(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }
  res.json(hospital);
});

// @desc    Add hospital
// @route   POST /api/hospitals
// @access  Private/Admin
exports.addHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json(hospital);
});

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Private/Admin
exports.updateHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }
  res.json(hospital);
});

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Private/Admin
exports.deleteHospital = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findByIdAndDelete(req.params.id);
  if (!hospital) {
    res.status(404);
    throw new Error("Hospital not found");
  }
  res.json({ message: "Hospital deleted" });
});

