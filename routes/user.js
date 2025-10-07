const express = require("express");
const router = express.Router();

//passport Section
const passport = require("passport");

//middlewares
const {
  isLoggedIn,
  requireRole,
  saveRedirectUrl,
  storeRedirectUrl,
  validateReset,
  validateSignup,
  validateUpdatePassword,
} = require("../middleware.js");

//controllers
const userController = require("../controllers/user.js");

//utils Section
const wrapAsync = require("../utils/wrapAsync.js");

//routes

//signup
router
  .route("/signup")
  .get(storeRedirectUrl, userController.renderSignupForm)
  .post(validateSignup, wrapAsync(userController.signup));

//login
router
  .route("/login")
  .get(storeRedirectUrl, userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//Dashboard - Smart routing based on user role
router.get("/dashboard", isLoggedIn, wrapAsync(userController.renderDashboard));

//changepassword
router
  .route("/update-password")
  .get(isLoggedIn, userController.renderUpdateForm)
  .post(isLoggedIn, validateUpdatePassword, wrapAsync(userController.update));

//forgot
router
  .route("/forgot")
  .get(userController.renderForgotForm)
  .post(validateReset, wrapAsync(userController.forgot));

//get-code
router.post("/get-code", wrapAsync(userController.getCode));

//change email
router
  .route("/change-email")
  .get(isLoggedIn, userController.renderChangeEmailForm)
  .post(isLoggedIn, wrapAsync(userController.changeEmail));

//logout
router.get("/logout", userController.logout);

module.exports = router;
