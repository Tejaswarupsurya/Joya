if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//Express Section
const express = require("express");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const compression = require("compression");
const helmet = require("helmet");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(compression());

//utils
const ExpressError = require("./utils/ExpressError.js");
const { scheduleCleanup } = require("./utils/bookingCleanup.js");

//passport Section
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//Getting Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const infoRouter = require("./routes/info.js");
const bookingRouter = require("./routes/booking");
const hostRouter = require("./routes/host");
const adminRouter = require("./routes/admin");
const wishlistRouter = require("./routes/wishlist");
const searchRouter = require("./routes/search");

// mongoAtlas & mongodb Section
const isTestEnv = process.env.NODE_ENV === "test";
const dbUrl =
  process.env.ATLASDB_URL ||
  process.env.MONGODB_URL ||
  (process.env.NODE_ENV === "production"
    ? null
    : "mongodb://127.0.0.1:27017/joya");
const mongoose = require("mongoose");

async function main() {
  if (!dbUrl) {
    throw new Error("Missing database URL. Set ATLASDB_URL (or MONGODB_URL).");
  }
  await mongoose.connect(dbUrl);
}

if (!isTestEnv) {
  main()
    .then(() => {
      console.log("Database connected successfully");
      // Start the booking expiration cleanup scheduler
      scheduleCleanup();
    })
    .catch((err) => {
      console.log("Database connection failed", err);
    });
}

//Mongo-Connect,Express-Session & Flash
const sessionOptions = {
  secret: process.env.SECRET || "dev-secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Use connect-mongo only when we have a DB URL and we're not in tests.
if (!isTestEnv && dbUrl) {
  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET || "dev-secret",
    },
    touchAfter: 24 * 3600,
  });

  store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
  });

  sessionOptions.store = store;
}
app.use(session(sessionOptions));
app.use(flash());

//Using Passport(Authentication & Authorization)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware for using flash
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.path = req.path;
  res.locals.currUser = req.user;
  next();
});

//Routes Section
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/listings/:id/bookings", bookingRouter);
app.use("/wishlist", wishlistRouter);
app.use("/info/:page", infoRouter);
app.use("/", searchRouter);
app.use("/", adminRouter);
app.use("/", hostRouter);
app.use("/", userRouter);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Export app for testing
module.exports = app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/__email_test__", async (req, res) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: "EC2 Email Test ✅",
      html: "<h2>Email works from EC2 🎉</h2>",
    });

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

