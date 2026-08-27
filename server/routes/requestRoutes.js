const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { handleValidation, validateRequest } = require("../utils/validators");

const {
  createRequest,
  getRequests,
  getRequestById,
  updateRequest,
  fulfillRequest,
  deleteRequest,
} = require("../controllers/requestController");

router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", protect, validateRequest, handleValidation, createRequest);
router.put("/:id", protect, updateRequest);
router.put("/:id/fulfill", protect, fulfillRequest);
router.delete("/:id", protect, deleteRequest);

module.exports = router;

