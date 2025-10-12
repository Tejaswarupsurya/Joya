const nodemailer = require("nodemailer");

// Import email templates
const otpTemplate = require("./emailTemplates/otpTemplate");
const verificationTemplate = require("./emailTemplates/verificationTemplate");
const bookingConfirmationTemplate = require("./emailTemplates/bookingConfirmationTemplate");
const bookingCancellationTemplate = require("./emailTemplates/bookingCancellationTemplate");
const hostApplicationTemplate = require("./emailTemplates/hostApplicationTemplate");

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Check for required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("❌ Missing email environment variables:");
      console.error(
        "EMAIL_USER:",
        process.env.EMAIL_USER ? "✅ Set" : "❌ Missing"
      );
      console.error(
        "EMAIL_PASSWORD:",
        process.env.EMAIL_PASSWORD ? "✅ Set" : "❌ Missing"
      );
      throw new Error("Email environment variables not configured");
    }

    console.log(
      "📧 Initializing email transporter with user:",
      process.env.EMAIL_USER
    );

    // Gmail SMTP configuration (FREE)
    // You can also use Outlook, Yahoo, etc.
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD, // Your Gmail app password
      },
      // Add debug options
      debug: process.env.NODE_ENV !== "production",
      logger: process.env.NODE_ENV !== "production",
    });

    // Test connection on initialization
    this.testConnection();

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
    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const mailOptions = {
          from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Password Reset OTP - Joya",
          html: otpTemplate(username, otp),
        };

        const result = await this.transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
      } catch (error) {
        lastError = error;

        // If it's the last attempt, return failure
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return {
      success: false,
      error: lastError?.message || "Unknown email error",
    };
  }

  async sendBookingConfirmation(email, username, bookingDetails) {
    try {
      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Booking Confirmation - Joya",
        html: bookingConfirmationTemplate(username, bookingDetails),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendBookingCancellation(email, username, bookingDetails) {
    try {
      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Booking Cancelled - Joya",
        html: bookingCancellationTemplate(username, bookingDetails),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendHostApplicationUpdate(email, username, status, message) {
    try {
      const statusSubjects = {
        approved: "Host Application Approved - Joya",
        rejected: "Host Application Update - Joya",
        pending: "Host Application Received - Joya",
      };

      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: statusSubjects[status] || "Host Application Update - Joya",
        html: hostApplicationTemplate(username, status, message),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendEmailVerification(email, username, verificationUrl) {
    try {
      console.log("📧 Preparing verification email for:", email);

      const mailOptions = {
        from: `"Joya Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email - Joya",
        html: verificationTemplate(username, verificationUrl),
      };

      console.log("📧 Sending verification email...");
      const result = await this.transporter.sendMail(mailOptions);
      console.log("✅ Verification email sent successfully:", result.messageId);

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("❌ Failed to send verification email:", error);
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    try {
      console.log("📧 Testing email service connection...");
      await this.transporter.verify();
      console.log("✅ Email service connection verified successfully");
      return true;
    } catch (error) {
      console.error("❌ Email service connection failed:", error.message);
      console.error("❌ Full error:", error);
      return false;
    }
  }
}

module.exports = new EmailService();
