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

    // Try explicit SMTP configuration instead of "gmail" service
    // This often works better in production environments
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Try 587 first (STARTTLS)
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add connection and socket timeouts
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      // Add debug options
      debug: process.env.NODE_ENV !== "production",
      logger: process.env.NODE_ENV !== "production",
      // Ignore TLS errors (sometimes needed in production)
      tls: {
        rejectUnauthorized: false,
      },
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
    const configurations = [
      // Try SendGrid first (if API key is available)
      ...(process.env.SENDGRID_API_KEY
        ? [
            {
              name: "SendGrid API (Recommended for production)",
              config: {
                service: "SendGrid",
                auth: {
                  user: "apikey",
                  pass: process.env.SENDGRID_API_KEY,
                },
              },
            },
          ]
        : []),

      // Try Outlook if credentials are available
      ...(process.env.EMAIL_USER && process.env.EMAIL_USER.includes("outlook")
        ? [
            {
              name: "Outlook SMTP",
              config: {
                service: "Outlook365",
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD,
                },
                connectionTimeout: 30000,
              },
            },
          ]
        : []),

      // Gmail configurations
      {
        name: "Gmail SMTP with STARTTLS (Port 587)",
        config: {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 30000,
          tls: { rejectUnauthorized: false },
        },
      },
      {
        name: "Gmail SMTP with SSL (Port 465)",
        config: {
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 30000,
          tls: { rejectUnauthorized: false },
        },
      },
      {
        name: "Gmail Service (Simplified)",
        config: {
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          connectionTimeout: 30000,
        },
      },
    ];

    for (const { name, config } of configurations) {
      try {
        console.log(`📧 Testing ${name}...`);
        const testTransporter = nodemailer.createTransport(config);
        await testTransporter.verify();
        console.log(`✅ ${name} - Connection successful!`);

        // Update the main transporter to use the working configuration
        this.transporter = testTransporter;
        return true;
      } catch (error) {
        console.error(`❌ ${name} - Failed:`, error.message);
      }
    }

    console.error("❌ All email service configurations failed");
    return false;
  }
}

module.exports = new EmailService();
