// Navbar dropdown functionality
document.addEventListener("DOMContentLoaded", function () {
  // Handle wishlist navigation with smooth scroll
  const wishlistLink = document.querySelector('a[href="/dashboard#wishlist"]');

  if (wishlistLink) {
    wishlistLink.addEventListener("click", function (e) {
      // If we're already on the dashboard page
      if (window.location.pathname === "/dashboard") {
        e.preventDefault();

        // Scroll to wishlist section
        const wishlistSection = document.getElementById("wishlistContainer");
        if (wishlistSection) {
          wishlistSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          // Add a subtle highlight effect
          const wishlistCard = wishlistSection.closest(".mb-5");
          if (wishlistCard) {
            wishlistCard.style.transition = "all 0.3s ease";
            wishlistCard.style.transform = "scale(1.02)";
            wishlistCard.style.boxShadow = "0 8px 25px rgba(252, 56, 92, 0.15)";

            setTimeout(() => {
              wishlistCard.style.transform = "scale(1)";
              wishlistCard.style.boxShadow = "";
            }, 1000);
          }
        }
      }
      // If not on dashboard, let the normal navigation happen
    });
  }

  // Enhanced dropdown hover effects
  const dropdown = document.querySelector(".dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdown && dropdownMenu) {
    dropdown.addEventListener("mouseenter", function () {
      this.querySelector('[data-bs-toggle="dropdown"]').classList.add("show");
      dropdownMenu.classList.add("show");
    });

    dropdown.addEventListener("mouseleave", function () {
      this.querySelector('[data-bs-toggle="dropdown"]').classList.remove(
        "show"
      );
      dropdownMenu.classList.remove("show");
    });
  }
});
