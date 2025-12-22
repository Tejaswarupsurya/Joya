const nodemailer = require("nodemailer");

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
 * Send OTP verification email
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {string} username - User's username
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
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌍 Welcome to Joya!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This code expires in 10 minutes</p>
              </div>

              <p>Enter this code on the verification page to activate your account.</p>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
                <strong>Security Tip:</strong> Never share this code with anyone. Joya will never ask for your verification code.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Joya Travel. All rights reserved.</p>
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
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
 * Send welcome email after successful verification
 * @param {string} to - Recipient email
 * @param {string} username - User's username
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
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Joya, ${username}!</h1>
            </div>
            <div class="content">
              <p>Your email has been successfully verified! You're all set to explore amazing destinations.</p>
              
              <h3>What you can do now:</h3>
              <div class="feature">
                <strong>🏠 Browse Listings</strong><br>
                Discover thousands of unique stays worldwide
              </div>
              <div class="feature">
                <strong>💝 Save Favorites</strong><br>
                Create your wishlist and save properties you love
              </div>
              <div class="feature">
                <strong>📅 Book Your Stay</strong><br>
                Secure bookings with instant confirmation
              </div>
              <div class="feature">
                <strong>⭐ Leave Reviews</strong><br>
                Share your experiences with the community
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.BASE_URL || "http://localhost:3000"
                }/listings" class="button">Start Exploring</a>
              </div>

              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 14px; color: #666;">
                Need help? Visit our <a href="${
                  process.env.BASE_URL || "http://localhost:3000"
                }/info/help-center">Help Center</a> or reply to this email.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Joya Travel. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Joya, ${username}!\n\nYour email has been successfully verified!\n\nStart exploring amazing destinations at: ${
        process.env.BASE_URL || "http://localhost:3000"
      }/listings\n\n© ${new Date().getFullYear()} Joya Travel`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `📧 Welcome email sent to ${to} (Message ID: ${info.messageId})`
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending welcome email:", error.message);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
