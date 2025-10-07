const express = require("express");
const router = express.Router();

//middlewares
const { isLoggedIn } = require("../middleware.js");

//controllers
const wishlistController = require("../controllers/wishlist.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");

//routes

// Add to wishlist
router.post(
  "/add/:id",
  isLoggedIn,
  wrapAsync(wishlistController.addToWishlist)
);

// Remove from wishlist
router.delete(
  "/remove/:id",
  isLoggedIn,
  wrapAsync(wishlistController.removeFromWishlist)
);

// Toggle wishlist (smart add/remove)
router.post(
  "/toggle/:id",
  isLoggedIn,
  wrapAsync(wishlistController.toggleWishlist)
);

module.exports = router;
