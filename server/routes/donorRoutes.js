const express = require("express");
const router = express.Router();

const {
  getDonors,
  getAllDonorsLegacy,
  addDonor,
  searchDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  getFilterOptions,
  getCompatibility,
  getNearbyDonors,
} = require("../controllers/donorController");
const { handleValidation, validateDonor } = require("../utils/validators");

// SEARCH FIRST (kept for legacy compatibility)
router.get("/search/:key", searchDonors);

// Filters options
router.get("/filters/options", getFilterOptions);

// Compatibility
router.get("/compatibility/:bloodGroup", getCompatibility);

// Nearby donors (emergency)
router.get("/nearby", getNearbyDonors);

// Legacy flat array
router.get("/all", getAllDonorsLegacy);

// Main list (paginated + filters)
router.get("/", getDonors);

// Single donor
router.get("/:id", getDonorById);

// ADD (with validation)
router.post("/", validateDonor, handleValidation, addDonor);

// UPDATE
router.put("/:id", updateDonor);

// DELETE
router.delete("/:id", deleteDonor);

module.exports = router;

