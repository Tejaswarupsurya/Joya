// Synonym mapping for intelligent search query expansion
const synonyms = {
  wifi: ["wi-fi", "internet", "wireless", "broadband"],
  pool: ["swimming pool", "pool area", "swimming"],
  ac: ["air conditioning", "air conditioner", "cooling", "a/c"],
  cheap: ["budget", "affordable", "inexpensive", "economical"],
  luxury: ["premium", "deluxe", "5-star", "upscale", "high-end"],
  beach: ["seaside", "coastal", "oceanfront", "beachfront"],
  mountain: ["hills", "highland", "mountainous", "hill station"],
  city: ["urban", "downtown", "metropolitan"],
  parking: ["car park", "parking lot", "parking space"],
  gym: ["fitness", "fitness center", "workout", "exercise"],
  breakfast: ["morning meal", "complimentary breakfast"],
  pet: ["pet-friendly", "pets allowed", "dog-friendly"],
  spa: ["wellness", "massage", "relaxation"],
  garden: ["lawn", "outdoor space", "green area"],
  terrace: ["balcony", "rooftop", "deck"],
};

/**
 * Expands search query with synonyms for better matching
 * @param {string} query - Original search query
 * @returns {string} - Expanded query with synonyms
 */
function expandQuery(query) {
  if (!query) return query;

  let expanded = query;
  const lowerQuery = query.toLowerCase();

  // Check each synonym key
  Object.keys(synonyms).forEach((key) => {
    // Match whole words only (avoid partial matches)
    const wordPattern = new RegExp(`\\b${key}\\b`, "i");
    if (wordPattern.test(lowerQuery)) {
      // Add synonyms to search
      expanded += " " + synonyms[key].join(" ");
    }
  });

  return expanded;
}

module.exports = { expandQuery, synonyms };
