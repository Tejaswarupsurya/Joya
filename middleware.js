//mongodb Section
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {
  listingSchema,
  signupSchema,
  reviewSchema,
  resetPasswordSchema,
  updatePasswordSchema,
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

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't Access!");
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
