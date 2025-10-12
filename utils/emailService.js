const nodemailer = require("nodemailer");

// Import email templates
const otpTemplate = require("./emailTemplates/otpTemplate");
const verificationTemplate = require("./emailTemplates/verificationTemplate");

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.initPromise = this.initializeTransporter();
  }

  async initializeTransporter() {
    if (this.isInitialized) return;

    try {
      // Generate test account automatically (no manual signup needed)
      const testAccount = await nodemailer.createTestAccount();

      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user, // Auto-generated
          pass: testAccount.pass, // Auto-generated
        },
      });

      console.log("📧 Email service ready (Ethereal for preview URLs)");
      console.log(`📧 Test inbox: https://ethereal.email/messages`);
    } catch (error) {
      // Fallback to console logging if Ethereal fails
      console.log("📧 Email service using console logging");
      this.transporter = {
        sendMail: async (options) => {
          console.log("📧 Email would be sent:", {
            to: options.to,
            subject: options.subject,
            html: options.html?.substring(0, 100) + "...",
          });
          return { messageId: `console-${Date.now()}` };
        },
        verify: async () => true,
      };
    }

    this.isInitialized = true;
  }

  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initPromise;
    }
  }

  // OTP for password reset
  async sendOTP(email, username, otp) {
    await this.ensureInitialized();

    const maxRetries = 3;
    let lastError = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const mailOptions = {
          from: '"Joya Platform" <noreply@joya.com>',
          to: email,
          subject: "Password Reset OTP - Joya",
          html: otpTemplate(username, otp),
        };

        const result = await this.transporter.sendMail(mailOptions);

        const response = {
          success: true,
          messageId: result.messageId,
        };

        // Include preview URL for Ethereal emails (both dev and production)
        if (result.messageId && !result.messageId.startsWith("console-")) {
          try {
            response.previewUrl = nodemailer.getTestMessageUrl(result);
          } catch (e) {
            // Skip preview URL if not available
          }
        }

        return response;
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    return {
      success: false,
      error: lastError?.message || "Unknown email error",
    };
  }

  // Email verification for new users
  async sendEmailVerification(email, username, verificationUrl) {
    await this.ensureInitialized();

    try {
      const mailOptions = {
        from: '"Joya Platform" <noreply@joya.com>',
        to: email,
        subject: "Verify Your Email - Joya",
        html: verificationTemplate(username, verificationUrl),
      };

      const result = await this.transporter.sendMail(mailOptions);

      const response = {
        success: true,
        messageId: result.messageId,
      };

      // Include preview URL for Ethereal emails (both dev and production)
      if (result.messageId && !result.messageId.startsWith("console-")) {
        try {
          response.previewUrl = nodemailer.getTestMessageUrl(result);
        } catch (e) {
          // Skip preview URL if not available
        }
      }

      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async testConnection() {
    await this.ensureInitialized();

    try {
      await this.transporter.verify();
      return { success: true, message: "Email service is ready" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
