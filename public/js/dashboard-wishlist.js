// Horizontal scroll function for wishlist
function scrollWishlist(direction) {
  const container = document
    .getElementById("wishlistContainer")
    .querySelector(".wishlist-scroll");
  const scrollAmount = 300;

  if (direction === "right") {
    container.scrollLeft += scrollAmount;
  } else {
    container.scrollLeft -= scrollAmount;
  }
}

// Wishlist toggle function for dashboard
function toggleWishlist(listingId, button) {
  fetch(`/wishlist/toggle/${listingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Remove the card with animation
        const card = button.closest(".wishlist-card");
        card.style.transition = "all 0.3s ease";
        card.style.opacity = "0";
        card.style.transform = "scale(0.9)";

        setTimeout(() => {
          card.remove();

          // Check if wishlist is now empty and hide the section
          const container = document.getElementById("wishlistContainer");
          const remainingCards = container.querySelectorAll(".wishlist-card");
          if (remainingCards.length === 0) {
            container.closest(".mb-5").style.display = "none";
          }
        }, 300);
      } else {
        alert(data.message || "Failed to update wishlist");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to update wishlist");
    });
}
