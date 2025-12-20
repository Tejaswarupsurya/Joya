const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.renderNewForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  const bookings = await Booking.find({
    listing: req.params.id,
    status: { $nin: ["cancelled", "expired"] },
  }).select("checkIn checkOut");

  const bookedDates = bookings.map((b) => ({
    from: b.checkIn.toISOString().split("T")[0],
    to: b.checkOut.toISOString().split("T")[0],
  }));

  res.render("bookings/new", { listing, bookedDates });
};

// NOTE: Booking creation is now handled by payment controller
// All bookings must go through Stripe payment flow
// See controllers/payment.js -> createCheckoutSession

module.exports.showBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate({
      path: "listing",
      populate: {
        path: "owner",
        select: "username",
      },
    })
    .populate("user");
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }
  res.render("bookings/show", { booking });
};

module.exports.confirmBooking = async (req, res) => {
  const { id, bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("user", "email username");
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect(`/listings/${id}`);
  }

  // Check if booking has expired
  if (booking.isExpired()) {
    booking.status = "expired";
    await booking.save();
    req.flash(
      "error",
      "This booking has expired and can no longer be confirmed!"
    );
    return res.redirect(`/listings/${id}/bookings/${bookingId}`);
  }

  if (booking.status === "cancelled" || booking.status === "expired") {
    req.flash("error", `You can't confirm a ${booking.status} booking!`);
    return res.redirect(`/listings/${id}/bookings/${bookingId}`);
  }

  booking.status = "confirmed";
  booking.expiresAt = null; // Remove expiration date for confirmed bookings
  await booking.save();

  req.flash(
    "success",
    "Booking confirmed successfully! You will receive further updates on your dashboard."
  );
  res.redirect(`/listings/${id}/bookings/${bookingId}`);
};

module.exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId)
    .populate("listing")
    .populate("user", "email username");
  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/listings");
  }

  booking.status = "cancelled";
  await booking.save();

  req.flash(
    "success",
    "Booking cancelled successfully! Your cancellation has been processed."
  );
  res.redirect(`/listings/${booking.listing._id}`);
};
