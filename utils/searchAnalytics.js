// Search Analytics Utility
// This module tracks search queries and provides insights

const fs = require("fs").promises;
const path = require("path");

class SearchAnalytics {
  constructor() {
    this.logFile = path.join(__dirname, "../logs/search-analytics.json");
    this.analytics = {
      totalSearches: 0,
      popularQueries: {},
      noResultsQueries: [],
      avgResultsPerSearch: 0,
      searchTrends: {},
    };
    this.loadAnalytics();
  }

  async loadAnalytics() {
    try {
      const data = await fs.readFile(this.logFile, "utf8");
      this.analytics = { ...this.analytics, ...JSON.parse(data) };
    } catch (error) {
      // File doesn't exist yet, will be created on first save
      console.log("Creating new search analytics file");
    }
  }

  async saveAnalytics() {
    try {
      // Ensure logs directory exists
      const logsDir = path.dirname(this.logFile);
      await fs.mkdir(logsDir, { recursive: true });

      await fs.writeFile(this.logFile, JSON.stringify(this.analytics, null, 2));
    } catch (error) {
      console.error("Error saving search analytics:", error);
    }
  }

  logSearch(query, resultCount = 0, category = null, location = null) {
    if (!query || query.trim() === "") return;

    const normalizedQuery = query.trim().toLowerCase();
    const today = new Date().toISOString().split("T")[0];

    // Update total searches
    this.analytics.totalSearches++;

    // Track popular queries
    if (!this.analytics.popularQueries[normalizedQuery]) {
      this.analytics.popularQueries[normalizedQuery] = 0;
    }
    this.analytics.popularQueries[normalizedQuery]++;

    // Track no-results queries
    if (resultCount === 0) {
      this.analytics.noResultsQueries.push({
        query: normalizedQuery,
        timestamp: new Date().toISOString(),
        category,
        location,
      });

      // Keep only last 100 no-results queries
      if (this.analytics.noResultsQueries.length > 100) {
        this.analytics.noResultsQueries =
          this.analytics.noResultsQueries.slice(-100);
      }
    }

    // Track daily trends
    if (!this.analytics.searchTrends[today]) {
      this.analytics.searchTrends[today] = {
        count: 0,
        avgResults: 0,
        queries: [],
      };
    }

    const todayData = this.analytics.searchTrends[today];
    todayData.count++;
    todayData.avgResults =
      (todayData.avgResults * (todayData.count - 1) + resultCount) /
      todayData.count;
    todayData.queries.push(normalizedQuery);

    // Update overall average
    this.analytics.avgResultsPerSearch =
      (this.analytics.avgResultsPerSearch * (this.analytics.totalSearches - 1) +
        resultCount) /
      this.analytics.totalSearches;

    // Save analytics (async, non-blocking)
    this.saveAnalytics().catch(console.error);
  }

  getPopularSearches(limit = 10) {
    return Object.entries(this.analytics.popularQueries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query, count]) => ({ query, count }));
  }

  getNoResultsQueries(limit = 20) {
    return this.analytics.noResultsQueries.slice(-limit).reverse();
  }

  getSearchTrends(days = 7) {
    const trends = {};
    const today = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      trends[dateStr] = this.analytics.searchTrends[dateStr] || {
        count: 0,
        avgResults: 0,
        queries: [],
      };
    }

    return trends;
  }

  getSuggestions(query) {
    const normalizedQuery = query.toLowerCase();
    const suggestions = [];

    // Find similar queries from popular searches
    Object.keys(this.analytics.popularQueries).forEach((popularQuery) => {
      if (
        popularQuery.includes(normalizedQuery) ||
        normalizedQuery.includes(popularQuery)
      ) {
        suggestions.push({
          query: popularQuery,
          popularity: this.analytics.popularQueries[popularQuery],
        });
      }
    });

    return suggestions
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map((s) => s.query);
  }

  getAnalytics() {
    return this.analytics;
  }

  getAnalyticsSummary() {
    return {
      totalSearches: this.analytics.totalSearches,
      avgResultsPerSearch:
        Math.round(this.analytics.avgResultsPerSearch * 100) / 100,
      popularQueries: this.getPopularSearches(5),
      noResultsCount: this.analytics.noResultsQueries.length,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Singleton instance
const searchAnalytics = new SearchAnalytics();

module.exports = searchAnalytics;
