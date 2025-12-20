const express = require("express");
const router = express.Router();

// Middlewares
const { isLoggedIn } = require("../middleware.js");

// Controllers
const paymentController = require("../controllers/payment.js");

// Utils
const wrapAsync = require("../utils/wrapAsync.js");

// Create Stripe Checkout Session
router.post(
  "/create-checkout-session",
  isLoggedIn,
  wrapAsync(paymentController.createCheckoutSession)
);

// Stripe Webhook (RAW BODY - handled by app.js middleware)
// Signature verification requires raw body
router.post("/webhook", wrapAsync(paymentController.stripeWebhook));

// Success Page
router.get("/success", isLoggedIn, wrapAsync(paymentController.paymentSuccess));

// Cancel Page
router.get("/cancel", isLoggedIn, wrapAsync(paymentController.paymentCancel));

module.exports = router;
