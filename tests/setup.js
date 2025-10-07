// Jest test setup file
require("dotenv").config();

// Set test environment FIRST (before any imports)
process.env.NODE_ENV = "test";
process.env.MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/joya_test";
process.env.SECRET = process.env.SECRET || "test-secret";
process.env.MAP_TOKEN = process.env.MAP_TOKEN || "test-mapbox-token";
process.env.CLOUD_NAME = process.env.CLOUD_NAME || "test-cloud";
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "test-api-key";
process.env.CLOUD_API_SECRET =
  process.env.CLOUD_API_SECRET || "test-api-secret";
process.env.EMAIL_USER = process.env.EMAIL_USER || "test@gmail.com";
process.env.EMAIL_PASS = process.env.EMAIL_PASS || "test-password";

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Global test timeout
jest.setTimeout(30000);

// Mock mongoose with proper Schema constructor and sophisticated query mocking
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");

  const MockObjectId = class {
    constructor(id) {
      this.id = id || "507f1f77bcf86cd799439011";
    }
    toString() {
      return this.id;
    }
  };

  const MockSchema = class {
    constructor(definition, options) {
      this.definition = definition;
      this.options = options || {};
      this.methods = {};
      this.statics = {};
    }
    plugin() {
      return this;
    }
    pre() {
      return this;
    }
    post() {
      return this;
    }
    add() {
      return this;
    }
    index() {
      return this;
    }
    virtual() {
      return { get: () => this, set: () => this };
    }
  };

  MockSchema.Types = {
    ObjectId: MockObjectId,
    String: String,
    Number: Number,
    Date: Date,
    Boolean: Boolean,
    Array: Array,
    Mixed: Object,
  };

  // Create a proper chainable query mock that works with Promise.all
  const createQueryMock = (returnValue = []) => {
    let resolvedValue = returnValue;

    const chainableMethods = {
      skip: jest.fn(function () {
        return this;
      }),
      limit: jest.fn(function () {
        return this;
      }),
      sort: jest.fn(function () {
        return this;
      }),
      populate: jest.fn(function () {
        return this;
      }),
      select: jest.fn(function () {
        return this;
      }),
      lean: jest.fn(function () {
        return this;
      }),
      exec: jest.fn(() => Promise.resolve(resolvedValue)),
    };

    // Create a proper thenable object
    const thenable = {
      ...chainableMethods,
      then(onFulfilled, onRejected) {
        return Promise.resolve(resolvedValue).then(onFulfilled, onRejected);
      },
      catch(onRejected) {
        return Promise.resolve(resolvedValue).catch(onRejected);
      },
      finally(onFinally) {
        return Promise.resolve(resolvedValue).finally(onFinally);
      },
    };

    return thenable;
  }; // Create mock listing data for testing
  const createMockListing = (overrides = {}) => ({
    _id: "507f1f77bcf86cd799439011",
    title: "Test Hotel",
    description: "A beautiful test hotel",
    location: "Mumbai, India",
    country: "India",
    price: 2500,
    facilities: ["WiFi", "AC"],
    category: "Hotel",
    reviews: [],
    avgRating: 4.5,
    image: { url: "https://test-image.jpg" },
    geometry: { coordinates: [72.8777, 19.076] },
    ...overrides,
  });

  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue({}),
    },
    Schema: MockSchema,
    model: jest.fn().mockImplementation((name, schema) => {
      const MockModel = class {
        constructor(data) {
          Object.assign(this, data);
          this._id = "507f1f77bcf86cd799439011";
          this.id = this._id;
        }

        static find(query = {}) {
          // Return mock data based on model type using improved query mock
          if (name === "Listing") {
            const mockListings = [
              createMockListing({ _id: "1", title: "Test Hotel 1" }),
              createMockListing({
                _id: "2",
                title: "Test Resort 2",
                category: "Resort",
              }),
            ];
            return createQueryMock(mockListings);
          }
          return createQueryMock([]);
        }

        static findOne(query = {}) {
          if (name === "User") {
            return Promise.resolve({ _id: "user123", wishlist: [] });
          }
          return Promise.resolve(null);
        }

        static findById(id) {
          if (name === "User") {
            return Promise.resolve({ _id: id, wishlist: [] });
          }
          if (name === "Listing") {
            return Promise.resolve(createMockListing({ _id: id }));
          }
          return Promise.resolve(null);
        }

        static create(data) {
          return Promise.resolve(new MockModel(data));
        }

        static deleteOne() {
          return Promise.resolve({ deletedCount: 1 });
        }

        static updateOne() {
          return Promise.resolve({ modifiedCount: 1 });
        }

        static countDocuments() {
          // Return a proper Promise, not a query mock
          return Promise.resolve(name === "Listing" ? 2 : 0);
        }

        static aggregate() {
          return Promise.resolve([]);
        }

        // Passport-local-mongoose methods
        static authenticate() {
          return () => ({});
        }
        static serializeUser() {
          return () => ({});
        }
        static deserializeUser() {
          return () => ({});
        }
        static register() {
          return Promise.resolve({});
        }

        save() {
          return Promise.resolve(this);
        }
        remove() {
          return Promise.resolve(this);
        }
        populate() {
          return Promise.resolve(this);
        }
      };

      MockModel.schema = schema;
      return MockModel;
    }),
  };
});

// Mock passport-local-mongoose
jest.mock("passport-local-mongoose", () => {
  return jest.fn().mockImplementation(() => {
    return function (schema, options) {
      // Plugin function that adds methods to schema
      schema.statics = schema.statics || {};
      schema.statics.authenticate = () => () => ({});
      schema.statics.serializeUser = () => () => ({});
      schema.statics.deserializeUser = () => () => ({});
      schema.statics.register = () => Promise.resolve({});
      return schema;
    };
  });
});

// Mock cloudinary
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        url: "https://test-image.jpg",
        public_id: "test-id",
      }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));

// Mock mapbox
jest.mock("@mapbox/mapbox-sdk/services/geocoding", () => {
  return jest.fn(() => ({
    forwardGeocode: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        body: {
          features: [
            {
              geometry: { coordinates: [72.8777, 19.076] },
              place_name: "Mumbai, India",
            },
          ],
        },
      }),
    }),
  }));
});

// Mock multer for file uploads
jest.mock("multer", () => {
  return jest.fn(() => ({
    single: jest.fn(() => (req, res, next) => next()),
    array: jest.fn(() => (req, res, next) => next()),
    fields: jest.fn(() => (req, res, next) => next()),
    none: jest.fn(() => (req, res, next) => next()),
    any: jest.fn(() => (req, res, next) => next()),
  }));
});

// Mock nodemailer
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({
      messageId: "test-message-id",
      response: "250 OK",
    }),
    verify: jest.fn().mockResolvedValue(true),
  }),
}));
process.env.SECRET = process.env.SECRET || "test-secret";
process.env.MAP_TOKEN = process.env.MAP_TOKEN || "test-mapbox-token";
process.env.CLOUD_NAME = process.env.CLOUD_NAME || "test-cloud";
process.env.CLOUD_API_KEY = process.env.CLOUD_API_KEY || "test-api-key";
process.env.CLOUD_API_SECRET =
  process.env.CLOUD_API_SECRET || "test-api-secret";
process.env.EMAIL_USER = process.env.EMAIL_USER || "test@gmail.com";
process.env.EMAIL_PASS = process.env.EMAIL_PASS || "test-password";

// Mock console methods for cleaner test output
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Global test timeout
jest.setTimeout(30000);

// Mock mongoose with proper Schema constructor
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  const MockObjectId = class {
    constructor(id) {
      this.id = id || "507f1f77bcf86cd799439011";
    }
    toString() {
      return this.id;
    }
  };

  const MockSchema = class {
    constructor(definition, options) {
      this.definition = definition;
      this.options = options || {};
      this.methods = {};
      this.statics = {};
    }
    plugin() {
      return this;
    }
    pre() {
      return this;
    }
    post() {
      return this;
    }
    add() {
      return this;
    }
    index() {
      return this;
    }
    virtual() {
      return { get: () => this, set: () => this };
    }
  };

  MockSchema.Types = {
    ObjectId: MockObjectId,
    String: String,
    Number: Number,
    Date: Date,
    Boolean: Boolean,
    Array: Array,
    Mixed: Object,
  };

  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      readyState: 1,
      close: jest.fn().mockResolvedValue({}),
    },
    Schema: MockSchema,
    model: jest.fn().mockImplementation((name, schema) => {
      const MockModel = class {
        constructor(data) {
          Object.assign(this, data);
          this._id = "507f1f77bcf86cd799439011";
          this.id = this._id;
        }

        // Create sample data based on model name
        static getSampleData(modelName) {
          if (modelName === "Listing") {
            return [
              {
                _id: "507f1f77bcf86cd799439011",
                title: "Luxury Hotel",
                description: "Beautiful hotel",
                price: 2000,
                location: "Mumbai",
                country: "India",
                category: "Hotel",
                facilities: ["WiFi", "Pool"],
                image: { url: "test.jpg" },
                geometry: { coordinates: [0, 0] },
              },
            ];
          }
          return [];
        }

        static find(query = {}) {
          const sampleData = this.getSampleData(this.modelName || "");
          return {
            skip: (n) => ({
              limit: (l) => Promise.resolve(sampleData.slice(n, n + l)),
              exec: () => Promise.resolve(sampleData),
            }),
            limit: (n) => Promise.resolve(sampleData.slice(0, n)),
            sort: (sortObj) => ({
              skip: (n) => ({
                limit: (l) => Promise.resolve(sampleData.slice(n, n + l)),
              }),
              limit: (l) => Promise.resolve(sampleData.slice(0, l)),
              exec: () => Promise.resolve(sampleData),
            }),
            populate: (field) => ({
              skip: (n) => ({
                limit: (l) => Promise.resolve(sampleData.slice(n, n + l)),
              }),
              exec: () => Promise.resolve(sampleData),
            }),
            exec: () => Promise.resolve(sampleData),
          };
        }
        static findOne(query = {}) {
          const sampleData = this.getSampleData(this.modelName || "");
          return {
            populate: () => Promise.resolve(sampleData[0] || null),
            exec: () => Promise.resolve(sampleData[0] || null),
          };
        }
        static findById(id) {
          const sampleData = this.getSampleData(this.modelName || "");
          return {
            populate: () => Promise.resolve(sampleData[0] || null),
            exec: () => Promise.resolve(sampleData[0] || null),
          };
        }
        static create(data) {
          return Promise.resolve(new MockModel(data));
        }
        static deleteOne() {
          return Promise.resolve({ deletedCount: 1 });
        }
        static updateOne() {
          return Promise.resolve({ modifiedCount: 1 });
        }
        static countDocuments() {
          const sampleData = this.getSampleData(this.modelName || "");
          return Promise.resolve(sampleData.length);
        }
        static aggregate() {
          return Promise.resolve([]);
        }
        static authenticate() {
          return () => ({});
        }
        static serializeUser() {
          return () => ({});
        }
        static deserializeUser() {
          return () => ({});
        }
        static register() {
          return Promise.resolve({});
        }
        save() {
          return Promise.resolve(this);
        }
        remove() {
          return Promise.resolve(this);
        }
        populate() {
          return Promise.resolve(this);
        }
      };
      MockModel.schema = schema;
      MockModel.modelName = name;
      return MockModel;
    }),
  };
});

// Mock passport-local-mongoose
jest.mock("passport-local-mongoose", () => {
  return jest.fn().mockImplementation(() => {
    return function (schema, options) {
      // Plugin function that adds methods to schema
      schema.statics = schema.statics || {};
      schema.statics.authenticate = () => () => ({});
      schema.statics.serializeUser = () => () => ({});
      schema.statics.deserializeUser = () => () => ({});
      schema.statics.register = () => Promise.resolve({});
      return schema;
    };
  });
});
