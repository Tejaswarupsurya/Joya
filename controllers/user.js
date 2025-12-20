//mongodb Section
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService.js");
const {
  generateOTP,
  generateOTPToken,
  verifyOTPToken,
  canResendOTP,
  getRemainingCooldown,
} = require("../utils/jwtHelper.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.sendSignupOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email already registered. Please log in.",
        });
    }

    // Check cooldown if exists in session
    if (req.session.otpData && req.session.otpData.email === email) {
      if (!canResendOTP(req.session.otpData.lastSentAt)) {
        const remaining = getRemainingCooldown(req.session.otpData.lastSentAt);
        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting a new code`,
          remainingSeconds: remaining,
        });
      }
    }

    // Generate OTP and token
    const otp = generateOTP();
    const otpToken = generateOTPToken(email, otp);

    // Store in session (not in database yet)
    req.session.otpData = {
      email,
      token: otpToken,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      lastSentAt: new Date(),
      verified: false,
    };

    // Send OTP email
    await sendOTPEmail(email, otp, "User");
    console.log(`📧 Signup OTP sent to ${email}`);

    res.json({ success: true, message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Send signup OTP error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send verification code" });
  }
};

module.exports.verifySignupOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Check if OTP data exists in session
    if (!req.session.otpData || req.session.otpData.email !== email) {
      return res
        .status(400)
        .json({
          success: false,
          message: "No verification pending for this email",
        });
    }

    // Check if expired
    if (Date.now() > req.session.otpData.expires) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Verification code expired. Please request a new one.",
        });
    }

    // Verify OTP
    const payload = verifyOTPToken(req.session.otpData.token);
    if (!payload || payload.email !== email || payload.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    // Mark as verified in session
    req.session.otpData.verified = true;
    console.log(`✅ Email verified in session: ${email}`);

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

module.exports.signup = async (req, res) => {
  let { username, email, password, confirm } = req.body;

  // Check if email was verified in session
  if (
    !req.session.otpData ||
    req.session.otpData.email !== email ||
    !req.session.otpData.verified
  ) {
    req.flash("error", "Please verify your email first!");
    return res.redirect("/signup");
  }

  if (password !== confirm) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("/signup");
  }

  const existingEmailUser = await User.findOne({ email });
  if (existingEmailUser) {
    req.flash("error", "Email already exists. Please log in!");
    return res.redirect("/login");
  }

  // Create user with verified email
  const newUser = new User({ email, username, isEmailVerified: true });
  const registeredUser = await User.register(newUser, password);

  // Send welcome email
  try {
    await sendWelcomeEmail(email, username);
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
    // Continue even if welcome email fails
  }

  // Clear OTP session data
  delete req.session.otpData;

  // Log in the user
  const redirectUrl = req.session.redirectUrl || "/listings";
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Welcome to Joya! Your account has been created.");
    res.redirect(redirectUrl);
  });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Joya!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.renderUpdateForm = (req, res) => {
  res.render("./users/update.ejs");
};

module.exports.update = async (req, res) => {
  const { currentPassword, password, confirm } = req.body;
  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(currentPassword);
  if (!isMatch.user) {
    req.flash("error", "Current password is incorrect!");
    return res.redirect("/update-password");
  }
  if (password !== confirm) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("/update-password");
  }
  await user.setPassword(password);
  await user.save();
  req.flash("success", "Password updated successfully!");
  res.redirect("/listings");
};

module.exports.renderForgotForm = (req, res) => {
  res.render("./users/forgot.ejs");
};

module.exports.renderChangeEmailForm = (req, res) => {
  res.render("./users/change-email.ejs", { user: req.user });
};

module.exports.changeEmail = async (req, res) => {
  const { newEmail, password } = req.body;

  // Verify current password
  const user = await User.findById(req.user._id);
  const isMatch = await user.authenticate(password);
  if (!isMatch.user) {
    req.flash("error", "Current password is incorrect!");
    return res.redirect("/change-email");
  }

  // Check if new email already exists
  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    req.flash("error", "Email already exists. Please use a different email.");
    return res.redirect("/change-email");
  }

  // Update email and auto-verify (no email sending required)
  user.email = newEmail;
  user.isEmailVerified = true; // Auto-verify in UI mode
  console.log(`📧 [UI-MODE] Auto-verified new email: ${newEmail}`);
  await user.save();

  req.flash("success", "Email updated and automatically verified!");
  res.redirect("/dashboard");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Bye...See you again!");
    res.redirect("/listings");
  });
};

// Smart Dashboard - Routes users based on their role
module.exports.renderDashboard = async (req, res) => {
  try {
    // Route based on user role
    if (req.user.role === "admin") {
      return res.redirect("/admin/dashboard");
    }

    if (req.user.role === "host") {
      // Host Dashboard
      return await renderHostDashboard(req, res);
    }

    // Default: Regular user dashboard
    const userId = req.user._id;

    // First, expire any old pending bookings
    await Booking.expireOldBookings();

    // Get all bookings for the user
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "listing",
        select: "title location country image price",
        populate: {
          path: "reviews",
        },
      })
      .sort({ createdAt: -1 });

    // Calculate average rating for each listing
    const { getAvgRating } = require("../utils/review.js");
    bookings.forEach((booking) => {
      if (booking.listing && booking.listing.reviews) {
        booking.listing.avgRating = getAvgRating(booking.listing.reviews);
      }
    });

    // Separate bookings by status and dates
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.checkOut) > new Date()
    );

    const pastBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.checkOut) <= new Date()
    );

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    );

    const expiredBookings = bookings.filter(
      (booking) => booking.status === "expired"
    );

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    );

    // Calculate stats
    const stats = {
      total: bookings.length,
      active: activeBookings.length,
      completed: pastBookings.length,
      pending: pendingBookings.length,
      cancelled: cancelledBookings.length + expiredBookings.length, // Include expired in cancelled stats
    };

    // Get user with populated wishlist
    const userWithWishlist = await User.findById(req.user._id).populate({
      path: "wishlist",
      populate: {
        path: "reviews",
      },
    });

    // Calculate average rating for each wishlist listing
    if (userWithWishlist.wishlist) {
      userWithWishlist.wishlist.forEach((listing) => {
        if (listing.reviews) {
          listing.avgRating = getAvgRating(listing.reviews);
        }
      });
    }

    res.render("users/dashboard.ejs", {
      user: userWithWishlist,
      path: req.path,
      bookings: {
        active: activeBookings,
        past: pastBookings,
        pending: pendingBookings,
        cancelled: cancelledBookings,
        expired: expiredBookings, // Add expired bookings
      },
      stats,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    req.flash("error", "Failed to load dashboard. Error: " + error.message);
    res.redirect("/listings");
  }
};

// Host Dashboard Function
const renderHostDashboard = async (req, res) => {
  try {
    const hostId = req.user._id;

    // First, expire any old pending bookings
    await Booking.expireOldBookings();

    // Get host's listings
    const listings = await Listing.find({ owner: hostId })
      .populate("reviews")
      .sort({
        createdAt: -1,
      });

    // Calculate average rating for each listing
    const { getAvgRating } = require("../utils/review.js");
    listings.forEach((listing) => {
      listing.avgRating = getAvgRating(listing.reviews);
    });

    // Get all bookings for host's listings
    const listingIds = listings.map((listing) => listing._id);
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate("listing", "title location country image price")
      .populate("user", "username")
      .sort({ createdAt: -1 });

    // Calculate time periods
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Separate bookings by status and time
    const activeBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.checkOut) > now
    );

    const completedBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && new Date(booking.checkOut) <= now
    );

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "pending"
    );

    const thisMonthBookings = bookings.filter(
      (booking) =>
        booking.status === "confirmed" && booking.createdAt >= startOfMonth
    );

    // Calculate earnings
    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );
    const monthlyEarnings = thisMonthBookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0
    );

    // Calculate occupancy rate
    const totalDaysBooked = completedBookings.reduce((sum, booking) => {
      const days = Math.ceil(
        (booking.checkOut - booking.checkIn) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);

    const occupancyRate =
      listings.length > 0
        ? Math.round((totalDaysBooked / (listings.length * 30)) * 100)
        : 0;

    // Prepare stats
    const stats = {
      totalListings: listings.length,
      activeBookings: activeBookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      totalEarnings,
      monthlyEarnings,
      occupancyRate,
    };

    // Get recent activities (last 5 bookings)
    const recentActivities = bookings.slice(0, 5);

    res.render("hosts/dashboard.ejs", {
      user: req.user,
      path: req.path,
      listings,
      bookings: {
        active: activeBookings,
        pending: pendingBookings,
        completed: completedBookings,
        recent: recentActivities,
      },
      stats,
    });
  } catch (error) {
    console.error("Error loading host dashboard:", error);
    req.flash(
      "error",
      "Failed to load host dashboard. Error: " + error.message
    );
    res.redirect("/listings");
  }
};

// UI-based OTP generation (no email sending)
module.exports.getCode = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const now = Date.now();
    if (
      user.resetCodeExpires &&
      user.resetCodeExpires > now &&
      now - (user.resetCodeExpires - 10 * 60 * 1000) < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        error: "Please wait 1 minute before requesting again.",
      });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpires = now + 10 * 60 * 1000; // 10 minutes
    await user.save();

    console.log(`📧 [UI-MODE] OTP for ${username} (${email}): ${code}`);

    // Return OTP directly in response (no email sent)
    return res.json({
      success: true,
      message: `Your reset code is: ${code}`,
      code: code, // Show code directly
      showInUI: true,
      expiresIn: 600,
      uiMessage: `🔐 Your Password Reset Code\n\n${code}\n\nThis code expires in 10 minutes.\n\nNote: In production, this would be sent to your email.`,
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({
      success: false,
      error: "Server error occurred. Please try again later.",
    });
  }
};

// UI-based email verification (auto-verify)
module.exports.sendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isEmailVerified) {
      return res.json({
        success: false,
        error: "Email already verified",
      });
    }

    // Auto-verify the user in UI mode
    user.isEmailVerified = true;
    await user.save();

    console.log(`📧 [UI-MODE] Auto-verified email for user: ${user.email}`);

    return res.json({
      success: true,
      message: "Email automatically verified!",
      autoVerified: true,
      showInUI: true,
    });
  } catch (error) {
    console.error("Error in sendVerification:", error);
    return res.status(500).json({
      success: false,
      error: "Server error occurred. Please try again later.",
    });
  }
};

// Password reset with code verification
module.exports.forgot = async (req, res) => {
  const { username, email, password, confirm, code } = req.body;
  const user = await User.findOne({ username, email });

  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/forgot");
  }

  if (!user.resetCode || !user.resetCodeExpires || user.resetCode !== code) {
    req.flash("error", "Invalid or expired OTP!");
    return res.redirect("/forgot");
  }

  if (Date.now() > user.resetCodeExpires) {
    req.flash("error", "OTP expired. Please request a new one!");
    return res.redirect("/forgot");
  }

  if (password !== confirm) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("/forgot");
  }

  await user.setPassword(password);
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save();

  req.flash("success", "Password has been reset. Please log in!");
  req.session.redirectUrl = null;
  res.redirect("/login");
};
