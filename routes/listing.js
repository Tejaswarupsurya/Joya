const express = require("express");
const router = express.Router();

//middlewares
const {
  isLoggedIn,
  isOwner,
  validateListing,
  fileFilter,
  checkRequiredFile,
  checkOptionalFile,
} = require("../middleware.js");

//cloudinary
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

//controllers
const listingController = require("../controllers/listing.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");

//Listing routes
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    checkRequiredFile,
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    checkOptionalFile,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
