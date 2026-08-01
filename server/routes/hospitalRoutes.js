const express = require("express");
const router = express.Router();

const {
  getHospitals,
  getHospitalById,
  addHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospitalController");

router.get("/", getHospitals);
router.get("/:id", getHospitalById);
router.post("/", addHospital);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital);

module.exports = router;

