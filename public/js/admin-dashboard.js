// Admin Dashboard JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const applicationRows = document.querySelectorAll(".application-row");
  const applicationsTable = document.getElementById("applicationsTable");
  const emptyState = document.getElementById("emptyState");
  const emptyStateTitle = document.getElementById("emptyStateTitle");
  const emptyStateMessage = document.getElementById("emptyStateMessage");

  // Count applications by status
  function countApplications() {
    const counts = {
      all: applicationRows.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    applicationRows.forEach((row) => {
      const status = row.dataset.status;
      if (counts[status] !== undefined) {
        counts[status]++;
      }
    });

    // Update badges
    document.getElementById("all-count").textContent = counts.all;
    document.getElementById("pending-count").textContent = counts.pending;
    document.getElementById("approved-count").textContent = counts.approved;
    document.getElementById("rejected-count").textContent = counts.rejected;

    return counts;
  }

  // Filter applications
  function filterApplications(status) {
    let visibleCount = 0;

    applicationRows.forEach((row) => {
      if (status === "all" || row.dataset.status === status) {
        row.style.display = "";
        visibleCount++;
      } else {
        row.style.display = "none";
      }
    });

    // Show/hide empty state
    if (visibleCount === 0) {
      applicationsTable.style.display = "none";
      emptyState.style.display = "block";

      // Update empty state message based on filter
      switch (status) {
        case "pending":
          emptyStateTitle.textContent = "No Pending Applications";
          emptyStateMessage.textContent =
            "All host applications have been reviewed.";
          break;
        case "approved":
          emptyStateTitle.textContent = "No Approved Hosts";
          emptyStateMessage.textContent =
            "No host applications have been approved yet.";
          break;
        case "rejected":
          emptyStateTitle.textContent = "No Rejected Applications";
          emptyStateMessage.textContent =
            "No host applications have been rejected.";
          break;
        default:
          emptyStateTitle.textContent = "No Applications Found";
          emptyStateMessage.textContent =
            "No applications match the current filter.";
      }
    } else {
      applicationsTable.style.display = "block";
      emptyState.style.display = "none";
    }

    // Update total count badge
    document.getElementById("totalCount").textContent = `${visibleCount} ${
      status === "all"
        ? "Total"
        : status.charAt(0).toUpperCase() + status.slice(1)
    }`;
  }

  // Add click event listeners to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Filter applications
      const filter = this.dataset.filter;
      filterApplications(filter);
    });
  });

  // Initialize counts on page load
  countApplications();
});
