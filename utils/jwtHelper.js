const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const OTP_EXPIRY = 10 * 60; // 10 minutes in seconds
const RESEND_COOLDOWN = 60; // 1 minute cooldown between resends

/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate JWT token containing OTP
 * @param {string} email - User's email
 * @param {string} otp - 6-digit OTP
 * @returns {string} - JWT token
 */
function generateOTPToken(email, otp) {
  return jwt.sign(
    {
      email,
      otp,
      purpose: "email_verification",
      issuedAt: Date.now(),
    },
    JWT_SECRET,
    { expiresIn: OTP_EXPIRY }
  );
}

/**
 * Verify OTP token and return decoded data
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded token data or null if invalid
 */
function verifyOTPToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return null;
  }
}

/**
 * Check if user can resend OTP (cooldown period)
 * @param {number} lastIssuedAt - Timestamp of last OTP issue
 * @returns {boolean}
 */
function canResendOTP(lastIssuedAt) {
  const now = Date.now();
  const timeSinceLastOTP = (now - lastIssuedAt) / 1000; // Convert to seconds
  return timeSinceLastOTP >= RESEND_COOLDOWN;
}

/**
 * Get remaining cooldown time in seconds
 * @param {number} lastIssuedAt - Timestamp of last OTP issue
 * @returns {number}
 */
function getRemainingCooldown(lastIssuedAt) {
  const now = Date.now();
  const timeSinceLastOTP = (now - lastIssuedAt) / 1000;
  const remaining = RESEND_COOLDOWN - timeSinceLastOTP;
  return Math.max(0, Math.ceil(remaining));
}

module.exports = {
  generateOTP,
  generateOTPToken,
  verifyOTPToken,
  canResendOTP,
  getRemainingCooldown,
  OTP_EXPIRY,
  RESEND_COOLDOWN,
};
