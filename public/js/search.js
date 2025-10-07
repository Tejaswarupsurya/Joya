const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector("form[role='search']");
const resultsContainer = document.querySelector("#listings-container");
const categoryButtons = document.querySelectorAll(".category-btn");
const taxToggle = document.querySelector("#taxToggle");
let debounceTimer;
let activeCategory = null;
let searchCache = new Map();

// Search suggestions (you can expand this list)
const popularSearches = [
  "beach",
  "hotel",
  "resort",
  "villa",
  "apartment",
  "goa",
  "mumbai",
  "delhi",
  "bangalore",
  "kerala",
  "rajasthan",
  "himalaya",
  "pool",
  "wifi",
  "breakfast",
];

function addGST(price, taxPercent = 18) {
  const tax = (price * taxPercent) / 100;
  return Math.round(price + tax);
}

// Enhanced search with caching and better error handling
async function fetchAndRenderListings(url) {
  try {
    // Check cache first
    if (searchCache.has(url)) {
      const cachedResult = searchCache.get(url);
      resultsContainer.innerHTML = cachedResult;
      applySavedState();
      return;
    }

    showSkeletonLoader(resultsContainer);
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const freshListings = doc.querySelector("#listings-container");

    if (!freshListings) {
      throw new Error("Invalid response format");
    }

    resultsContainer.innerHTML = freshListings.innerHTML;

    // Show the listings container
    resultsContainer.style.display = "";

    // Hide and clean up any no-results sections
    const parentContainer = resultsContainer.parentNode;

    // Hide static no-results
    const staticNoResults = parentContainer.querySelector(
      ".no-results-container"
    );
    if (staticNoResults) {
      const staticContainer = staticNoResults.closest(".container-fluid");
      if (staticContainer && staticContainer !== resultsContainer.parentNode) {
        staticContainer.style.display = "none";
      }
    }

    // Remove dynamic no-results
    const dynamicNoResults = parentContainer.querySelector(
      ".dynamic-no-results"
    );
    if (dynamicNoResults) {
      dynamicNoResults.remove();
    }

    // Cache the result (limit cache size)
    if (searchCache.size > 50) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }
    searchCache.set(url, freshListings.innerHTML);

    applySavedState();
    updateResultsInfo();
  } catch (err) {
    renderError(
      "Oops! Something went wrong while searching. Please try again."
    );
    console.error("Search failed:", err);
  }
}

function applySavedState() {
  if (taxToggle?.checked) {
    const priceEls = resultsContainer.querySelectorAll(".listing-price");
    priceEls.forEach((el) => {
      const originalPrice = parseInt(el.dataset.originalPrice);
      if (originalPrice) {
        const taxedPrice = addGST(originalPrice);
        el.innerText = `₹${taxedPrice.toLocaleString(
          "en-IN"
        )}/night (incl. GST)`;
      }
    });
  }
}

function updateResultsInfo() {
  const listings = resultsContainer.querySelectorAll(
    ".listing-card, .col-lg-4"
  );
  const count = listings.length;
  const query = searchInput?.value.trim();

  // You can add a results info element to show search stats
  let infoElement = document.querySelector(".search-results-info");
  if (!infoElement) {
    infoElement = document.createElement("div");
    infoElement.className = "search-results-info mb-3";
    resultsContainer.parentNode.insertBefore(infoElement, resultsContainer);
  }

  // If no results and there's a search query, show artistic no-results
  if (count === 0 && query) {
    createArtisticNoResults();
    infoElement.style.display = "none";
    return;
  }

  infoElement.style.display = "block";

  if (query) {
    infoElement.innerHTML = `
      <div class="alert alert-info py-2">
        <i class="bi bi-search me-2"></i>
        Found <strong>${count}</strong> result${
      count !== 1 ? "s" : ""
    } for "<strong>${query}</strong>"
      </div>
    `;
  } else {
    infoElement.innerHTML = `
      <div class="alert alert-light py-2">
        <i class="bi bi-house me-2"></i>
        Showing <strong>${count}</strong> propert${count !== 1 ? "ies" : "y"}
      </div>
    `;
  }
}

function createArtisticNoResults() {
  const query = searchInput?.value.trim() || "your search";

  // Clear the listings container and hide it
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";

  // Find the parent container
  const parentContainer = resultsContainer.parentNode;

  // Remove any existing dynamic no-results
  const existingDynamicNoResults = parentContainer.querySelector(
    ".dynamic-no-results"
  );
  if (existingDynamicNoResults) {
    existingDynamicNoResults.remove();
  }

  // Check if there's a static no-results container (from EJS)
  const staticNoResults = parentContainer.querySelector(
    ".no-results-container"
  );
  if (staticNoResults) {
    // Update the static no-results text and show it
    const textElement = staticNoResults.querySelector(".no-results-text p");
    if (textElement) {
      textElement.innerHTML = `We couldn't find any properties matching "<strong>${query}</strong>". Try adjusting your search terms.`;
    }
    const staticContainer = staticNoResults.closest(".container-fluid");
    if (staticContainer) {
      staticContainer.style.display = "flex";
    }
    return;
  }

  // Create a new dynamic no-results section only if no static one exists
  const noResultsWrapper = document.createElement("div");
  noResultsWrapper.className =
    "dynamic-no-results container-fluid d-flex justify-content-center align-items-center";
  noResultsWrapper.style.minHeight = "60vh";
  noResultsWrapper.innerHTML = `
    <div class="no-results-container">
      <div class="no-results-illustration">
        <div class="search-icon-art">
          <i class="bi bi-search"></i>
          <div class="search-decorative">
            <div class="search-circle"></div>
            <div class="search-circle"></div>
            <div class="search-circle"></div>
          </div>
        </div>
        <div class="search-dots">
          <div class="search-dot"></div>
          <div class="search-dot"></div>
          <div class="search-dot"></div>
        </div>
      </div>

      <div class="no-results-text">
        <h2>No stays found!</h2>
        <p>We couldn't find any properties matching "<strong>${query}</strong>". Try adjusting your search terms.</p>
      </div>
    </div>
  `;

  // Insert after the listings container
  parentContainer.insertBefore(noResultsWrapper, resultsContainer.nextSibling);
}

function clearSearchAndFilters() {
  searchInput.value = "";
  activeCategory = null;

  // Remove active state from category buttons
  categoryButtons.forEach((btn) => btn.classList.remove("active"));

  // Show the listings container
  resultsContainer.style.display = "";

  // Clean up no-results sections
  const parentContainer = resultsContainer.parentNode;

  // Hide static no-results
  const staticNoResults = parentContainer.querySelector(
    ".no-results-container"
  );
  if (staticNoResults) {
    const staticContainer = staticNoResults.closest(".container-fluid");
    if (staticContainer && staticContainer !== resultsContainer.parentNode) {
      staticContainer.style.display = "none";
    }
  }

  // Remove dynamic no-results
  const dynamicNoResults = parentContainer.querySelector(".dynamic-no-results");
  if (dynamicNoResults) {
    dynamicNoResults.remove();
  }

  // Reload listings
  fetchAndRenderListings("/listings");
}

function renderError(message) {
  resultsContainer.innerHTML = `
    <div class="col-12">
      <div class="alert alert-danger text-center">
        <i class="bi bi-exclamation-triangle me-2"></i>
        <strong>${message}</strong>
        <br><small class="mt-2 d-block">Please check your connection and try again</small>
      </div>
    </div>
  `;
}

// Smart search with suggestions
function initSearchSuggestions() {
  if (!searchInput) return;

  const suggestionsContainer = document.createElement("div");
  suggestionsContainer.className =
    "search-suggestions position-absolute bg-white border rounded shadow-sm";
  suggestionsContainer.style.cssText =
    "top: 100%; left: 0; right: 0; z-index: 1000; max-height: 200px; overflow-y: auto; display: none;";
  searchInput.parentNode.style.position = "relative";
  searchInput.parentNode.appendChild(suggestionsContainer);

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim() === "") {
      showPopularSearches(suggestionsContainer);
    }
  });

  searchInput.addEventListener("blur", () => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      suggestionsContainer.style.display = "none";
    }, 200);
  });

  function showPopularSearches(container) {
    container.innerHTML = `
      <div class="p-2">
        <small class="text-muted d-block mb-2">Popular searches:</small>
        ${popularSearches
          .slice(0, 6)
          .map(
            (term) =>
              `<div class="suggestion-item p-2 hover-bg-light cursor-pointer" data-term="${term}">
            <i class="bi bi-search me-2 text-muted"></i>${term}
          </div>`
          )
          .join("")}
      </div>
    `;
    container.style.display = "block";

    // Add click handlers
    container.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        searchInput.value = item.dataset.term;
        performSearch();
        container.style.display = "none";
      });
    });
  }
}

function performSearch() {
  const query = searchInput.value.trim();

  // Minimum search length for better performance
  if (query && query.length < 2) {
    return;
  }

  let url = "/listings";
  const params = new URLSearchParams();

  if (query) params.append("q", query);
  if (activeCategory) params.append("category", activeCategory);

  if (params.toString()) {
    url += "?" + params.toString();
  }

  fetchAndRenderListings(url);
}

// Enhanced input handler with better debouncing

// Enhanced search input with suggestions
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    performSearch();
  }, 300);
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (window.location.pathname !== "/listings") {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (activeCategory) params.append("category", activeCategory);

    const targetUrl =
      "/listings" + (params.toString() ? "?" + params.toString() : "");
    window.location.href = targetUrl;
  } else {
    performSearch();
  }
});

// Enhanced category buttons with better state management
categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedCategory = btn.dataset.category;
    const query = searchInput?.value.trim();

    if (activeCategory === selectedCategory) {
      activeCategory = null;
      btn.classList.remove("active");
    } else {
      activeCategory = selectedCategory;
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    }

    // Clear cache when category changes
    searchCache.clear();
    performSearch();
  });
});

if (taxToggle) {
  taxToggle.addEventListener("change", () => {
    // Clear cache when tax toggle changes
    searchCache.clear();
    performSearch();
  });
}

// Initialize search suggestions
if (searchInput) {
  initSearchSuggestions();
}

// Add CSS for hover effects
if (!document.querySelector("#search-styles")) {
  const style = document.createElement("style");
  style.id = "search-styles";
  style.textContent = `
    .hover-bg-light:hover {
      background-color: #f8f9fa !important;
    }
    .cursor-pointer {
      cursor: pointer;
    }
    .search-suggestions {
      border-color: #dee2e6 !important;
    }
    .suggestion-item {
      border-radius: 4px;
      margin: 2px 0;
    }
  `;
  document.head.appendChild(style);
}
