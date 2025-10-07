const Booking = require("../models/booking.js");

/**
 * Cleanup expired bookings
 * This function should be called periodically to clean up expired pending bookings
 */
const cleanupExpiredBookings = async () => {
  try {
    const result = await Booking.expireOldBookings();
    if (result > 0) {
      console.log(`✅ Expired ${result} old pending bookings`);
    }
    return result;
  } catch (error) {
    console.error("❌ Error cleaning up expired bookings:", error);
    throw error;
  }
};

/**
 * Get booking expiration statistics
 */
const getExpirationStats = async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const stats = await Booking.aggregate([
      {
        $match: {
          status: "pending",
          expiresAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          expiringSoon: {
            $sum: {
              $cond: [{ $lt: ["$expiresAt", oneHourFromNow] }, 1, 0],
            },
          },
          expiringInThreeHours: {
            $sum: {
              $cond: [{ $lt: ["$expiresAt", threeHoursFromNow] }, 1, 0],
            },
          },
        },
      },
    ]);

    return stats[0] || { total: 0, expiringSoon: 0, expiringInThreeHours: 0 };
  } catch (error) {
    console.error("❌ Error getting expiration stats:", error);
    throw error;
  }
};

/**
 * Schedule periodic cleanup (call this in your main app.js)
 */
const scheduleCleanup = () => {
  // Run cleanup every 30 minutes
  setInterval(async () => {
    try {
      await cleanupExpiredBookings();
    } catch (error) {
      console.error("❌ Scheduled cleanup failed:", error);
    }
  }, 30 * 60 * 1000); // 30 minutes

  console.log("🕒 Booking cleanup scheduler started (runs every 30 minutes)");
};

module.exports = {
  cleanupExpiredBookings,
  getExpirationStats,
  scheduleCleanup,
};
