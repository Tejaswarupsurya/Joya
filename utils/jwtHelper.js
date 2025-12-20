const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET =
  process.env.JWT_SECRET || process.env.SECRET || "fallback-secret-key";
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate JWT token for OTP
 * @param {string} email - User email
 * @param {string} otp - Generated OTP
 * @returns {string} JWT token
 */
const generateOTPToken = (email, otp) => {
  const payload = {
    email,
    otp,
    type: "email_verification",
    timestamp: Date.now(),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "10m", // 10 minutes
  });
};

/**
 * Verify JWT token and extract OTP
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload or null if invalid
 */
const verifyOTPToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if token is for email verification
    if (decoded.type !== "email_verification") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
  }
};

/**
 * Check if OTP can be resent (1-minute cooldown)
 * @param {Date} lastSentAt - Last OTP sent timestamp
 * @returns {boolean} True if can resend
 */
const canResendOTP = (lastSentAt) => {
  if (!lastSentAt) return true;

  const ONE_MINUTE = 60 * 1000;
  const timeSinceLastSent = Date.now() - new Date(lastSentAt).getTime();

  return timeSinceLastSent >= ONE_MINUTE;
};

/**
 * Get remaining cooldown time in seconds
 * @param {Date} lastSentAt - Last OTP sent timestamp
 * @returns {number} Remaining seconds
 */
const getRemainingCooldown = (lastSentAt) => {
  if (!lastSentAt) return 0;

  const ONE_MINUTE = 60 * 1000;
  const timeSinceLastSent = Date.now() - new Date(lastSentAt).getTime();
  const remainingMs = ONE_MINUTE - timeSinceLastSent;

  return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
};

module.exports = {
  generateOTP,
  generateOTPToken,
  verifyOTPToken,
  canResendOTP,
  getRemainingCooldown,
};
