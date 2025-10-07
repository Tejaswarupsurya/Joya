const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", (req, res) => {
  const { page } = req.params;
  const pages = {
    "help-center": "Help Center",
    faq: "Frequently Asked Questions",
    terms: "Terms and Conditions",
    privacy: "Privacy Policy",
    sitemap: "Sitemap",
    "company-info": "About Joya",
    contact: "Contact Us",
    careers: "Careers",
    "host-guide": "Become a Host",
    safety: "Safety & Security",
    accessibility: "Accessibility",
    community: "Community Guidelines",
  };

  if (!pages[page]) {
    req.flash("error", "Page not found.");
    return res.redirect("/listings");
  }

  res.render(`./info/${page}.ejs`, {
    title: pages[page],
    currentPage: page,
  });
});

module.exports = router;
