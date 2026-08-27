const User = require("../models/User");
const Donor = require("../models/Donor");
const DonationHistory = require("../models/DonationHistory");
const Achievement = require("../models/Achievement");
const Notification = require("../models/Notification");
const { asyncHandler } = require("../utils/asyncHandler");
const { canDonateTo } = require("../data/seedData");

const DAYS_BETWEEN_DONATIONS = 90; // standard whole-blood interval

// @desc    Record a donation (admin or self)
// @route   POST /api/rewards/donations
// @access  Private
exports.recordDonation = asyncHandler(async (req, res) => {
  const { recipientName, hospitalName, location, units = 1 } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const pointsEarned = units * 100;
  user.totalDonations += units;
  user.rewardPoints += pointsEarned;
  user.lastDonation = new Date();
  await user.save();

  // Update donor record
  const donor = await Donor.findOne({ user: user._id });
  if (donor) {
    donor.totalDonations += units;
    donor.lastDonation = new Date();
    donor.rewardPoints += pointsEarned;
    // Donor ineligible for 90 days
    donor.available = false;
    await donor.save();
  }

  const history = await DonationHistory.create({
    user: user._id,
    donor: donor ? donor._id : undefined,
    recipientName,
    bloodGroup: user.bloodGroup,
    units,
    hospitalName,
    location,
    date: new Date(),
    pointsEarned,
    verifiedBy: req.user._id,
  });

  // Check achievements
  await checkAndAwardAchievements(user);

  res.status(201).json({ history, pointsEarned, totalPoints: user.rewardPoints });
});

// @desc    Get donation history for current user
// @route   GET /api/rewards/history
// @access  Private
exports.getMyDonationHistory = asyncHandler(async (req, res) => {
  const history = await DonationHistory.find({ user: req.user._id })
    .sort({ date: -1 })
    .limit(100);
  res.json(history);
});

// @desc    Get current user's achievements
// @route   GET /api/rewards/achievements
// @access  Private
exports.getMyAchievements = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("achievements");
  res.json(user.achievements);
});

// @desc    Get all achievements (public catalog)
// @route   GET /api/rewards/achievements/catalog
// @access  Public
exports.getAchievementCatalog = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find().sort({ points: 1 });
  res.json(achievements);
});

// @desc    Eligibility: is the user allowed to donate now?
// @route   GET /api/rewards/eligibility
// @access  Private
exports.getEligibility = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found");

  const now = new Date();
  let eligible = true;
  let daysUntilEligible = 0;

  if (user.lastDonation) {
    const elapsed = (now - new Date(user.lastDonation)) / (1000 * 60 * 60 * 24);
    if (elapsed < DAYS_BETWEEN_DONATIONS) {
      eligible = false;
      daysUntilEligible = Math.ceil(DAYS_BETWEEN_DONATIONS - elapsed);
    }
  }

  res.json({
    eligible,
    daysUntilEligible,
    nextEligibleDate: eligible
      ? null
      : new Date(
          new Date(user.lastDonation).getTime() +
            DAYS_BETWEEN_DONATIONS * 24 * 60 * 60 * 1000
        ),
    lastDonation: user.lastDonation,
    totalDonations: user.totalDonations,
  });
});

// @desc    Leaderboard (top donors by points)
// @route   GET /api/rewards/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res) => {
  const top = await User.find({ isDonor: true })
    .select("name avatar rewardPoints totalDonations bloodGroup city")
    .sort({ rewardPoints: -1 })
    .limit(20);
  res.json(top);
});

// @desc    Recent donations feed
// @route   GET /api/rewards/recent
// @access  Public
exports.getRecentDonations = asyncHandler(async (req, res) => {
  const recent = await DonationHistory.find()
    .sort({ date: -1 })
    .limit(10)
    .populate("user", "name avatar city");
  res.json(recent);
});

// @desc    Compatibility: what can a donor give to
// @route   GET /api/rewards/compatibility/:bloodGroup
// @access  Public
exports.getDonorCompatibility = asyncHandler(async (req, res) => {
  const { bloodGroup } = req.params;
  const canGive = canDonateTo[bloodGroup];
  if (!canGive) {
    res.status(400);
    throw new Error("Invalid blood group");
  }
  res.json({ donor: bloodGroup, canDonateTo: canGive });
});

// Helper: check & award achievements
const checkAndAwardAchievements = async (user) => {
  const catalog = await Achievement.find();
  const owned = user.achievements.map((a) => a.toString());

  const newlyEarned = [];

  for (const achievement of catalog) {
    if (owned.includes(achievement._id.toString())) continue;

    let earned = false;
    if (achievement.criteria.type === "donations") {
      earned = user.totalDonations >= achievement.criteria.value;
    } else if (achievement.criteria.type === "points") {
      earned = user.rewardPoints >= achievement.criteria.value;
    }

    if (earned) {
      newlyEarned.push(achievement._id);
      await Notification.create({
        user: user._id,
        type: "reward",
        title: `Achievement unlocked: ${achievement.name} ${achievement.icon}`,
        message: achievement.description,
        link: "/profile",
      });
    }
  }

  if (newlyEarned.length > 0) {
    user.achievements.push(...newlyEarned);
    await user.save();
  }
};

