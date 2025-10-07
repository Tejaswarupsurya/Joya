const mongoose = require("mongoose");

// Database optimization script for search performance
async function optimizeSearchIndexes() {
  try {
    console.log("🔍 Optimizing search indexes...");

    const db = mongoose.connection.db;

    // Create text indexes for full-text search
    await db.collection("listings").createIndex(
      {
        title: "text",
        description: "text",
        location: "text",
        country: "text",
        facilities: "text",
      },
      {
        weights: {
          title: 10, // Highest priority
          location: 8, // High priority
          country: 6, // Medium-high priority
          description: 4, // Medium priority
          facilities: 2, // Lower priority
        },
        name: "search_text_index",
      }
    );

    // Create compound indexes for common search patterns
    await db.collection("listings").createIndex({ category: 1, price: 1 });
    await db.collection("listings").createIndex({ location: 1, category: 1 });
    await db.collection("listings").createIndex({ country: 1, price: 1 });
    await db.collection("listings").createIndex({ facilities: 1 });
    await db.collection("listings").createIndex({ price: 1 });

    // Create geospatial index for location-based searches
    await db.collection("listings").createIndex({ geometry: "2dsphere" });

    console.log("✅ Search indexes created successfully!");
    console.log("📈 Search performance should be significantly improved.");

    // Show current indexes
    const indexes = await db.collection("listings").listIndexes().toArray();
    console.log("📋 Current indexes:");
    indexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });
  } catch (error) {
    console.error("❌ Error creating search indexes:", error);
  }
}

module.exports = { optimizeSearchIndexes };

// If run directly
if (require.main === module) {
  const connectDB = async () => {
    try {
      await mongoose.connect(
        process.env.ATLASDB_URL || "mongodb://localhost:27017/joya"
      );
      console.log("Connected to MongoDB");
      await optimizeSearchIndexes();
      process.exit(0);
    } catch (error) {
      console.error("Database connection error:", error);
      process.exit(1);
    }
  };

  connectDB();
}
