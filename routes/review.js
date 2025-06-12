const express = require("express");
const router = express.Router({ mergeParams: true });

//middlewares
const {
  validateReview,
  isAlreadyReviewed,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

//controllers
const reviewController= require("../controllers/review.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");


//Review routes
router.post("/",isLoggedIn, validateReview, isAlreadyReviewed, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;