const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { getAvgRating } = require("../utils/review.js");

// Advanced search API endpoint
router.get("/api/search", async (req, res) => {
  try {
    const {
      q, // Search query
      category, // Property category
      minPrice, // Minimum price
      maxPrice, // Maximum price
      facilities, // Required facilities
      location, // Specific location
      country, // Specific country
      minRating, // Minimum rating
      sortBy, // Sort option
      page = 1, // Pagination
      limit = 12, // Items per page
    } = req.query;

    let filter = {};
    let sort = {};

    // Text search with MongoDB text index
    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    // Category filter
    if (category && category !== "all") {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Location filters
    if (location) {
      filter.location = new RegExp(location.trim(), "i");
    }

    if (country) {
      filter.country = new RegExp(country.trim(), "i");
    }

    // Facilities filter
    if (facilities) {
      const facilityArray = Array.isArray(facilities)
        ? facilities
        : [facilities];
      filter.facilities = { $all: facilityArray };
    }

    // Sorting
    if (q && q.trim()) {
      sort.score = { $meta: "textScore" }; // Relevance score for text search
    }

    switch (sortBy) {
      case "price_low":
        sort.price = 1;
        break;
      case "price_high":
        sort.price = -1;
        break;
      case "newest":
        sort._id = -1;
        break;
      default:
        if (!sort.score) {
          sort._id = -1; // Default to newest
        }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute search with pagination
    const [listings, totalCount] = await Promise.all([
      Listing.find(filter)
        .populate("reviews")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(filter),
    ]);

    // Process results
    const processedListings = listings
      .map((listing) => {
        const avgRating = getAvgRating(listing.reviews);

        // Filter by minimum rating if specified
        if (minRating && avgRating < parseFloat(minRating)) {
          return null;
        }

        return {
          _id: listing._id,
          title: listing.title,
          description: listing.description,
          image: listing.image,
          price: listing.price,
          location: listing.location,
          country: listing.country,
          category: listing.category,
          facilities: listing.facilities,
          avgRating: avgRating,
          reviewCount: listing.reviews.length,
          owner: listing.owner,
        };
      })
      .filter(Boolean);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    res.json({
      success: true,
      data: {
        listings: processedListings,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limitNum,
          hasNext,
          hasPrev,
        },
        filters: {
          query: q || "",
          category: category || "all",
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          location: location || "",
          country: country || "",
          facilities: facilities || [],
          minRating: minRating || null,
          sortBy: sortBy || "relevance",
        },
      },
    });
  } catch (error) {
    console.error("Advanced search error:", error);
    res.status(500).json({
      success: false,
      error: "Search failed. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Search suggestions API
router.get("/api/search/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const query = q.trim();
    const regex = new RegExp(query, "i");

    // Get unique suggestions from different fields
    const [titles, locations, countries, facilities] = await Promise.all([
      Listing.distinct("title", { title: regex }),
      Listing.distinct("location", { location: regex }),
      Listing.distinct("country", { country: regex }),
      Listing.distinct("facilities", { facilities: regex }),
    ]);

    // Combine and limit suggestions
    const allSuggestions = [
      ...titles.slice(0, 3),
      ...locations.slice(0, 3),
      ...countries.slice(0, 2),
      ...facilities.slice(0, 2),
    ];

    // Remove duplicates and limit
    const uniqueSuggestions = [...new Set(allSuggestions)]
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8);

    res.json({ suggestions: uniqueSuggestions });
  } catch (error) {
    console.error("Search suggestions error:", error);
    res.json({ suggestions: [] });
  }
});

module.exports = router;
