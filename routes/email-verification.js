// Email Verification Routes and Controllers
// Add these routes to your user.js routes file

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

// Send email verification
router.post(
  "/send-verification",
  wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user.isEmailVerified) {
      return res.json({ success: false, error: "Email already verified" });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // UI MODE: Instead of sending email, show verification code directly
    const shortCode = verificationToken.substring(0, 8).toUpperCase();

    console.log(
      `📧 [UI-MODE] Verification code for ${user.email}: ${shortCode}`
    );

    // For production without email: automatically verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Return response for UI display
    res.json({
      success: true,
      message: `Email automatically verified! (Code was: ${shortCode})`,
      verificationCode: shortCode,
      showInUI: true,
      autoVerified: true,
    });
  })
);

// Verify email
router.get(
  "/verify-email/:token",
  wrapAsync(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Invalid or expired verification link");
      return res.redirect("/login");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    req.flash(
      "success",
      "Email verified successfully! You can now access all features."
    );
    res.redirect("/listings");
  })
);

module.exports = router;
