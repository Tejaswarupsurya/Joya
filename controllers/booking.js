const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const emailService = require("../utils/emailService.js");

module.exports.renderNewForm = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  const bookings = await Booking.find({
    listing: req.params.id,
    status: { $nin: ["cancelled", "expired"] }, // Exclude cancelled and expired bookings
  }).select("checkIn checkOut");

  const bookedDates = bookings.map((b) => ({
    from: b.checkIn.toISOString().split("T")[0],
    to: b.checkOut.toISOString().split("T")[0],
  }));

  res.render("bookings/new", { listing, bookedDates });
};

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // --- Availability Check ---
  // First expire old pending bookings
  await Booking.expireOldBookings();

  const existing = await Booking.find({
    listing: id,
    status: { $nin: ["cancelled", "expired"] }, // Exclude cancelled and expired bookings
    $or: [
      { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $lte: new Date(checkOut), $gt: new Date(checkIn) } },
    ],
  });

  if (guests < 1 || guests > 6) {
    req.flash("error", "Number of guests must be between 1 and 6");
    return res.redirect(`/listings/${id}/bookings/new`);
  }

  if (existing.length > 0) {
    req.flash("error", "Sorry Hotel not available for those dates!");
    return res.redirect(`/listings/${id}`);
  }

  // --- Price Calculation ---
  const nights =
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  if (nights < 1) {
    req.flash("error", "Check-out date must be after check-in date!");
    return res.redirect(`/listings/${id}/bookings/new`);
  }

  if (nights > 14) {
    req.flash("error", "You can't book a stay for more than 14 days!");
    return res.redirect(`/listings/${id}/bookings/new`);
  }

  const totalPrice = listing.price * nights;
  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn,
    checkOut,
    guests,
    totalPrice,
    status: "pending",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  });

  await booking.save();
  req.flash("success", "Booking created successfully!");
  res.redirect(`/listings/${id}/bookings/${booking._id}`);
};

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

  // Send booking confirmation email
  try {
    const bookingDetails = {
      listing: booking.listing,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
    };

    await emailService.sendBookingConfirmation(
      booking.user.email,
      booking.user.username,
      bookingDetails
    );
  } catch (emailError) {
    console.error("Failed to send booking confirmation email:", emailError);
  }

  req.flash("success", "Booking confirmed successfully!");
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

  // Send booking cancellation email
  try {
    const bookingDetails = {
      listing: booking.listing,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice,
      cancellationReason: "Cancelled by user",
    };

    await emailService.sendBookingCancellation(
      booking.user.email,
      booking.user.username,
      bookingDetails
    );
  } catch (emailError) {
    console.error("Failed to send booking cancellation email:", emailError);
  }

  req.flash("success", "Booking cancelled successfully!");
  res.redirect(`/listings/${booking.listing._id}`);
};
