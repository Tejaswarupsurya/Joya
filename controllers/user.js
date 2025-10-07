//mongodb Section
const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const emailService = require("../utils/emailService.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  let { username, email, password, confirm } = req.body;
  if (password !== confirm) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("/signup");
  }
  const existingEmailUser = await User.findOne({ email });
  if (existingEmailUser) {
    req.flash("error", "Email already exists. Please log in!");
    return res.redirect("/login");
  }

  const newUser = new User({ email, username });
  const registeredUser = await User.register(newUser, password);

  // Generate email verification token
  const crypto = require("crypto");
  const verificationToken = crypto.randomBytes(32).toString("hex");
  registeredUser.emailVerificationToken = verificationToken;
  registeredUser.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await registeredUser.save();

  // Send verification email
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/verify-email/${verificationToken}`;
  const emailResult = await emailService.sendEmailVerification(
    email,
    username,
    verificationUrl
  );

  redirectUrl = req.session.redirectUrl || "/listings";
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    if (emailResult.success) {
      req.flash(
        "success",
        "Welcome to Joya! Please check your email to verify your account."
      );
    } else {
      req.flash(
        "success",
        "Welcome to Joya! (Email verification will be sent shortly)"
      );
    }
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

module.exports.getCode = async (req, res) => {
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

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetCodeExpires = now + 10 * 60 * 1000;
  await user.save();

  // Send OTP via email
  const emailResult = await emailService.sendOTP(email, username, code);

  if (emailResult.success) {
    return res.json({
      success: true,
      message: "OTP sent to your email address. Please check your inbox.",
      expiresIn: 600,
    });
  } else {
    // Fallback: show OTP in development mode if email fails
    if (process.env.NODE_ENV !== "production") {
      return res.json({
        success: true,
        code, // Only in development
        message: "Email service unavailable. OTP shown below (dev mode only):",
        expiresIn: 600,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Failed to send OTP. Please try again later.",
      });
    }
  }
};

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

  // Update email and reset verification
  const crypto = require("crypto");
  const verificationToken = crypto.randomBytes(32).toString("hex");

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
    req.flash(
      "success",
      "Email updated! Please check your new email to verify your account."
    );
  } else {
    req.flash(
      "success",
      "Email updated! Verification email will be sent shortly."
    );
  }

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
    const userWithWishlist = await User.findById(req.user._id).populate(
      "wishlist"
    );

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
