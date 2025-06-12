function getAvgRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return total / reviews.length;
}

function getStarBreakdown(reviews) {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (!reviews) return breakdown;

  for (const review of reviews) {
    if (breakdown[review.rating] !== undefined) {
      breakdown[review.rating]++;
    }
  }
  return breakdown;
}

module.exports = {
  getAvgRating,
  getStarBreakdown,
};
