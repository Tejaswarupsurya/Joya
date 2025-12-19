// This file exists because jest.config.json references it.

require("dotenv").config();

process.env.NODE_ENV = "test";

// Provide safe defaults so `npm test` works without a real .env in CI.
process.env.SECRET = process.env.SECRET || "test-secret";
process.env.MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/joya_test";

process.env.MAP_TOKEN = process.env.MAP_TOKEN || "test-mapbox-token";
process.env.CLOUD_NAME = process.env.CLOUD_NAME || "test-cloud";
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "test-api-key";
process.env.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || "test-api-secret";

jest.setTimeout(30000);
