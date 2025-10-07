require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const User = require("../models/user");

async function main() {
  try {
    await mongoose.connect(process.env.ATLASDB_URL);
    console.log("✅ Connected to MongoDB");

    // Example: Update by specific host emails or _id values
    const updates = [
      {
        email: "tejaswarupsurya@gmail.com", // change to actual email or use _id
        fullName: "Surya Tejaswarup",
        phone: "6281469117",
        aadhaar: "396499308315",
        avatar: {
          url: "https://res.cloudinary.com/dcvaeebuf/image/upload/v1759743353/host1.jpg",
          filename: "joya_DEV/host1",
        },
      },
      {
        email: "chethana@gmail.com",
        fullName: "Chethana Sree",
        phone: "9123456789",
        aadhaar: "888877776666",
        avatar: {
          url: "https://res.cloudinary.com/dcvaeebuf/image/upload/v1759743391/host2.jpg",
          filename: "joya_DEV/host2",
        },
      },
    ];

    for (const host of updates) {
      const user = await User.findOne({ email: host.email });
      if (!user) {
        console.log(`❌ No user found with email: ${host.email}`);
        continue;
      }

      user.role = "host";
      user.host = {
        isHost: true,
        status: "approved",
        fullName: host.fullName,
        phone: host.phone,
        aadhaar: host.aadhaar,
        avatar: host.avatar,
        isVerified: true,
        appliedAt: new Date(), 
        approvedAt: new Date(),
      };

      await user.save();
      console.log(`✅ Updated host: ${host.fullName}`);
    }

    console.log("🎉 All hosts updated successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating hosts:", err);
    process.exit(1);
  }
}

main();

