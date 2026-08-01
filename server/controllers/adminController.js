const User = require("../models/User");
const Donor = require("../models/Donor");
const BloodRequest = require("../models/BloodRequest");
const EmergencyRequest = require("../models/EmergencyRequest");
const Hospital = require("../models/Hospital");
const DonationHistory = require("../models/DonationHistory");
const Notification = require("../models/Notification");
const { asyncHandler } = require("../utils/asyncHandler");

// @desc    Admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalDonors, verifiedDonors, totalRequests, openRequests, emergencies, totalHospitals, totalDonations] =
    await Promise.all([
      User.countDocuments(),
      Donor.countDocuments(),
      Donor.countDocuments({ verified: true }),
      BloodRequest.countDocuments(),
      BloodRequest.countDocuments({ status: "open" }),
      EmergencyRequest.countDocuments({ status: "open" }),
      Hospital.countDocuments(),
      DonationHistory.countDocuments(),
    ]);

  res.json({
    totalUsers,
    totalDonors,
    verifiedDonors,
    totalRequests,
    openRequests,
    emergencies,
    totalHospitals,
    totalDonations,
  });
});

// @desc    Blood group distribution (for charts)
// @route   GET /api/admin/charts/blood-groups
// @access  Private/Admin
exports.getBloodGroupChart = asyncHandler(async (req, res) => {
  const donors = await Donor.find().select("bloodGroup");
  const map = {};
  donors.forEach((d) => {
    map[d.bloodGroup] = (map[d.bloodGroup] || 0) + 1;
  });
  const labels = Object.keys(map);
  const data = labels.map((l) => map[l]);
  res.json({ labels, data });
});

// @desc    Donations over time (last 30 days)
// @route   GET /api/admin/charts/donations-trend
// @access  Private/Admin
exports.getDonationsTrend = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const donations = await DonationHistory.find({ date: { $gte: since } }).select("date");

  const labels = [];
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    labels.push(key.slice(5));
    data.push(donations.filter((x) => x.date.toISOString().slice(0, 10) === key).length);
  }

  res.json({ labels, data });
});

// @desc    Requests by status (pie)
// @route   GET /api/admin/charts/requests-status
// @access  Private/Admin
exports.getRequestsStatusChart = asyncHandler(async (req, res) => {
  const [open, fulfilled, closed] = await Promise.all([
    BloodRequest.countDocuments({ status: "open" }),
    BloodRequest.countDocuments({ status: "fulfilled" }),
    BloodRequest.countDocuments({ status: "closed" }),
  ]);
  res.json({
    labels: ["Open", "Fulfilled", "Closed"],
    data: [open, fulfilled, closed],
  });
});

// @desc    Manage users (list with filters)
// @route   GET /api/admin/users?q=&role=&page=&limit=
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const { q, role, page = 1, limit = 10 } = req.query;
  const query = {};
  if (role) query.role = role;
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.json({ users, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await Donor.deleteMany({ user: user._id });
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

// @desc    Approve donor (make verified)
// @route   PUT /api/admin/donors/:id/approve
// @access  Private/Admin
exports.approveDonor = asyncHandler(async (req, res) => {
  const donor = await Donor.findById(req.params.id);
  if (!donor) {
    res.status(404);
    throw new Error("Donor not found");
  }
  donor.verified = true;
  await donor.save();

  if (donor.user) {
    await User.findByIdAndUpdate(donor.user, { isApproved: true });
    await Notification.create({
      user: donor.user,
      type: "approval",
      title: "✅ Donor profile verified!",
      message: "Congratulations! Your donor profile has been approved and is now visible publicly.",
      link: "/profile",
    });
  }

  res.json(donor);
});

// @desc    List all donors for admin (with approval state)
// @route   GET /api/admin/donors?q=&verified=&page=&limit=
// @access  Private/Admin
exports.getAdminDonors = asyncHandler(async (req, res) => {
  const { q, verified, page = 1, limit = 10 } = req.query;
  const query = {};
  if (verified === "true") query.verified = true;
  if (verified === "false") query.verified = false;
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
      { bloodGroup: { $regex: q, $options: "i" } },
    ];
  }

  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const skip = (pageNum - 1) * limitNum;

  const total = await Donor.countDocuments(query);
  const donors = await Donor.find(query)
    .sort({ verified: 1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.json({ donors, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

// @desc    Manage hospitals (list all for admin)
// @route   GET /api/admin/hospitals
// @access  Private/Admin
exports.getAdminHospitals = asyncHandler(async (req, res) => {
  const hospitals = await Hospital.find().sort({ createdAt: -1 });
  res.json(hospitals);
});

// @desc    Manage requests (list all for admin)
// @route   GET /api/admin/requests
// @access  Private/Admin
exports.getAdminRequests = asyncHandler(async (req, res) => {
  const requests = await BloodRequest.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email phone");
  res.json(requests);
});

// @desc    Notify all donors (broadcast)
// @route   POST /api/admin/broadcast
// @access  Private/Admin
exports.broadcast = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    res.status(400);
    throw new Error("Title and message are required");
  }
  const donors = await Donor.find({}).select("user");
  const promises = donors
    .filter((d) => d.user)
    .map((d) =>
      Notification.create({
        user: d.user,
        type: "system",
        title,
        message,
        link: "/dashboard",
      })
    );
  await Promise.all(promises);
  res.json({ message: `Broadcast sent to ${donors.length} donors` });
});

