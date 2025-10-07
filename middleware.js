//mongodb Section
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const Booking = require("./models/booking.js");
const {
  listingSchema,
  signupSchema,
  reviewSchema,
  resetPasswordSchema,
  updatePasswordSchema,
  bookingSchema,
  hostApplicationSchema,
} = require("./schema.js");

//utils Section
const ExpressError = require("./utils/ExpressError.js");

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errmsg);
    return res.redirect("/forgot");
  }
  next();
};

module.exports.validateUpdatePassword = (req, res, next) => {
  const { error } = updatePasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errmsg);
    return res.redirect("/forgot");
  }
  next();
};

module.exports.validateReset = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errmsg);
    return res.redirect("/forgot");
  }
  next();
};

module.exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body, { abortEarly: false });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errMsg);
    return res.redirect(`/listings/${req.params.id}/bookings/new`);
  } else {
    next();
  }
};
module.exports.validateHostApplication = (req, res, next) => {
  let { error } = hostApplicationSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    req.flash("error", errMsg);
    return res.redirect("/apply");
  } else {
    next();
  }
};

// Additional booking-specific middleware
module.exports.checkBookingOwnership = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(
      "user"
    );
    if (!booking) {
      req.flash("error", "Booking not found!");
      return res.redirect("/listings");
    }
    if (!booking.user._id.equals(req.user._id) && req.user.role !== "admin") {
      req.flash("error", "You don't have permission to access this booking!");
      return res.redirect("/listings");
    }
    next();
  } catch (err) {
    req.flash("error", "Something went wrong!");
    return res.redirect("/listings");
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.method === "GET") {
      req.session.redirectUrl = req.originalUrl;
    }
    req.flash("error", "Login to continue");
    return res.redirect("/login");
  }
  next();
};
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const excludedPaths = ["/login", "/signup", "/forgot", "/change-password"];
module.exports.storeRedirectUrl = (req, res, next) => {
  if (
    req.method === "GET" &&
    !req.session.redirectUrl &&
    !excludedPaths.includes(req.originalUrl)
  ) {
    req.session.redirectUrl = req.originalUrl;
  }
  next();
};

module.exports.requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash("error", "Login to continue!");
      return res.redirect("/login");
    }
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      req.flash("error", "You are not authorized to access this page!");
      return res.redirect("/");
    }
    next();
  };
};

module.exports.isDocOwner = (Model, field = "owner") => {
  return async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) {
      req.flash("error", "Resource not found!");
      return res.redirect("back");
    }
    if (!doc[field].equals(req.user._id) && req.user.role !== "admin") {
      req.flash("error", "You don't have Access!");
      return res.redirect("back");
    }
    next();
  };
};

module.exports.isHost = (req, res, next) => {
  if (!res.locals.currUser || res.locals.currUser.role !== "host") {
    req.flash("error", "Only hosts can create listings!");
    return res.redirect("/listings");
  }
  next();
};

module.exports.canApplyAsHost = (req, res, next) => {
  if (req.user.role === "user") return next();

  if (req.user.role === "host" && req.user.host.status === "rejected")
    return next();

  req.flash("error", "You already have an active host application!");
  return res.redirect("/dashboard");
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have Access!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are'nt the Author of this Review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.isAlreadyReviewed = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  const alreadyReviewed = listing.reviews.some((r) =>
    r.author.equals(req.user._id)
  );
  if (alreadyReviewed) {
    req.flash("error", "You have already reviewed!");
    return res.redirect(`/listings/${listing._id}`);
  }
  next();
};

module.exports.fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ExpressError(400, "Invalid file type. Only images are allowed."),
      false
    );
  }
};

module.exports.checkRequiredFile = (req, res, next) => {
  if (!req.file || req.file.size === 0) {
    throw new ExpressError(400, "Image upload failed or file is empty.");
  }
  next();
};

module.exports.checkOptionalFile = (req, res, next) => {
  if (req.file && req.file.size === 0) {
    throw new ExpressError(400, "Uploaded file is empty.");
  }
  next();
};
