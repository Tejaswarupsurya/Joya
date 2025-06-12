const searchInput = document.querySelector(".search-input");
const searchForm = document.querySelector("form[role='search']");
const resultsContainer = document.querySelector("#listings-container");
const categoryButtons = document.querySelectorAll(".category-btn");
const taxToggle = document.querySelector("#taxToggle");
let debounceTimer;
let activeCategory = null;

function addGST(price, taxPercent = 18) {
  const tax = (price * taxPercent) / 100;
  return Math.round(price + tax);
}

async function fetchAndRenderListings(url) {
  try {
    showSkeletonLoader(resultsContainer);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const freshListings = doc.querySelector("#listings-container");
    resultsContainer.innerHTML = freshListings.innerHTML;

    if (taxToggle?.checked) {
      const priceEls = resultsContainer.querySelectorAll(".listing-price");
      priceEls.forEach((el) => {
        const originalPrice = parseInt(el.dataset.originalPrice);
        const taxedPrice = addGST(originalPrice);
        el.innerText = `₹${taxedPrice.toLocaleString(
          "en-IN"
        )}/night (incl. GST)`;
      });
    }
  } catch (err) {
    renderError("Oops! Something went wrong while searching.");
    console.error("Search failed:", err);
  }
}

function renderError(message) {
  resultsContainer.innerHTML = `
    <div class="col-12">
      <div class="alert alert-danger text-center fw-bold">${message}</div>
    </div>
  `;
}

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const query = searchInput.value.trim();

    const url = query
      ? `/listings?q=${encodeURIComponent(query)}`
      : `/listings`;

    fetchAndRenderListings(url);
  }, 300);
});

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (window.location.pathname !== "/listings") {
    const targetUrl = query
      ? `/listings?q=${encodeURIComponent(query)}`
      : `/listings`;
    window.location.href = targetUrl;
  } else {
    const url = query
      ? `/listings?q=${encodeURIComponent(query)}`
      : `/listings`;
    fetchAndRenderListings(url);
  }
});

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedCategory = btn.dataset.category;
    const query = searchInput?.value.trim();

    if (activeCategory === selectedCategory) {
      activeCategory = null;
      btn.classList.remove("active");

      const url = query
        ? `/listings?q=${encodeURIComponent(query)}`
        : `/listings`;
      fetchAndRenderListings(url);
      return;
    }

    activeCategory = selectedCategory;
    categoryButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    let url = `/listings?category=${encodeURIComponent(selectedCategory)}`;
    if (query) url += `&q=${encodeURIComponent(query)}`;

    fetchAndRenderListings(url);
  });
});

if(taxToggle){
  taxToggle.addEventListener("change", () => {
    const query = searchInput?.value.trim();
    let url = "/listings";
    if (activeCategory)
      url += `?category=${encodeURIComponent(activeCategory)}`;
    if (query)
      url += (url.includes("?") ? "&" : "?") + `q=${encodeURIComponent(query)}`;

    fetchAndRenderListings(url);
  });
};

