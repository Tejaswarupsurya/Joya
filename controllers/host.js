//mongodb Section
const User = require("../models/user.js");

module.exports.renderApplyForm = async (req, res) => {
  res.render("hosts/apply.ejs");
};

module.exports.submitApplication = async (req, res) => {
  try {
    const { fullName, phone, aadhaar } = req.body;
    const userId = req.user._id;

    // Check if file was uploaded
    if (!req.file) {
      req.flash("error", "Please upload your profile photo.");
      return res.redirect("/apply");
    }

    // Find the user and update host information
    const user = await User.findById(userId);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/apply");
    }

    // Update host application data
    user.host = {
      fullName: fullName,
      phone: phone,
      aadhaar: aadhaar,
      avatar: {
        url: req.file.path,
        filename: req.file.filename,
      },
      status: "pending",
      appliedAt: new Date(),
    };

    // Update user role to 'host' so navbar shows correct status
    user.role = "host";

    await user.save();

    req.flash(
      "success",
      "Host application submitted successfully! We'll review your application within 2-3 business days and update your dashboard with the status."
    );
    res.redirect("/listings");
  } catch (error) {
    console.error("Host application error:", error);
    req.flash(
      "error",
      "Something went wrong while submitting your application. Please try again."
    );
    res.redirect("/apply");
  }
};
