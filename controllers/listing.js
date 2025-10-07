//cloudinary
const cloudinary = require("cloudinary").v2;

//mapbox Section
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//utils section
const {
  categoryList,
  categoryIcons,
  facilitiesList,
  facilityIcons,
} = require("../utils/constants.js");
const { getAvgRating, getStarBreakdown } = require("../utils/review.js");

//mongodb Section
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { q, category, minPrice, maxPrice, facilities, sortBy } = req.query;
  let filter = {};
  let sort = {};

  // Enhanced search logic
  if (q && q.trim()) {
    const searchTerm = q.trim();
    const words = searchTerm.split(/\s+/).filter((word) => word.length > 0);

    // Create flexible search patterns
    const searchConditions = [];

    // For each word, create partial match conditions
    words.forEach((word) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const wordRegex = new RegExp(escapedWord, "i");

      searchConditions.push(
        { title: wordRegex },
        { description: wordRegex },
        { location: wordRegex },
        { country: wordRegex },
        { facilities: { $in: [wordRegex] } }
      );
    });

    // Exact phrase matching (higher priority)
    const exactRegex = new RegExp(
      searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
    const exactConditions = [
      { title: exactRegex },
      { description: exactRegex },
      { location: exactRegex },
      { country: exactRegex },
    ];

    filter.$or = [...exactConditions, ...searchConditions];
  }

  // Category filtering
  if (category && category !== "all") {
    filter.category = category;
  }

  // Price range filtering
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Facilities filtering
  if (facilities) {
    const facilityArray = Array.isArray(facilities) ? facilities : [facilities];
    filter.facilities = { $all: facilityArray };
  }

  // Sorting logic
  switch (sortBy) {
    case "price_low":
      sort.price = 1;
      break;
    case "price_high":
      sort.price = -1;
      break;
    case "rating":
      // We'll handle this after population
      break;
    case "newest":
      sort._id = -1;
      break;
    default:
      // Default sorting by relevance (if search query) or newest
      if (q) {
        // For search queries, we'll handle relevance scoring later
      } else {
        sort._id = -1;
      }
  }

  const allListings = await Listing.find(filter).populate("reviews").sort(sort);
  // Calculate average ratings and relevance scores
  allListings.forEach((listing) => {
    listing.avgRating = getAvgRating(listing.reviews);

    // Calculate search relevance score if there's a query
    if (q && q.trim()) {
      listing.relevanceScore = calculateRelevanceScore(listing, q.trim());
    }
  });

  // Sort by rating if requested (needs to be done after rating calculation)
  if (sortBy === "rating") {
    allListings.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
  } else if (q && q.trim() && !sortBy) {
    // Sort by relevance for search queries
    allListings.sort(
      (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
    );
  }

  // Get user's wishlist if logged in
  let userWishlist = [];
  if (req.user) {
    const User = require("../models/user.js");
    const user = await User.findById(req.user._id).select("wishlist");
    userWishlist = user.wishlist.map((id) => id.toString());
  }

  // Search analytics (log search for insights)
  if (q && q.trim()) {
    const searchAnalytics = require("../utils/searchAnalytics.js");
    searchAnalytics.logSearch(q.trim(), allListings.length, category);
    console.log(`Search performed: "${q}" - ${allListings.length} results`);
  }

  res.render("./listings/index.ejs", {
    allListings,
    categoryList,
    categoryIcons,
    userWishlist,
    currUser: req.user,
    searchQuery: q || "",
    appliedFilters: {
      category: category || "all",
      minPrice: minPrice || "",
      maxPrice: maxPrice || "",
      facilities: facilities || [],
      sortBy: sortBy || "relevance",
    },
    totalResults: allListings.length,
  });
};

// Helper function to calculate search relevance score
function calculateRelevanceScore(listing, query) {
  let score = 0;
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);

  // Title matches (highest priority)
  if (listing.title && listing.title.toLowerCase().includes(queryLower)) {
    score += 10;
  }
  words.forEach((word) => {
    if (listing.title && listing.title.toLowerCase().includes(word)) {
      score += 5;
    }
  });

  // Location matches (high priority)
  if (listing.location && listing.location.toLowerCase().includes(queryLower)) {
    score += 8;
  }
  words.forEach((word) => {
    if (listing.location && listing.location.toLowerCase().includes(word)) {
      score += 4;
    }
  });

  // Country matches
  if (listing.country && listing.country.toLowerCase().includes(queryLower)) {
    score += 6;
  }

  // Description matches
  if (
    listing.description &&
    listing.description.toLowerCase().includes(queryLower)
  ) {
    score += 3;
  }
  words.forEach((word) => {
    if (
      listing.description &&
      listing.description.toLowerCase().includes(word)
    ) {
      score += 1;
    }
  });

  // Facilities matches
  if (listing.facilities && listing.facilities.length > 0) {
    listing.facilities.forEach((facility) => {
      if (facility.toLowerCase().includes(queryLower)) {
        score += 2;
      }
      words.forEach((word) => {
        if (facility.toLowerCase().includes(word)) {
          score += 1;
        }
      });
    });
  }

  // Boost score based on rating (quality factor)
  if (listing.avgRating) {
    score += listing.avgRating * 0.5;
  }

  return score;
}

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs", { facilitiesList });
};

module.exports.showListings = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The Listing you requested for Does'nt Exist!");
    return res.redirect("/listings");
  }
  const avgRating = getAvgRating(listing.reviews);
  const starBreakdown = getStarBreakdown(listing.reviews);

  res.render("./listings/show.ejs", {
    listing,
    categoryIcons,
    facilityIcons,
    avgRating,
    starBreakdown,
  });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Hotel Added!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The Listing you requested for Does'nt Exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250,f_auto,q_auto"
  );
  res.render("./listings/edit.ejs", {
    listing,
    originalImageUrl,
    categoryList,
    facilitiesList,
  });
};

module.exports.updateListing = async (req, res) => {
  const id = req.params.id;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  listing.geometry = response.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Successfully!");
  res.redirect("/listings");
};
