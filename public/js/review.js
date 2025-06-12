document.querySelectorAll(".review-time").forEach((el) => {
  const createdAt = new Date(el.dataset.created);
  const now = new Date();
  const diffMs = now - createdAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let text = "";
  if (diffDays === 0) text = "Today";
  else if (diffDays === 1) text = "Yesterday";
  else if (diffDays <= 7) text = `${diffDays} days ago`;
  else {
    // Format as "June 2, 2025"
    text = createdAt.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  el.textContent = text;
  el.title = createdAt.toLocaleString();
});
