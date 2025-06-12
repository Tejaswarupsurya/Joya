const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
    const { page } = req.params;
    const pages = {
      "help-center": "Help Center",
      "faq": "FAQs",
      "terms": "Terms and Conditions",
      "privacy": "Privacy Policy",
      "sitemap": "Sitemap",
      "company-info": "Company Info"
    };
  
    if (!pages[page]) {
      req.flash("error", "Page not found.");
      return res.redirect("/listings");
    }
  
    res.render("./static.ejs", { title: pages[page] });
  });

  module.exports = router;