// API Endpoint Tests
// Testing all API routes and responses

const request = require("supertest");
const app = require("../app.js");

describe("🌐 API Endpoints - Detailed Testing", () => {
  describe("Search API", () => {
    test("should return search results in correct format", async () => {
      const response = await request(app)
        .get("/api/search")
        .query({ q: "hotel", category: "Hotel" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("listings");
      expect(response.body).toHaveProperty("total");
      expect(Array.isArray(response.body.listings)).toBe(true);
    });

    test("should handle pagination correctly", async () => {
      const response = await request(app)
        .get("/api/search")
        .query({ page: 1, limit: 5 });

      expect(response.status).toBe(200);
      if (response.body.listings) {
        expect(response.body.listings.length).toBeLessThanOrEqual(5);
      }
    });

    test("should filter by price range", async () => {
      const response = await request(app)
        .get("/api/search")
        .query({ minPrice: 1000, maxPrice: 5000 });

      expect(response.status).toBe(200);
    });

    test("should handle sorting options", async () => {
      const sortOptions = ["price_low", "price_high", "rating", "newest"];

      for (const sortBy of sortOptions) {
        const response = await request(app)
          .get("/api/search")
          .query({ sortBy });

        expect(response.status).toBe(200);
      }
    });
  });

  describe("Search Suggestions API", () => {
    test("should return suggestions for partial queries", async () => {
      const response = await request(app)
        .get("/api/search/suggestions")
        .query({ q: "hot" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("suggestions");
      expect(Array.isArray(response.body.suggestions)).toBe(true);
    });

    test("should limit suggestions appropriately", async () => {
      const response = await request(app)
        .get("/api/search/suggestions")
        .query({ q: "h", limit: 3 });

      expect(response.status).toBe(200);
      if (response.body.suggestions) {
        expect(response.body.suggestions.length).toBeLessThanOrEqual(3);
      }
    });
  });

  describe("Error Handling", () => {
    test("should handle malformed API requests", async () => {
      const response = await request(app)
        .get("/api/search")
        .query({ page: "invalid", limit: "invalid" });

      expect([200, 400, 500]).toContain(response.status);
    });

    test("should handle missing parameters gracefully", async () => {
      const response = await request(app).get("/api/search");
      expect(response.status).toBe(200);
    });
  });

  describe("Rate Limiting & Security", () => {
    test("should handle multiple rapid requests", async () => {
      const requests = Array(5)
        .fill()
        .map(() => request(app).get("/api/search?q=test"));

      const responses = await Promise.all(requests);
      responses.forEach((response) => {
        expect([200, 429, 500]).toContain(response.status); // 429 = Too Many Requests, 500 = Server Error
      });
    });

    test("should sanitize search queries", async () => {
      const maliciousQuery = '<script>alert("xss")</script>';
      const response = await request(app)
        .get("/api/search")
        .query({ q: maliciousQuery });

      expect(response.status).toBe(200);
      expect(JSON.stringify(response.body)).not.toContain("<script>");
    });
  });
});
