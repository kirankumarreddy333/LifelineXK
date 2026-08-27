const User = require("../models/User");
const Donor = require("../models/Donor");
const Notification = require("../models/Notification");
const generateToken = require("../utils/generateToken");
const { asyncHandler } = require("../utils/asyncHandler");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || "",
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isDonor: user.isDonor,
    isApproved: user.isApproved,
    rewardPoints: user.rewardPoints,
    token: generateToken(user._id),
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("achievements");
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, phone, avatar, bloodGroup, state, district, city, address } = req.body;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;
  if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
  if (state !== undefined) user.state = state;
  if (district !== undefined) user.district = district;
  if (city !== undefined) user.city = city;

  await user.save();

  // If profile updated and user is donor, keep donor doc in sync
  if (user.isDonor) {
    await Donor.findOneAndUpdate(
      { user: user._id },
      {
        name: user.name,
        bloodGroup: user.bloodGroup || undefined,
        phone: user.phone,
        avatar: user.avatar,
        state: user.state,
        district: user.district,
        city: user.city,
      },
      { new: true }
    );
  }

  res.json(user);
});

// @desc    Register as a donor
// @route   POST /api/auth/become-donor
// @access  Private
exports.becomeDonor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { bloodGroup, age, gender, state, district, city, address, phone, description } = req.body;

  if (!bloodGroup || !city) {
    res.status(400);
    throw new Error("Blood group and city are required");
  }

  user.isDonor = true;
  if (bloodGroup) user.bloodGroup = bloodGroup;
  if (state) user.state = state;
  if (district) user.district = district;
  if (city) user.city = city;
  if (phone) user.phone = phone;
  await user.save();

  // Create or update donor record
  let donor = await Donor.findOne({ user: user._id });
  if (donor) {
    donor.bloodGroup = bloodGroup;
    donor.state = state || user.state;
    donor.district = district || user.district;
    donor.city = city;
    donor.address = address || user.address;
    donor.age = age || undefined;
    donor.gender = gender || "";
    donor.description = description || "";
    donor.phone = phone || user.phone;
    donor.avatar = user.avatar;
    donor.available = true;
    await donor.save();
  } else {
    donor = await Donor.create({
      user: user._id,
      name: user.name,
      email: user.email,
      bloodGroup,
      phone: phone || user.phone,
      age: age || undefined,
      gender: gender || "",
      state: state || "",
      district: district || "",
      city,
      address: address || "",
      avatar: user.avatar,
      description: description || "",
      available: true,
    });
  }

  // Notify admins for approval
  await Notification.create({
    user: user._id,
    type: "approval",
    title: "Donor registration pending approval",
    message: `${user.name} registered as a donor. Approve to make them visible publicly.`,
    link: "/admin/donors",
  });

  res.status(201).json({
    message: "Donor registration submitted! Pending admin approval.",
    donor,
    isApproved: user.isApproved,
  });
});

// @desc    Get leaderboard
// @route   GET /api/auth/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const donors = await User.find({ isDonor: true })
    .select("name avatar rewardPoints totalDonations bloodGroup")
    .sort({ rewardPoints: -1 })
    .limit(20);

  res.json(donors);
});

