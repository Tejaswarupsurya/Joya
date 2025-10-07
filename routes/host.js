const express = require("express");
const router = express.Router();

//cloudinary
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

//middlewares
const {
  isLoggedIn,
  canApplyAsHost,
  storeRedirectUrl,
  validateHostApplication,
} = require("../middleware.js");

//controllers
const hostController = require("../controllers/host.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");

//routes

//apply - host application form
router
  .route("/apply")
  .get(
    isLoggedIn,
    canApplyAsHost,
    storeRedirectUrl,
    wrapAsync(hostController.renderApplyForm)
  )
  .post(
    isLoggedIn,
    canApplyAsHost,
    upload.single("avatar"),
    validateHostApplication,
    wrapAsync(hostController.submitApplication)
  );

module.exports = router;
