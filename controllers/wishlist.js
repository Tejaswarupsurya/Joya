const User = require("../models/user.js");
const Listing = require("../models/listing.js");

// Add listing to wishlist
module.exports.addToWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    // Check if already in wishlist
    const user = await User.findById(userId);
    if (user.wishlist.includes(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Already in wishlist" });
    }

    // Add to wishlist
    await User.findByIdAndUpdate(userId, {
      $push: { wishlist: id },
    });

    res.status(200).json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add to wishlist" });
  }
};

// Remove listing from wishlist
module.exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Remove from wishlist
    await User.findByIdAndUpdate(userId, {
      $pull: { wishlist: id },
    });

    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove from wishlist" });
  }
};

// Toggle wishlist (smart add/remove)
module.exports.toggleWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      return res
        .status(404)
        .json({ success: false, message: "Listing not found" });
    }

    const user = await User.findById(userId);
    const isInWishlist = user.wishlist.includes(id);

    if (isInWishlist) {
      // Remove from wishlist
      await User.findByIdAndUpdate(userId, {
        $pull: { wishlist: id },
      });
      res.status(200).json({
        success: true,
        action: "removed",
        message: "Removed from wishlist",
      });
    } else {
      // Add to wishlist
      await User.findByIdAndUpdate(userId, {
        $push: { wishlist: id },
      });
      res
        .status(200)
        .json({ success: true, action: "added", message: "Added to wishlist" });
    }
  } catch (error) {
    console.error("Error toggling wishlist:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to toggle wishlist" });
  }
};
