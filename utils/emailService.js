const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send OTP verification email
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 * @param {string} username - User's name
 */
const sendOTPEmail = async (to, otp, username) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Joya <onboarding@resend.dev>",
      to: [to],
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
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏨 Welcome to Joya!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
              
              <div class="otp-box">
                <p style="margin: 0; color: #666;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0; color: #999; font-size: 14px;">This code will expire in 10 minutes</p>
              </div>
              
              <p>If you didn't create an account with Joya, please ignore this email.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Joya. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Email sending failed:", error);
      throw new Error(error.message);
    }

    console.log(`✅ OTP email sent to ${to} - ID: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Email service error:", error);
    throw error;
  }
};

/**
 * Send welcome email after successful verification
 * @param {string} to - Recipient email
 * @param {string} username - User's name
 */
const sendWelcomeEmail = async (to, username) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Joya <onboarding@resend.dev>",
      to: [to],
      subject: "Welcome to Joya! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; border-radius: 5px; }
            .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Joya!</h1>
            </div>
            <div class="content">
              <h2>Hi ${username},</h2>
              <p>Congratulations! Your email has been verified successfully. You're all set to start exploring amazing properties on Joya.</p>
              
              <h3>What you can do now:</h3>
              <div class="feature-box">
                <strong>🏠 Browse Properties</strong><br>
                Discover thousands of hotels, villas, and unique stays
              </div>
              <div class="feature-box">
                <strong>❤️ Save Favorites</strong><br>
                Create your wishlist and never lose track of properties you love
              </div>
              <div class="feature-box">
                <strong>📅 Make Bookings</strong><br>
                Secure your perfect getaway with just a few clicks
              </div>
              <div class="feature-box">
                <strong>🏠 Become a Host</strong><br>
                List your property and start earning
              </div>
              
              <center>
                <a href="${
                  process.env.APP_URL || "http://localhost:3000"
                }/listings" class="button">Start Exploring</a>
              </center>
              
              <p>If you have any questions, feel free to check our <a href="${
                process.env.APP_URL || "http://localhost:3000"
              }/info/help-center">Help Center</a> or contact us.</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Joya. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("❌ Welcome email sending failed:", error);
      throw new Error(error.message);
    }

    console.log(`✅ Welcome email sent to ${to} - ID: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Welcome email service error:", error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
