const express = require("express");
const router = express.Router({ mergeParams: true });

//middlewares
const {
  isLoggedIn,
  validateBooking,
  checkBookingOwnership,
} = require("../middleware");

//controllers
const bookingController = require("../controllers/booking");

//utils Section
const wrapAsync = require("../utils/wrapAsync");

// GET - Show booking form
router.get("/new", isLoggedIn, wrapAsync(bookingController.renderNewForm));

// POST - Create new booking (with validation)
router.post(
  "/",
  isLoggedIn,
  validateBooking,
  wrapAsync(bookingController.createBooking)
);

// GET - Show specific booking (with ownership check)
router.get(
  "/:bookingId",
  isLoggedIn,
  checkBookingOwnership,
  wrapAsync(bookingController.showBooking)
);
// PUT - Confirm booking 
router.put(
  "/:bookingId/confirm",
  isLoggedIn,
  wrapAsync(bookingController.confirmBooking)
);

// PUT - Cancel booking (with ownership check)
router.put(
  "/:bookingId/cancel",
  isLoggedIn,
  checkBookingOwnership,
  wrapAsync(bookingController.cancelBooking)
);

module.exports = router;
