const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

const {
  recordDonation,
  getMyDonationHistory,
  getMyAchievements,
  getAchievementCatalog,
  getEligibility,
  getLeaderboard,
  getRecentDonations,
  getDonorCompatibility,
} = require("../controllers/rewardController");

// Public
router.get("/achievements/catalog", getAchievementCatalog);
router.get("/leaderboard", getLeaderboard);
router.get("/recent", getRecentDonations);
router.get("/compatibility/:bloodGroup", getDonorCompatibility);

// Private
router.get("/history", protect, getMyDonationHistory);
router.get("/achievements", protect, getMyAchievements);
router.get("/eligibility", protect, getEligibility);
router.post("/donations", protect, recordDonation);

module.exports = router;

