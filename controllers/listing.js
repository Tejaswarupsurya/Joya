//cloudinary
const cloudinary = require("cloudinary").v2;

//mapbox Section
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//utils section
const {
  categoryList,
  categoryIcons,
  facilitiesList,
  facilityIcons,
} = require("../utils/constants.js");
const { getAvgRating, getStarBreakdown } = require("../utils/review.js");

//mongodb Section
const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { q, category } = req.query;
  const filter = {};
  if (q) {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("^" + escaped, "i");
    filter.$or = [{ title: regex }, { location: regex }, { country: regex }];
  }
  if (category) {
    filter.category = category;
  }
  const allListings = await Listing.find(filter).populate("reviews");
  allListings.forEach((listing) => {
    listing.avgRating = getAvgRating(listing.reviews);
  });
  
  res.render("./listings/index.ejs", {
    allListings,
    categoryList,
    categoryIcons,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs", { facilitiesList });
};

module.exports.showListings = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "The Listing you requested for Does'nt Exist!");
    return res.redirect("/listings");
  }
  const avgRating = getAvgRating(listing.reviews);
  const starBreakdown = getStarBreakdown(listing.reviews);

  res.render("./listings/show.ejs", {
    listing,
    categoryIcons,
    facilityIcons,
    avgRating,
    starBreakdown,
  });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Hotel Added!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The Listing you requested for Does'nt Exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250,f_auto,q_auto"
  );
  res.render("./listings/edit.ejs", {
    listing,
    originalImageUrl,
    categoryList,
    facilitiesList,
  });
};

module.exports.updateListing = async (req, res) => {
  const id = req.params.id;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  listing.geometry = response.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const id = req.params.id;
  const listing = await Listing.findById(id);
  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Deleted Successfully!");
  res.redirect("/listings");
};
