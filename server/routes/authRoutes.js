const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { handleValidation, validateRegister, validateLogin } = require("../utils/validators");

const {
  register,
  login,
  getMe,
  updateProfile,
  becomeDonor,
  getLeaderboard,
} = require("../controllers/authController");

// Public
router.post("/register", validateRegister, handleValidation, register);
router.post("/login", validateLogin, handleValidation, login);
router.get("/leaderboard", getLeaderboard);

// Private
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.post("/become-donor", protect, becomeDonor);

module.exports = router;

