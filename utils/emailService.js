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
    // Use SendGrid if API key is available (recommended for production)
    if (process.env.SENDGRID_API_KEY) {
      console.log("📧 Using SendGrid email service");
      this.transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      // Fallback to Gmail/Outlook SMTP
      console.log("📧 Using SMTP email service with:", process.env.EMAIL_USER);
      this.transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      console.error("❌ Email service not configured. Please set either:");
      console.error("- SENDGRID_API_KEY (recommended for production)");
      console.error("- EMAIL_USER and EMAIL_PASSWORD (for Gmail/Outlook)");
      throw new Error("Email service not configured");
    }
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
      const mailOptions = {
        from: `"Joya Platform" <${
          process.env.SENDGRID_API_KEY
            ? process.env.EMAIL_USER || "noreply@joya.com"
            : process.env.EMAIL_USER
        }>`,
        to: email,
        subject: "Verify Your Email - Joya",
        html: verificationTemplate(username, verificationUrl),
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
