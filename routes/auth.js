const express = require("express");
const router = express.Router();
const passport = require("passport");
const authCheck = require("../middleware/authCheck.js");
require("dotenv").config();

router.get("/", (req, res) => {
  res.send("Authentication happens here");
});

//Google Authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
  }),
  (_req, res) => {
    res.redirect(process.env.CLIENT_URL);
  }
);

// User profile endpoint that requires authentication
router.get("/profile", authCheck, (req, res) => {
  // Passport stores authenticated user information on `req.user` object.
  // Comes from done function of `deserializeUser`

  // If `req.user` isn't found send back a 401 Unauthorized response
  if (req.user === undefined)
    return res.status(401).json({ message: "Unauthorized" });

  // If user is currently authenticated, send back user info
  res.status(200).json(req.user);
});

// Logout - From code-along
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      // return next(err);
      return res.status(500).json({
        message: "Server error, please try again later",
        error: err,
      });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

// Temp endpoint to test auth.
// Updated client env to http://localhost:8080/auth/success-callback
// router.get("/success-callback", (req, res) => {
//   if (req.user) {
//     res.status(200).json(req.user);
//   } else {
//     res.status(401).json({ message: "User is not logged in" });
//   }
// });

module.exports = router;
