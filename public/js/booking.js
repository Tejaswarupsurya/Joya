class BookingManager {
  constructor(bookedDates = []) {
    this.bookedDates = bookedDates;
    this.disabledDates = this.bookedDates.map((r) => ({
      from: r.from,
      to: r.to,
    }));
    this.flatpickrInstance = null;
    this.maxStayNights = 14;
    this.init();
  }

  init() {
    this.initializeFlatpickr();
    this.setupFormValidation();
  }

  initializeFlatpickr() {
    this.flatpickrInstance = flatpickr("#dateRange", {
      mode: "range",
      minDate: new Date().fp_incr(1), // Allow from tomorrow onwards
      maxDate: new Date().fp_incr(180), // 6 months ahead
      dateFormat: "Y-m-d",
      disable: this.disabledDates,
      onDayCreate: (dObj, dStr, fp, dayElem) => {
        this.onDayCreate(dayElem);
      },
      onClose: (selectedDates) => {
        this.onDateSelection(selectedDates);
      },
      locale: {
        rangeSeparator: " to ",
      },
    });
  }

  onDayCreate(dayElem) {
    const date = dayElem.dateObj.toISOString().split("T")[0];
    const isDisabled = this.disabledDates.some(
      (r) => date >= r.from && date <= r.to
    );

    if (!isDisabled) {
      dayElem.classList.add("available");
      dayElem.setAttribute("data-tooltip", "Available");
    } else {
      dayElem.classList.add("disabled");
      dayElem.setAttribute("data-tooltip", "Unavailable");
    }
  }

  onDateSelection(selectedDates) {
    if (selectedDates.length === 2) {
      const diffDays = Math.ceil(
        (selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24)
      );

      if (diffDays > this.maxStayNights) {
        this.showError(
          `You can't book for more than ${this.maxStayNights} nights!`
        );
        this.flatpickrInstance.clear();
        return;
      }

      if (diffDays < 1) {
        this.showError("Check-out date must be after check-in date!");
        this.flatpickrInstance.clear();
        return;
      }

      // Set hidden form fields (timezone-safe)
      const checkInDate = new Date(selectedDates[0]);
      const checkOutDate = new Date(selectedDates[1]);

      // Format dates as YYYY-MM-DD without timezone issues
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      document.getElementById("checkIn").value = formatDate(checkInDate);
      document.getElementById("checkOut").value = formatDate(checkOutDate);

      // Show success message
      this.showSuccess(`Selected ${diffDays} night${diffDays > 1 ? "s" : ""}`);
    }
  }

  setupFormValidation() {
    const form = document.querySelector(".needs-validation");
    if (form) {
      form.addEventListener("submit", (event) => {
        if (!form.checkValidity() || !this.validateBookingDates()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      });
    }

    // Guest count validation
    const guestsInput = document.getElementById("guests");
    if (guestsInput) {
      guestsInput.addEventListener("input", this.validateGuestCount.bind(this));
    }
  }

  validateBookingDates() {
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;

    if (!checkIn || !checkOut) {
      this.showError("Please select both check-in and check-out dates.");
      return false;
    }

    return true;
  }

  validateGuestCount() {
    const guestsInput = document.getElementById("guests");
    const guests = parseInt(guestsInput.value);

    if (guests < 1 || guests > 6) {
      guestsInput.setCustomValidity("Number of guests must be between 1 and 6");
    } else {
      guestsInput.setCustomValidity("");
    }
  }

  showError(message) {
    // You can replace this with your preferred notification system
    alert(message);
  }

  showSuccess(message) {
    // You can replace this with your preferred notification system
    console.log("Success:", message);
  }

  // Public method to update booked dates if needed
  updateBookedDates(newBookedDates) {
    this.bookedDates = newBookedDates;
    this.disabledDates = this.bookedDates.map((r) => ({
      from: r.from,
      to: r.to,
    }));

    if (this.flatpickrInstance) {
      this.flatpickrInstance.set("disable", this.disabledDates);
    }
  }

  // Clean up method
  destroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on a booking page
  if (document.getElementById("dateRange")) {
    // bookedRanges should be available from the EJS template
    if (typeof bookedRanges !== "undefined") {
      window.bookingManager = new BookingManager(bookedRanges);
    } else {
      console.warn("bookedRanges not found, initializing with empty array");
      window.bookingManager = new BookingManager([]);
    }
  }
});
