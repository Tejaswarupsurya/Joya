const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const HostSubSchema = new Schema(
  {
    isHost: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    appliedAt: Date,
    approvedAt: Date,
    fullName: String,
    phone: String,
    aadhaar: String,
    avatar: {
      url: String,
      filename: String,
    },
    isVerified: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "host", "admin"],
      default: "user",
    },
    host: { type: HostSubSchema, default: () => ({}) },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification" }],
    isEmailVerified: { type: Boolean, default: true }, // Set to true after OTP verification
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
