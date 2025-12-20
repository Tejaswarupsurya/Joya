// Payment form handler for Stripe checkout
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const listingId = form.dataset.listingId;
  const listingPrice = parseFloat(form.dataset.listingPrice);

  // Handle form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const guests = document.getElementById("guests").value;
    const btn = document.getElementById("proceedToPayment");

    if (!checkIn || !checkOut || !guests) {
      alert("Please fill in all fields");
      return;
    }

    // Show loading state
    btn.disabled = true;
    btn.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Creating checkout session...';

    try {
      const response = await fetch("/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: listingId,
          checkIn: checkIn,
          checkOut: checkOut,
          guests: parseInt(guests),
        }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        btn.disabled = false;
        btn.innerHTML =
          '<i class="bi bi-credit-card me-1"></i>Proceed to Payment';
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create checkout session. Please try again.");
      btn.disabled = false;
      btn.innerHTML =
        '<i class="bi bi-credit-card me-1"></i>Proceed to Payment';
    }
  });

  // Update price summary when dates change
  const dateRangeInput = document.getElementById("dateRange");
  if (dateRangeInput) {
    dateRangeInput.addEventListener("change", function () {
      const checkIn = new Date(document.getElementById("checkIn").value);
      const checkOut = new Date(document.getElementById("checkOut").value);

      if (checkIn && checkOut) {
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const total = listingPrice * nights;

        document.getElementById("nightsCount").textContent = nights;
        document.getElementById("totalPrice").textContent =
          total.toLocaleString("en-IN");
        document.getElementById("priceSummary").style.display = "block";
      }
    });
  }
});
