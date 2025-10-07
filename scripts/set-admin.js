require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");
const User = require("../models/user");

(async () => {
  await mongoose.connect(process.env.ATLASDB_URL);
  const exists = await User.findOne({ email: "admin@joya.local" });
  if (exists) {
    console.log("Admin exists");
    process.exit();
  }
  const admin = new User({
    username: "admin",
    email: "JoyaAdmin@gmail.com",
    role: "admin",
  });
  await User.register(admin, "Admin@2005");
  console.log("Admin user created");
  process.exit();
})();


    // <% if (allListings.length > 0) { %>
    //   <link 
    //     rel="preload" 
    //     as="image" 
    //     href="<%= allListings[0].image.url.replace('/upload/', '/upload/w_600,q_auto,f_auto/') %>" 
    //   />
    // <% } %>