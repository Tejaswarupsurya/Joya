const express = require("express");
const router = express.Router();

//middlewares
const { isLoggedIn, requireRole } = require("../middleware.js");

//controllers
const adminController = require("../controllers/admin.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");

//routes

// Admin dashboard
router.get(
  "/admin/dashboard",
  isLoggedIn,
  requireRole("admin"),
  wrapAsync(adminController.listAllApplications)
);
router.post(
  "/admin/:userId/approve",
  isLoggedIn,
  requireRole("admin"),
  wrapAsync(adminController.approveApplication)
);

router.post(
  "/admin/:userId/reject",
  isLoggedIn,
  requireRole("admin"),
  wrapAsync(adminController.rejectApplication)
);

// Admin email recovery for locked out users
router.post(
  "/admin/email-recovery",
  isLoggedIn,
  requireRole("admin"),
  wrapAsync(adminController.adminEmailRecovery)
);

module.exports = router;
