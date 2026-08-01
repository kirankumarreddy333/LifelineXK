const Donor = require("../models/Donor");
const { asyncHandler } = require("../utils/asyncHandler");
const { bloodCompatibility } = require("../data/seedData");

// @desc    Get all donors (with filters + pagination)
// @route   GET /api/donors?state=&district=&city=&bloodGroup=&available=&verified=&page=&limit=&q=
// @access  Public
exports.getDonors = asyncHandler(async (req, res) => {
  const { state, district, city, bloodGroup, available, verified, q, page = 1, limit = 12 } = req.query;

  const query = {};

  if (state) query.state = state;
  if (district) query.district = district;
  if (city) query.city = { $regex: city, $options: "i" };
  if (bloodGroup) query.bloodGroup = bloodGroup;
  if (available === "true") query.available = true;
  if (available === "false") query.available = false;
  if (verified === "true") query.verified = true;
  if (verified === "false") query.verified = false;

  // Text search across name, city, blood group
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
      { state: { $regex: q, $options: "i" } },
      { district: { $regex: q, $options: "i" } },
      { bloodGroup: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await Donor.countDocuments(query);
  const donors = await Donor.find(query)
    .sort({ verified: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.json({
    donors,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
  });
});

// @desc    Legacy: Get all donors (flat array - kept for backwards compatibility)
// @route   GET /api/donors/all
// @access  Public
exports.getAllDonorsLegacy = asyncHandler(async (req, res) => {
  const donors = await Donor.find().sort({ createdAt: -1 });
  res.json(donors);
});

// @desc    Add donor (legacy form)
// @route   POST /api/donors
// @access  Public
exports.addDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.create(req.body);
  res.status(201).json(donor);
});

// @desc    Search donors (legacy path)
// @route   GET /api/donors/search/:key
// @access  Public
exports.searchDonors = asyncHandler(async (req, res) => {
  const key = req.params.key;
  const donors = await Donor.find({
    $or: [
      { name: { $regex: key, $options: "i" } },
      { city: { $regex: key, $options: "i" } },
      { bloodGroup: { $regex: key, $options: "i" } },
    ],
  });
  res.json(donors);
});

// @desc    Get single donor
// @route   GET /api/donors/:id
// @access  Public
exports.getDonorById = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }
  res.json(donor);
});

// @desc    Update donor
// @route   PUT /api/donors/:id
// @access  Public
exports.updateDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }
  res.json(donor);
});

// @desc    Delete donor
// @route   DELETE /api/donors/:id
// @access  Public
exports.deleteDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findByIdAndDelete(req.params.id);
  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }
  res.json({ message: "Donor deleted successfully" });
});

// @desc    Get distinct filter options
// @route   GET /api/donors/filters/options
// @access  Public
exports.getFilterOptions = asyncHandler(async (req, res) => {
  const [states, cities] = await Promise.all([
    Donor.distinct("state"),
    Donor.distinct("city"),
  ]);
  res.json({
    states: states.filter(Boolean).sort(),
    cities: cities.filter(Boolean).sort(),
  });
});

// @desc    Blood compatibility for a recipient's blood group
// @route   GET /api/donors/compatibility/:bloodGroup
// @access  Public
exports.getCompatibility = asyncHandler(async (req, res) => {
  const { bloodGroup } = req.params;
  const compatible = bloodCompatibility[bloodGroup];
  if (!compatible) {
    res.status(400);
    throw new Error("Invalid blood group");
  }
  res.json({ recipient: bloodGroup, compatibleDonors: compatible });
});

// @desc    Nearby donors (by state/city for emergency)
// @route   GET /api/donors/nearby?state=&city=&bloodGroup=
// @access  Public
exports.getNearbyDonors = asyncHandler(async (req, res) => {
  const { state, city, bloodGroup, limit = 10 } = req.query;
  const query = { available: true, verified: true };
  if (state) query.state = state;
  if (city) query.city = { $regex: city, $options: "i" };
  if (bloodGroup) query.bloodGroup = bloodGroup;

  const donors = await Donor.find(query)
    .select("name bloodGroup phone city state district avatar verified")
    .limit(parseInt(limit) || 10);

  res.json(donors);
});

