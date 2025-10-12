// Email Verification Routes and Controllers
// Add these routes to your user.js routes file

const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user.js");
const emailService = require("../utils/emailService.js");
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

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/verify-email/${verificationToken}`;

    const emailResult = await emailService.sendEmailVerification(
      user.email,
      user.username,
      verificationUrl
    );

    if (emailResult.success) {
      res.json({ success: true, message: "Verification email sent!" });
    } else {
      res.status(500).json({
        success: false,
        error: `Failed to send email: ${emailResult.error}`,
      });
    }
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
