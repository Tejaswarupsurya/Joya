// Wishlist toggle function
function toggleWishlist(listingId, button) {
  // Add click animation
  button.classList.add("clicked");
  setTimeout(() => {
    button.classList.remove("clicked");
  }, 400);

  fetch(`/wishlist/toggle/${listingId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Toggle the active class with animation
        button.classList.toggle("active");

        // Add a subtle bounce effect when adding to wishlist
        if (button.classList.contains("active")) {
          button.style.animation = "heartBeat 0.6s ease-in-out";
          setTimeout(() => {
            button.style.animation = "";
          }, 600);
        }

        // Update the title
        if (button.classList.contains("active")) {
          button.title = "Remove from Wishlist";
        } else {
          button.title = "Add to Wishlist";
        }
      } else {
        alert(data.message || "Failed to update wishlist");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to update wishlist");
    });
}
