//mongodb Section
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

// Email & JWT utilities
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordUpdatedEmail,
} = require("../utils/emailService.js");
const {
  generateOTP,
  generateOTPToken,
  verifyOTPToken,
  canResendOTP,
  getRemainingCooldown,
  OTP_EXPIRY,
} = require("../utils/jwtHelper.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, confirm } = req.body;

    // Validate passwords match
    if (password !== confirm) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/signup");
    }

    // Check if email already exists
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      req.flash("error", "Email already exists. Please log in!");
      return res.redirect("/login");
    }

    // Generate OTP and create JWT token
    const otp = generateOTP();
    const otpToken = generateOTPToken(email, otp);

    // Store user data and OTP token in session temporarily
    req.session.pendingUser = {
      username,
      email,
      password,
      otpToken,
      otpIssuedAt: Date.now(),
    };

    // Send OTP email
    await sendOTPEmail(email, otp, username);

    req.flash(
      "success",
      `Verification code sent to ${email}. Please check your inbox.`
    );
    res.redirect("/verify-email");
  } catch (error) {
    console.error("Signup error:", error);
    req.flash("error", "Failed to send verification email. Please try again.");
    res.redirect("/signup");
  }
};

// Render email verification form
module.exports.renderVerifyEmailForm = (req, res) => {
  if (!req.session.pendingUser) {
    req.flash("error", "No pending verification. Please sign up first.");
    return res.redirect("/signup");
  }

  const { email, otpIssuedAt } = req.session.pendingUser;
  const remainingTime =
    OTP_EXPIRY - Math.floor((Date.now() - otpIssuedAt) / 1000);

  if (remainingTime <= 0) {
    delete req.session.pendingUser;
    req.flash("error", "Verification code expired. Please sign up again.");
    return res.redirect("/signup");
  }

  res.render("./users/verify-email.ejs", {
    email,
    remainingTime,
    canResend: canResendOTP(otpIssuedAt),
  });
};

// Verify email with OTP
module.exports.verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!req.session.pendingUser) {
      req.flash("error", "Session expired. Please sign up again.");
      return res.redirect("/signup");
    }

    const { username, email, password, otpToken } = req.session.pendingUser;

    // Verify OTP token
    const decoded = verifyOTPToken(otpToken);

    if (!decoded) {
      req.flash("error", "Verification code expired. Please try again.");
      delete req.session.pendingUser;
      return res.redirect("/signup");
    }

    // Check if OTP matches
    if (decoded.otp !== otp) {
      req.flash("error", "Invalid verification code. Please try again.");
      return res.redirect("/verify-email");
    }

    // Create and register user
    const newUser = new User({ email, username, isEmailVerified: true });
    const registeredUser = await User.register(newUser, password);

    // Clear pending user data
    delete req.session.pendingUser;

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, username).catch((err) =>
      console.error("Welcome email failed:", err)
    );

    // Auto-login user
    const redirectUrl = req.session.redirectUrl || "/listings";
    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
        req.flash("success", "Account created! Please log in.");
        return res.redirect("/login");
      }

      req.flash("success", "Welcome to Joya! Your account has been verified.");
      res.redirect(redirectUrl);
    });
  } catch (error) {
    console.error("Email verification error:", error);
    req.flash("error", "Verification failed. Please try again.");
    res.redirect("/verify-email");
  }
};

// Resend OTP
module.exports.resendOTP = async (req, res) => {
  try {
    if (!req.session.pendingUser) {
      req.flash("error", "Session expired. Please sign up again.");
      return res.redirect("/signup");
    }

    const { username, email, otpIssuedAt } = req.session.pendingUser;

    // Check cooldown
    if (!canResendOTP(otpIssuedAt)) {
      const remaining = getRemainingCooldown(otpIssuedAt);
      req.flash("error", `Please wait ${remaining} seconds before resending.`);
      return res.redirect("/verify-email");
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpToken = generateOTPToken(email, otp);

    // Update session
    req.session.pendingUser.otpToken = otpToken;
    req.session.pendingUser.otpIssuedAt = Date.now();

    // Send new OTP email
    await sendOTPEmail(email, otp, username);

    req.flash("success", "New verification code sent to your email!");
    res.redirect("/verify-email");
  } catch (error) {
    console.error("Resend OTP error:", error);
    req.flash("error", "Failed to resend code. Please try again.");
    res.redirect("/verify-email");
  }
};

// Resend OTP for forgot password (JSON response for frontend fetch)
module.exports.resendForgotOTP = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    // Check cooldown if session exists
    if (req.session.passwordReset?.otpIssuedAt) {
      if (!canResendOTP(req.session.passwordReset.otpIssuedAt)) {
        const remaining = getRemainingCooldown(
          req.session.passwordReset.otpIssuedAt
        );
        return res.status(429).json({
          success: false,
          error: `Please wait ${remaining} seconds before requesting again.`,
        });
      }
    }

    // Generate 6-digit OTP and JWT token
    const otp = generateOTP();
    const otpToken = generateOTPToken(email, otp);

    // Store in session (same as signup flow)
    req.session.passwordReset = {
      username,
      email,
      otpToken,
      otpIssuedAt: Date.now(),
    };

    // Send OTP via email
    await sendPasswordResetEmail(email, otp, username);

    console.log(`📧 Password reset OTP sent to ${email}`);

    // Return success message (OTP sent via email)
    return res.json({
      success: true,
      message: "Password reset code sent to your email!",
      expiresIn: 600,
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send reset code. Please try again.",
    });
  }
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
  try {
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

    // Send password updated confirmation email (non-blocking)
    sendPasswordUpdatedEmail(user.email, user.username).catch((err) =>
      console.error("Password updated email failed:", err)
    );

    req.flash("success", "Password updated successfully!");
    res.redirect("/listings");
  } catch (error) {
    console.error("Password update error:", error);
    req.flash("error", "Failed to update password. Please try again.");
    res.redirect("/update-password");
  }
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
  try {
    const { username, email, password, confirm, code } = req.body;

    // Check session data
    if (!req.session.passwordReset) {
      req.flash("error", "Session expired. Please request a new code.");
      return res.redirect("/forgot");
    }

    const {
      otpToken,
      username: sessionUsername,
      email: sessionEmail,
    } = req.session.passwordReset;

    // Verify username and email match session
    if (username !== sessionUsername || email !== sessionEmail) {
      req.flash("error", "Invalid credentials!");
      return res.redirect("/forgot");
    }

    // Verify JWT token and OTP
    const decoded = verifyOTPToken(otpToken);
    if (!decoded || decoded.otp !== code) {
      req.flash("error", "Invalid or expired OTP!");
      return res.redirect("/forgot");
    }

    if (password !== confirm) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/forgot");
    }

    // Find and update user
    const user = await User.findOne({ username, email });
    if (!user) {
      req.flash("error", "User not found!");
      return res.redirect("/forgot");
    }

    await user.setPassword(password);
    await user.save();

    // Clear password reset session
    req.session.passwordReset = null;

    // Send password updated confirmation email (non-blocking)
    sendPasswordUpdatedEmail(user.email, user.username).catch((err) =>
      console.error("Password updated email failed:", err)
    );

    req.flash(
      "success",
      "Password has been reset successfully! Please log in."
    );
    req.session.redirectUrl = null;
    res.redirect("/login");
  } catch (error) {
    console.error("Forgot password error:", error);
    req.flash("error", "Failed to reset password. Please try again.");
    res.redirect("/forgot");
  }
};
