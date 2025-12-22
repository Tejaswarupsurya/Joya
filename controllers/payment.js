const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { sendBookingConfirmedEmail } = require("../utils/emailService.js");

// Create Stripe Checkout Session
module.exports.createCheckoutSession = async (req, res) => {
  const { listingId, checkIn, checkOut, guests } = req.body;

  try {
    // Validate input
    if (!checkIn || !checkOut || !guests || !listingId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate guests
    if (guests < 1 || guests > 6) {
      return res.status(400).json({ error: "Guests must be between 1 and 6" });
    }

    // Get listing details
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Calculate nights and validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    if (nights < 1) {
      return res
        .status(400)
        .json({ error: "Check-out must be after check-in" });
    }

    if (nights > 14) {
      return res.status(400).json({ error: "Maximum stay is 14 nights" });
    }

    // Calculate total price (SINGLE SOURCE OF TRUTH)
    const totalPrice = listing.price * nights;

    // Check availability before creating booking
    await Booking.expireOldBookings();
    const existing = await Booking.find({
      listing: listingId,
      status: { $nin: ["cancelled", "expired"] },
      $or: [
        { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOut: { $lte: checkOutDate, $gt: checkInDate } },
      ],
    });

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: "Selected dates are not available" });
    }

    // Create booking with PENDING_PAYMENT status
    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      status: "pending_payment",
    });

    await booking.save();
    console.log(`📝 Booking created: ${booking._id} (status: pending_payment)`);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: listing.title,
              description: `${nights} night${
                nights > 1 ? "s" : ""
              } • ${guests} guest${guests > 1 ? "s" : ""}`,
              images: listing.image?.url ? [listing.image.url] : [],
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user._id.toString(),
        listingId: listingId,
      },
      success_url: `${process.env.BASE_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/payments/cancel?booking_id=${booking._id}`,
    });

    // Save session ID to booking
    booking.stripeSessionId = session.id;
    await booking.save();

    console.log(
      `💳 Stripe session created: ${session.id} for booking: ${booking._id}`
    );

    res.json({ sessionUrl: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

// Stripe Webhook Handler (CRITICAL FOR PAYMENT CONFIRMATION)
module.exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      // Find booking by session ID
      const booking = await Booking.findOne({
        stripeSessionId: session.id,
      });

      if (!booking) {
        console.error("❌ Booking not found for session:", session.id);
        return res.status(404).json({ error: "Booking not found" });
      }

      // Check if already confirmed (idempotency)
      if (booking.status === "confirmed") {
        console.log(`✅ Booking ${booking._id} already confirmed, skipping`);
        return res.json({ received: true });
      }

      // Confirm the booking
      booking.status = "confirmed";
      booking.stripePaymentIntentId = session.payment_intent;
      booking.expiresAt = null; // Remove expiration
      await booking.save();

      console.log(
        `✅ Payment confirmed! Booking ${booking._id} status: CONFIRMED`
      );
      console.log(`💰 Payment Intent: ${session.payment_intent}`);

      // Send booking confirmation email
      try {
        const user = await User.findById(booking.user);
        const listing = await Listing.findById(booking.listing);

        if (user && listing) {
          await sendBookingConfirmedEmail(
            user.email,
            user.username,
            booking,
            listing
          );
          console.log(`📧 Booking confirmation email sent to ${user.email}`);
        }
      } catch (emailError) {
        console.error("Failed to send booking confirmation email:", emailError);
        // Don't fail the webhook if email fails
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return res.status(500).json({ error: "Webhook processing failed" });
    }
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
};

// Success Page (UX Only - No Booking Confirmation)
module.exports.paymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Find booking
    const booking = await Booking.findOne({
      stripeSessionId: session_id,
    }).populate("listing");

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/dashboard");
    }

    res.render("payments/success", { booking, session });
  } catch (error) {
    console.error("Error retrieving payment session:", error);
    req.flash("error", "Failed to retrieve payment details");
    res.redirect("/dashboard");
  }
};

// Cancel Page (UX Only)
module.exports.paymentCancel = async (req, res) => {
  const { booking_id } = req.query;

  try {
    const booking = await Booking.findById(booking_id).populate("listing");

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/listings");
    }

    // Cancel the booking
    booking.status = "cancelled";
    await booking.save();

    console.log(`❌ Booking ${booking._id} cancelled by user`);

    res.render("payments/cancel", { booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    req.flash("error", "Failed to cancel booking");
    res.redirect("/dashboard");
  }
};
