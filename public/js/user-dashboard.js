// User Dashboard JavaScript
function showAllPastBookings() {
  // Future enhancement: Load more past bookings via AJAX
  const btn = event.target;
  btn.innerHTML =
    '<i class="bi bi-hourglass-split me-2"></i>Loading more memories...';

  setTimeout(() => {
    alert("Feature coming soon: Load more travel memories! 🏖️");
    btn.innerHTML = '<i class="bi bi-chevron-down me-2"></i>Show More Memories';
  }, 1000);
}

// Booking expiration countdown functionality
function updateCountdowns() {
  const countdownElements = document.querySelectorAll(".countdown-timer");

  countdownElements.forEach((element) => {
    const expiryTime = new Date(element.dataset.expiry);
    const now = new Date();
    const timeLeft = expiryTime - now;

    if (timeLeft <= 0) {
      element.innerHTML = '<span class="text-danger">Expired</span>';
      // Find the parent booking element and update its status
      const bookingCard = element.closest(".card");
      if (bookingCard) {
        const statusBadge = bookingCard.querySelector(".badge");
        if (statusBadge) {
          statusBadge.className = "badge badge-expired";
          statusBadge.textContent = "Expired";
        }
      }
      return;
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 2) {
      element.innerHTML = `<span class="text-danger">${hours}h ${minutes}m left</span>`;
    } else if (hours < 6) {
      element.innerHTML = `<span class="text-warning">${hours}h ${minutes}m left</span>`;
    } else {
      element.innerHTML = `<span class="text-info">${hours}h ${minutes}m left</span>`;
    }
  });
}

// Update countdowns every minute
if (document.querySelector(".countdown-timer")) {
  updateCountdowns();
  setInterval(updateCountdowns, 60000);
}
