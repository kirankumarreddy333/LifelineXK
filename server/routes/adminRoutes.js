const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");

const {
  getStats,
  getBloodGroupChart,
  getDonationsTrend,
  getRequestsStatusChart,
  getUsers,
  deleteUser,
  approveDonor,
  getAdminDonors,
  getAdminHospitals,
  getAdminRequests,
  broadcast,
} = require("../controllers/adminController");

// All admin routes require protect + admin
router.use(protect, admin);

router.get("/stats", getStats);
router.get("/charts/blood-groups", getBloodGroupChart);
router.get("/charts/donations-trend", getDonationsTrend);
router.get("/charts/requests-status", getRequestsStatusChart);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/donors", getAdminDonors);
router.put("/donors/:id/approve", approveDonor);
router.get("/hospitals", getAdminHospitals);
router.get("/requests", getAdminRequests);
router.post("/broadcast", broadcast);

module.exports = router;

