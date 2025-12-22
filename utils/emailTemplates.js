// Centralized email templates for all transactional emails

const getEmailHeader = () => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
    .btn { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
    .box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
    .highlight { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 5px; }
  </style>
</head>
<body>
`;

const getEmailFooter = () => `
  <div class="footer">
    <p>© ${new Date().getFullYear()} Joya Travel. All rights reserved.</p>
    <p>This is an automated email, please do not reply.</p>
  </div>
</body>
</html>
`;

// OTP Verification Email for Signup
function getOTPVerificationTemplate(username, otp) {
  return `
${getEmailHeader()}
<div class="container">
  <div class="header">
    <h1>🌍 Welcome to Joya!</h1>
  </div>
  <div class="content">
    <h2>Hi ${username},</h2>
    <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
    
    <div class="box">
      <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0;">${otp}</div>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 10 minutes</p>
    </div>

    <p>Enter this code on the verification page to activate your account.</p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      <strong>Security Tip:</strong> Never share this code with anyone. Joya will never ask for your verification code.
    </p>
  </div>
  ${getEmailFooter()}
</div>
`;
}

// Password Reset OTP Email
function getPasswordResetTemplate(username, otp) {
  return `
${getEmailHeader()}
<div class="container">
  <div class="header">
    <h1>🔐 Reset Your Password</h1>
  </div>
  <div class="content">
    <h2>Hi ${username},</h2>
    <p>We received a request to reset your password. Use the code below to proceed:</p>
    
    <div class="box">
      <p style="margin: 0; font-size: 14px; color: #666;">Your password reset code is:</p>
      <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; margin: 10px 0;">${otp}</div>
      <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 10 minutes</p>
    </div>

    <p>If you didn't request this password reset, please ignore this email or contact support if you're concerned about your account security.</p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      <strong>Security Tip:</strong> Never share this code with anyone, even Joya support staff.
    </p>
  </div>
  ${getEmailFooter()}
</div>
`;
}

// Password Updated Successfully
function getPasswordUpdatedTemplate(username) {
  return `
${getEmailHeader()}
<div class="container">
  <div class="header">
    <h1>✅ Password Updated</h1>
  </div>
  <div class="content">
    <h2>Hi ${username},</h2>
    <p>Your password has been successfully updated.</p>
    
    <div class="highlight">
      <p style="margin: 0;"><strong>✓ Password changed at:</strong> ${new Date().toLocaleString(
        "en-IN",
        {
          dateStyle: "long",
          timeStyle: "short",
        }
      )}</p>
    </div>

    <p>If you didn't make this change, please contact our support team immediately:</p>
    <p style="text-align: center;">
      <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/info/contact" class="btn">Contact Support</a>
    </p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      <strong>Security Tip:</strong> For your security, we recommend using a strong, unique password.
    </p>
  </div>
  ${getEmailFooter()}
</div>
`;
}

// Booking Confirmed Email
function getBookingConfirmedTemplate(username, booking, listing) {
  const checkIn = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });
  const checkOut = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });

  return `
${getEmailHeader()}
<div class="container">
  <div class="header">
    <h1>🎉 Booking Confirmed!</h1>
  </div>
  <div class="content">
    <h2>Hi ${username},</h2>
    <p>Great news! Your booking has been confirmed and payment processed successfully.</p>
    
    <div class="highlight">
      <h3 style="margin-top: 0;">📍 ${listing.title}</h3>
      <p style="margin: 5px 0;"><strong>Check-in:</strong> ${checkIn}</p>
      <p style="margin: 5px 0;"><strong>Check-out:</strong> ${checkOut}</p>
      <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
      <p style="margin: 15px 0 5px 0; font-size: 18px;"><strong>Total Paid:</strong> <span style="color: #667eea;">₹${booking.totalPrice.toLocaleString(
        "en-IN"
      )}</span></p>
      <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Booking ID:</strong> ${
        booking._id
      }</p>
    </div>

    <p>You can view and manage your booking from your dashboard:</p>
    <p style="text-align: center;">
      <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/dashboard" class="btn">View Booking</a>
    </p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      Need help? Contact us at <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/info/contact">support</a>
    </p>
  </div>
  ${getEmailFooter()}
</div>
`;
}

// Booking Cancelled Email
function getBookingCancelledTemplate(username, booking, listing) {
  const checkIn = new Date(booking.checkIn).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });
  const checkOut = new Date(booking.checkOut).toLocaleDateString("en-IN", {
    dateStyle: "long",
  });

  return `
${getEmailHeader()}
<div class="container">
  <div class="header">
    <h1>❌ Booking Cancelled</h1>
  </div>
  <div class="content">
    <h2>Hi ${username},</h2>
    <p>Your booking has been cancelled as requested.</p>
    
    <div class="highlight">
      <h3 style="margin-top: 0;">📍 ${listing.title}</h3>
      <p style="margin: 5px 0;"><strong>Check-in:</strong> ${checkIn}</p>
      <p style="margin: 5px 0;"><strong>Check-out:</strong> ${checkOut}</p>
      <p style="margin: 5px 0;"><strong>Guests:</strong> ${booking.guests}</p>
      <p style="margin: 15px 0 5px 0; font-size: 18px;"><strong>Amount:</strong> <span style="text-decoration: line-through;">₹${booking.totalPrice.toLocaleString(
        "en-IN"
      )}</span></p>
      <p style="margin: 5px 0; font-size: 12px; color: #666;"><strong>Booking ID:</strong> ${
        booking._id
      }</p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #ff6b6b;"><strong>Status:</strong> CANCELLED</p>
    </div>

    <p>If this was a confirmed booking, your refund will be processed within 5-7 business days.</p>
    
    <p>Ready to plan your next adventure?</p>
    <p style="text-align: center;">
      <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/listings" class="btn">Browse Listings</a>
    </p>
    
    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      Questions about your cancellation? <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/info/contact">Contact support</a>
    </p>
  </div>
  ${getEmailFooter()}
</div>
`;
}

// Welcome Email (after verification)
function getWelcomeTemplate(username) {
  return `
${getEmailHeader()}
<div class="container">
  <div class="header">
    <h1>🎉 Welcome to Joya, ${username}!</h1>
  </div>
  <div class="content">
    <p>Your email has been successfully verified! You're all set to explore amazing destinations.</p>
    
    <h3>What you can do now:</h3>
    <div class="highlight">
      <strong>🏠 Browse Listings</strong><br>
      Discover thousands of unique stays worldwide
    </div>
    <div class="highlight">
      <strong>💝 Save Favorites</strong><br>
      Create your wishlist and save properties you love
    </div>
    <div class="highlight">
      <strong>📅 Book Your Stay</strong><br>
      Secure bookings with instant confirmation
    </div>
    <div class="highlight">
      <strong>⭐ Leave Reviews</strong><br>
      Share your experiences with the community
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/listings" class="btn">Start Exploring</a>
    </div>

    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
      Need help? Visit our <a href="${
        process.env.BASE_URL || "http://localhost:3000"
      }/info/help-center">Help Center</a> or reply to this email.
    </p>
  </div>
  ${getEmailFooter()}
</div>
`;
}

module.exports = {
  getOTPVerificationTemplate,
  getPasswordResetTemplate,
  getPasswordUpdatedTemplate,
  getBookingConfirmedTemplate,
  getBookingCancelledTemplate,
  getWelcomeTemplate,
};
