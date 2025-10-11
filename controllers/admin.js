//mongodb Section
const User = require("../models/user.js");
const emailService = require("../utils/emailService.js");

// List all host applications (pending, approved, rejected) with filtering UI
module.exports.listAllApplications = async (req, res) => {
  try {
    const allApplications = await User.find({
      "host.status": { $in: ["pending", "approved", "rejected"] },
    }).select("username email host role");

    res.render("admin/dashboard.ejs", {
      applications: allApplications,
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching host applications:", error);
    req.flash("error", "Failed to load host applications.");
    res.redirect("/listings");
  }
};

// Approve host application
module.exports.approveApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/admin/pending");
    }

    if (user.host.status !== "pending") {
      req.flash("error", "Application is not in pending status.");
      return res.redirect("/admin/pending");
    }

    // Update user to approved host
    user.host.status = "approved";
    user.host.approvedAt = new Date();
    user.host.isHost = true;
    user.role = "host";

    await user.save();

    // Send approval email
    try {
      await emailService.sendHostApplicationUpdate(
        user.email,
        user.username,
        "approved",
        "Congratulations! Your host application has been approved. You can now start listing your properties on Joya and welcome guests to your space."
      );
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError);
    }

    req.flash(
      "success",
      `Host application for ${user.username} has been approved successfully!`
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error approving application:", error);
    req.flash("error", "Failed to approve application.");
    res.redirect("/admin/dashboard");
  }
};

// Reject host application
module.exports.rejectApplication = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/admin/pending");
    }

    if (user.host.status !== "pending") {
      req.flash("error", "Application is not in pending status.");
      return res.redirect("/admin/pending");
    }

    // Update user to rejected
    user.host.status = "rejected";
    user.host.isHost = false;
    // Keep role as "user" since they're not approved as host

    await user.save();

    // Send rejection email
    try {
      await emailService.sendHostApplicationUpdate(
        user.email,
        user.username,
        "rejected",
        "Thank you for your interest in becoming a host on Joya. After reviewing your application, we're unable to approve it at this time. You're welcome to reapply in the future after addressing any concerns."
      );
    } catch (emailError) {
      console.error("Failed to send rejection email:", emailError);
    }

    req.flash(
      "success",
      `Host application for ${user.username} has been rejected.`
    );
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.error("Error rejecting application:", error);
    req.flash("error", "Failed to reject application.");
    res.redirect("/admin/dashboard");
  }
};

// Admin Email Recovery - Help users who entered wrong email during signup
module.exports.adminEmailRecovery = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    // Generate new verification token
    const crypto = require("crypto");
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Update email and reset verification
    user.email = newEmail;
    user.isEmailVerified = false;
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send verification email to new address
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/verify-email/${verificationToken}`;
    const emailResult = await emailService.sendEmailVerification(
      newEmail,
      user.username,
      verificationUrl
    );

    if (emailResult.success) {
      res.json({
        success: true,
        message: `Email updated to ${newEmail}. Verification email sent.`,
      });
    } else {
      res.json({
        success: true,
        message: `Email updated to ${newEmail}. Verification email will be sent shortly.`,
      });
    }
  } catch (error) {
    console.error("Error in admin email recovery:", error);
    res.status(500).json({ success: false, error: "Failed to update email" });
  }
};
