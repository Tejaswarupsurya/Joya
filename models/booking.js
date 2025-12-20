const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending_payment", "confirmed", "cancelled", "expired"],
    default: "pending_payment",
  },
  stripeSessionId: { type: String },
  stripePaymentIntentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: function () {
      // Set expiration to 24 hours from creation if status is pending_payment
      return this.status === "pending_payment"
        ? new Date(Date.now() + 24 * 60 * 60 * 1000)
        : null;
    },
  },
});

// Middleware to set expiration date when creating pending bookings
bookingSchema.pre("save", function (next) {
  if (this.isNew && this.status === "pending_payment") {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  } else if (this.status === "confirmed" || this.status === "cancelled") {
    this.expiresAt = null; // Remove expiration for confirmed/cancelled bookings
  }
  next();
});

// Method to check if booking is expired
bookingSchema.methods.isExpired = function () {
  return (
    this.status === "pending_payment" &&
    this.expiresAt &&
    new Date() > this.expiresAt
  );
};

// Static method to expire old pending bookings
bookingSchema.statics.expireOldBookings = async function () {
  const now = new Date();
  const result = await this.updateMany(
    {
      status: "pending_payment",
      expiresAt: { $lt: now },
    },
    {
      status: "expired",
      expiresAt: null,
    }
  );
  return result.modifiedCount;
};

// TTL index to automatically remove expired documents after 30 days
bookingSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 }
);

module.exports = mongoose.model("Booking", bookingSchema);
