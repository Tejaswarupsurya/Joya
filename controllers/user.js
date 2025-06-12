//mongodb Section
const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    let { username, email, password, confirm } = req.body;
    if (password !== confirm) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/signup");
    }
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      req.flash("error", "Email already exists. Please log in!");
      return res.redirect("/login");
    }
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    redirectUrl = req.session.redirectUrl || "/listings";
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Joya!");
      res.redirect(redirectUrl);
    });
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to Joya!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.renderUpdateForm = (req, res) => {
  res.render("./users/update.ejs");
};

module.exports.update = async (req, res) => {
  const { currentPassword, password, confirm } = req.body;
  const user = await User.findById(req.user._id);
    const isMatch = await user.authenticate(currentPassword);
    if (!isMatch.user) {
      req.flash("error", "Current password is incorrect!");
      return res.redirect("/update-password");
    }
    if (password !== confirm) {
      req.flash("error", "Passwords do not match!");
      return res.redirect("/update-password");
    }
    await user.setPassword(password);
    await user.save();
    req.flash("success", "Password updated successfully!");
    res.redirect("/listings");
};

module.exports.renderForgotForm = (req, res) => {
  res.render("./users/forgot.ejs");
};

module.exports.getCode = async (req, res) => {
  const { username, email } = req.body;
  const user = await User.findOne({ username, email });

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found." });
  }

  const now = Date.now();
  if (
    user.resetCodeExpires &&
    user.resetCodeExpires > now &&
    now - (user.resetCodeExpires - 10 * 60 * 1000) < 60 * 1000
  ) {
    return res
      .status(429)
      .json({
        success: false,
        error: "Please wait 1 minute before requesting again.",
      });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetCodeExpires = now + 10 * 60 * 1000;
  await user.save();

  return res.json({
    success: true,
    code,
    expiresIn: 600,
  });
};
  
module.exports.forgot = async (req, res) => {
  const { username, email, password, confirm, code } = req.body;
  const user = await User.findOne({ username, email });

  if (!user) {
    req.flash("error", "User not found!");
    return res.redirect("/forgot");
  }

  if (!user.resetCode || !user.resetCodeExpires || user.resetCode !== code) {
    req.flash("error", "Invalid or expired OTP!");
    return res.redirect("/forgot");
  }

  if (Date.now() > user.resetCodeExpires) {
    req.flash("error", "OTP expired. Please request a new one!");
    return res.redirect("/forgot");
  }

  if (password !== confirm) {
    req.flash("error", "Passwords do not match!");
    return res.redirect("/forgot");
  }

  await user.setPassword(password);
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save();

  req.flash("success", "Password has been reset. Please log in!");
  req.session.redirectUrl = null;
  res.redirect("/login");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Bye...See you again!");
    res.redirect("/listings");
  });
};
