const nodemailer = require("nodemailer");
const {
  getOTPVerificationTemplate,
  getPasswordResetTemplate,
  getPasswordUpdatedTemplate,
  getBookingConfirmedTemplate,
  getBookingCancelledTemplate,
  getWelcomeTemplate,
} = require("./emailTemplates");

// Create SMTP transporter with TLS on port 587
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false, // false for TLS (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error.message);
  } else {
    console.log("✅ SMTP server ready to send emails (Port 587/TLS)");
  }
});

/**
 * Send OTP verification email for signup
 */
async function sendOTPEmail(to, otp, username = "User") {
  try {
    const mailOptions = {
      from: {
        name: "Joya Travel",
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: "Verify Your Email - Joya",
      html: getOTPVerificationTemplate(username, otp),
      text: `Hi ${username},\n\nThank you for signing up for Joya!\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't create this account, please ignore this email.\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 OTP email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error.message);
    throw new Error("Failed to send verification email");
  }
}

/**
 * Send password reset OTP email
 */
async function sendPasswordResetEmail(to, otp, username) {
  try {
    const mailOptions = {
      from: {
        name: "Joya Travel",
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: "Reset Your Password - Joya",
      html: getPasswordResetTemplate(username, otp),
      text: `Hi ${username},\n\nYour password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Password reset email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password reset email:", error.message);
    throw new Error("Failed to send password reset email");
  }
}

/**
 * Send password updated confirmation email
 */
async function sendPasswordUpdatedEmail(to, username) {
  try {
    const mailOptions = {
      from: {
        name: "Joya Travel",
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: "Password Updated Successfully - Joya",
      html: getPasswordUpdatedTemplate(username),
      text: `Hi ${username},\n\nYour password has been successfully updated on ${new Date().toLocaleString('en-IN')}.\n\nIf you didn't make this change, please contact support immediately.\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Password updated email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending password updated email:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send booking confirmation email
 */
async function sendBookingConfirmedEmail(to, username, booking, listing) {
  try {
    const mailOptions = {
      from: {
        name: "Joya Travel",
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: "Booking Confirmed - Joya",
      html: getBookingConfirmedTemplate(username, booking, listing),
      text: `Hi ${username},\n\nYour booking has been confirmed!\n\nProperty: ${listing.title}\nCheck-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}\nCheck-out: ${new Date(booking.checkOut).toLocaleDateString('en-IN')}\nGuests: ${booking.guests}\nTotal Paid: ₹${booking.totalPrice.toLocaleString('en-IN')}\nBooking ID: ${booking._id}\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Booking confirmed email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending booking confirmed email:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send booking cancelled email
 */
async function sendBookingCancelledEmail(to, username, booking, listing) {
  try {
    const mailOptions = {
      from: {
        name: "Joya Travel",
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: "Booking Cancelled - Joya",
      html: getBookingCancelledTemplate(username, booking, listing),
      text: `Hi ${username},\n\nYour booking has been cancelled.\n\nProperty: ${listing.title}\nCheck-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}\nCheck-out: ${new Date(booking.checkOut).toLocaleDateString('en-IN')}\nBooking ID: ${booking._id}\nStatus: CANCELLED\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Booking cancelled email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending booking cancelled email:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Send welcome email after successful verification
 */
async function sendWelcomeEmail(to, username) {
  try {
    const mailOptions = {
      from: {
        name: "Joya Travel",
        address: process.env.SMTP_USER,
      },
      to: to,
      subject: "Welcome to Joya - Start Your Adventure! 🌍",
      html: getWelcomeTemplate(username),
      text: `Welcome to Joya, ${username}!\n\nYour email has been successfully verified!\n\nStart exploring amazing destinations at: ${process.env.BASE_URL || "http://localhost:3000"}/listings\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendPasswordUpdatedEmail,
  sendBookingConfirmedEmail,
  sendBookingCancelledEmail,
  sendWelcomeEmail,
};

