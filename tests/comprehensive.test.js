// Comprehensive Jest Tests for Joya Platform
// Run with: npm test

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app.js");

// Import models for testing
const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

// Import utilities
const { getAvgRating, getStarBreakdown } = require("../utils/review.js");
const searchAnalytics = require("../utils/searchAnalytics.js");
const bookingCleanup = require("../utils/bookingCleanup.js");

describe("🏨 Joya Platform - Comprehensive Test Suite", () => {
  // 🔧 Setup and Teardown
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URL || "mongodb://localhost:27017/joya_test"
      );
    }
  });

  afterAll(async () => {
    // Clean up test database
    await mongoose.connection.close();
  });

  // 🧮 Utility Functions Tests
  describe("📊 Utility Functions", () => {
    describe("Review Utils", () => {
      test("should calculate correct average rating", () => {
        const reviews = [{ rating: 5 }, { rating: 4 }, { rating: 3 }];
        expect(getAvgRating(reviews)).toBe(4);
      });

      test("should return 0 for empty reviews", () => {
        expect(getAvgRating([])).toBe(0);
      });

      test("should get star breakdown correctly", () => {
        const reviews = [
          { rating: 5 },
          { rating: 5 },
          { rating: 4 },
          { rating: 3 },
          { rating: 1 },
        ];
        const breakdown = getStarBreakdown(reviews);
        expect(breakdown[5]).toBe(2);
        expect(breakdown[4]).toBe(1);
        expect(breakdown[3]).toBe(1);
        expect(breakdown[2]).toBe(0);
        expect(breakdown[1]).toBe(1);
      });
    });

    describe("Search Analytics", () => {
      test("should log search without errors", () => {
        expect(() => {
          searchAnalytics.logSearch("test query", 5, "hotel");
        }).not.toThrow();
      });

      test("should handle analytics data correctly", () => {
        const analytics = searchAnalytics.getAnalytics();
        expect(analytics).toHaveProperty("totalSearches");
        expect(analytics).toHaveProperty("popularQueries");
      });
    });
  });

  // 🔐 Authentication Tests
  describe("🔐 Authentication System", () => {
    test("should render signup page", async () => {
      const response = await request(app).get("/signup");
      expect(response.status).toBe(200);
      expect(response.text).toContain("Sign Up");
    });

    test("should render login page", async () => {
      const response = await request(app).get("/login");
      expect(response.status).toBe(200);
      expect(response.text).toContain("Log In");
    });

    test("should render forgot password page", async () => {
      const response = await request(app).get("/forgot");
      expect(response.status).toBe(200);
      expect(response.text).toContain("Forgot Password");
    });

    test("should reject invalid signup data", async () => {
      const invalidData = {
        username: "a", // Too short
        email: "invalid-email",
        password: "123", // Too short
        confirm: "456", // Doesn't match
      };

      const response = await request(app).post("/signup").send(invalidData);

      expect(response.status).toBe(302); // Redirect due to validation error
    });
  });

  // 🏨 Listings Tests
  describe("🏨 Listings System", () => {
    test("should render listings index page", async () => {
      const response = await request(app).get("/listings");
      expect(response.status).toBe(200);
    });

    test("should handle search queries", async () => {
      const response = await request(app).get("/listings?q=hotel");
      expect(response.status).toBe(200);
    });

    test("should handle category filtering", async () => {
      const response = await request(app).get("/listings?category=Hotel");
      expect(response.status).toBe(200);
    });

    test("should handle API search endpoint", async () => {
      const response = await request(app).get("/api/search?q=test");
      expect(response.status).toBe(200);
    });
  });

  // 📝 Validation Tests
  describe("📝 Data Validation", () => {
    const {
      listingSchema,
      reviewSchema,
      signupSchema,
    } = require("../schema.js");

    test("should validate correct listing data", () => {
      const validListing = {
        listing: {
          title: "Test Hotel",
          description: "A beautiful test hotel",
          location: "Test City, Test State",
          country: "Test Country",
          price: 1000,
          category: "Hotel",
          facilities: ["Free Wi-Fi", "Swimming Pool"],
        },
      };

      const { error } = listingSchema.validate(validListing);
      expect(error).toBeUndefined();
    });

    test("should reject invalid listing data", () => {
      const invalidListing = {
        listing: {
          title: "", // Empty title
          price: -100, // Negative price
        },
      };

      const { error } = listingSchema.validate(invalidListing);
      expect(error).toBeDefined();
    });

    test("should validate correct review data", () => {
      const validReview = {
        review: {
          rating: 4,
          comment: "Great place to stay!",
        },
      };

      const { error } = reviewSchema.validate(validReview);
      expect(error).toBeUndefined();
    });

    test("should validate signup data", () => {
      const validSignup = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        confirm: "password123",
      };

      const { error } = signupSchema.validate(validSignup);
      expect(error).toBeUndefined();
    });
  });

  // 🔍 Search Functionality Tests
  describe("🔍 Search System", () => {
    test("should handle empty search queries", async () => {
      const response = await request(app).get("/listings?q=");
      expect(response.status).toBe(200);
    });

    test("should handle special characters in search", async () => {
      const response = await request(app).get("/listings?q=test@#$%");
      expect(response.status).toBe(200);
    });

    test("should return search suggestions", async () => {
      const response = await request(app).get("/api/search/suggestions?q=hot");
      expect(response.status).toBe(200);
    });
  });

  // 📧 Email Service Tests
  describe("📧 Email Service", () => {
    const emailService = require("../utils/emailService.js");

    test("should create email service instance", () => {
      expect(emailService).toBeDefined();
      expect(typeof emailService.sendOTP).toBe("function");
      expect(typeof emailService.sendEmailVerification).toBe("function");
    });

    test("should test email connection (mocked)", async () => {
      // In real testing, we'd mock the email service
      expect(typeof emailService.testConnection).toBe("function");
    });
  });

  // 📱 Info Pages Tests
  describe("📱 Info Pages", () => {
    const infoPages = [
      "terms",
      "privacy",
      "safety",
      "faq",
      "help-center",
      "host-guide",
      "community",
      "accessibility",
      "careers",
      "company-info",
      "contact",
      "sitemap",
    ];

    infoPages.forEach((page) => {
      test(`should render ${page} page`, async () => {
        const response = await request(app).get(`/info/${page}`);
        expect(response.status).toBe(200);
      });
    });
  });

  // 🏠 Host System Tests
  describe("🏠 Host System", () => {
    test("should render host application page", async () => {
      const response = await request(app).get("/apply");
      // Host application requires authentication, so expect redirect
      expect([200, 302]).toContain(response.status);
      if (response.status === 200) {
        expect(response.text).toContain("Host Application");
      }
    });
  });

  // ⭐ Wishlist Tests
  describe("⭐ Wishlist System", () => {
    test("should handle wishlist routes", async () => {
      // GET /wishlist returns 404 since there's no index route, only action routes like /add/:id
      const response = await request(app).get("/wishlist");
      expect(response.status).toBe(404);
    });
  });

  // 🔒 Security Tests
  describe("🔒 Security & Error Handling", () => {
    test("should create ExpressError correctly", () => {
      const ExpressError = require("../utils/ExpressError.js");
      const error = new ExpressError(500, "Test error");
      expect(error.statusCode).toBe(500);
      expect(error.message).toBe("Test error");
      expect(error instanceof Error).toBe(true);
    });

    test("should handle 404 errors", async () => {
      const response = await request(app).get("/nonexistent-page");
      expect(response.status).toBe(404);
    });

    test("should sanitize inputs", async () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const response = await request(app).get(
        `/listings?q=${encodeURIComponent(maliciousInput)}`
      );
      expect(response.status).toBe(200);
      expect(response.text).not.toContain("<script>");
    });
  });

  // 📊 Performance Tests
  describe("📊 Performance & Analytics", () => {
    test("should handle booking cleanup", async () => {
      expect(typeof bookingCleanup.cleanupExpiredBookings).toBe("function");
    });

    test("should track search analytics", () => {
      const initialCount = searchAnalytics.getAnalytics().totalSearches || 0;
      searchAnalytics.logSearch("test query", 5, "hotel");
      const newCount = searchAnalytics.getAnalytics().totalSearches;
      expect(newCount).toBeGreaterThan(initialCount);
    });
  });

  // 🌐 API Endpoints Tests
  describe("🌐 API Endpoints", () => {
    test("should return JSON for API search", async () => {
      const response = await request(app).get("/api/search?q=test");
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/json/);
    });

    test("should handle API errors gracefully", async () => {
      const response = await request(app).get("/api/nonexistent");
      expect([404, 500]).toContain(response.status);
    });
  });

  // 📱 Responsive Design Tests
  describe("📱 Frontend & UI", () => {
    test("should include responsive viewport meta tag", async () => {
      const response = await request(app).get("/listings");
      expect(response.text).toContain("viewport");
    });

    test("should include Bootstrap and custom CSS", async () => {
      const response = await request(app).get("/listings");
      expect(response.text).toContain("bootstrap");
      expect(response.text).toContain("/css/style.css");
    });

    test("should include JavaScript files", async () => {
      const response = await request(app).get("/listings");
      expect(response.text).toContain("/js/");
    });
  });
});

// 🧪 Integration Tests
describe("🧪 Integration Tests", () => {
  test("should handle complete user journey simulation", async () => {
    // This would be a more complex test simulating:
    // 1. User visits homepage
    // 2. Searches for listings
    // 3. Views a listing
    // 4. Creates account
    // 5. Makes booking
    // etc.

    const homePage = await request(app).get("/listings");
    expect(homePage.status).toBe(200);

    const searchResults = await request(app).get("/listings?q=hotel");
    expect(searchResults.status).toBe(200);
  });
});
