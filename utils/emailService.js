const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Gmail SMTP configuration (FREE)
    // You can also use Outlook, Yahoo, etc.
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
      },
    });

    // Alternative: Custom SMTP configuration
    // this.transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: process.env.SMTP_SECURE === 'true',
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASSWORD
    //   }
    // });
  }

  async sendOTP(email, username, otp) {
    try {
      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset OTP - Joya",
        html: `
          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Import Google Font -->
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
            </style>
            
            <div style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <!-- Elegant Joya Text - Matching the brand style -->
              <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
              <p style="color: white; margin: 10px 0 0 0; font-weight: 500; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">Password Reset Request</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Hello ${username}!</h2>
              
              <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                You requested a password reset for your Joya account. Use the OTP below to reset your password:
              </p>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; border-left: 4px solid #fc5c79;">
                <h1 style="color: #fc5c79; font-size: 36px; margin: 0; letter-spacing: 3px;">${otp}</h1>
                <p style="color: #999; margin: 10px 0 0 0; font-size: 14px;">This OTP is valid for 10 minutes</p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                If you didn't request this password reset, please ignore this email or contact our support team.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  This is an automated email from Joya Platform. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ OTP email sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  async sendBookingConfirmation(email, username, bookingDetails) {
    try {
      const { listing, checkIn, checkOut, guests, totalPrice } = bookingDetails;

      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Booking Confirmation - Joya",
        html: `
          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Import Google Font -->
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
            </style>
            
            <div style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <!-- Elegant Joya Text - Matching the brand style -->
              <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
              <p style="color: white; margin: 10px 0 0 0; font-weight: 500;">Booking Confirmed!</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Hello ${username}!</h2>
              
              <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Great news! Your booking has been confirmed. Here are your booking details:
              </p>
              
              <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #fc5c79;">
                <h3 style="color: #fc5c79; margin-top: 0;">${listing.title}</h3>
                <p style="color: #666; margin: 5px 0;"><strong>Location:</strong> ${
                  listing.location
                }</p>
                <p style="color: #666; margin: 5px 0;"><strong>Check-in:</strong> ${new Date(
                  checkIn
                ).toLocaleDateString()}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Check-out:</strong> ${new Date(
                  checkOut
                ).toLocaleDateString()}</p>
                <p style="color: #666; margin: 5px 0;"><strong>Guests:</strong> ${guests}</p>
                <p style="color: #fc5c79; margin: 15px 0 0 0; font-size: 18px;"><strong>Total Price: ₹${totalPrice.toLocaleString(
                  "en-IN"
                )}</strong></p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                We hope you have a wonderful stay! If you have any questions, feel free to contact us.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                  This is an automated email from Joya Platform. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ Booking confirmation email sent:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Booking email sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  async sendEmailVerification(email, username, verificationUrl) {
    try {
      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - Joya",
        html: `
          <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <!-- Import Google Font -->
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');
              @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');
            </style>
            
            <div style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <!-- Elegant Joya Text - Matching the brand style -->
              <h1 style="color: white; margin: 0; font-family: 'Dancing Script', cursive; font-weight: 600; font-size: 48px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: 2px;">Joya</h1>
              <p style="color: white; margin: 10px 0 0 0; font-weight: 500;">Email Verification</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-weight: 600;">Welcome to Joya, ${username}!</h2>
              
              <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                Thank you for signing up! Please verify your email address to access all features of Joya.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #fc5c79 0%, #ff8c42 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #fc5c79; word-break: break-all; font-size: 14px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                ${verificationUrl}
              </p>
              
              <p style="color: #666; line-height: 1.6; font-family: 'Plus Jakarta Sans', Arial, sans-serif; font-size: 14px;">
                This verification link will expire in 24 hours. If you didn't create an account with Joya, please ignore this email.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                <p style="color: #999; font-size: 12px; margin: 0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
                  This is an automated email from Joya Platform. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ Email verification sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Email verification sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service connection verified");
      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:", error.message);
      return false;
    }
  }
}

module.exports = new EmailService();
