// Email Testing Route - Remove this in production
const express = require("express");
const router = express.Router();
const emailService = require("../utils/emailService.js");

// Test email functionality - REMOVE IN PRODUCTION
router.get("/test-email", async (req, res) => {
  try {
    // Check if user is admin (for security)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized" });
    }

    console.log("🧪 Starting email diagnostics...");

    // 1. Check environment variables
    const envCheck = {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
      NODE_ENV: process.env.NODE_ENV,
    };

    console.log("🔍 Environment variables:", envCheck);

    // 2. Test connection
    const connectionTest = await emailService.testConnection();

    // 3. Try sending a test email to admin
    let testEmailResult = null;
    if (connectionTest) {
      try {
        testEmailResult = await emailService.sendEmailVerification(
          req.user.email,
          req.user.username,
          "https://example.com/test-verification"
        );
        console.log("📧 Test email result:", testEmailResult);
      } catch (error) {
        console.error("❌ Test email failed:", error);
        testEmailResult = { success: false, error: error.message };
      }
    }

    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      connectionTest,
      testEmailResult,
      status:
        connectionTest && testEmailResult?.success ? "✅ WORKING" : "❌ FAILED",
    };

    res.json(diagnostics);
  } catch (error) {
    console.error("🧪 Email diagnostics failed:", error);
    res.status(500).json({
      error: "Diagnostics failed",
      message: error.message,
    });
  }
});

module.exports = router;
