const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8080;

const passport = require("passport");
const helmet = require("helmet");
const authRoutes = require("./routes/auth");

const cookbookRoutes = require("./routes/cookbook");
const shoppingListRoutes = require("./routes/shoppingList");

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.authenticate("session"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth/", authRoutes);
// app.use("/api/user/", userRoutes);
app.use("/api/user/:id/recipes", cookbookRoutes);
app.use("/api/shopping", shoppingListRoutes);

// Logged in middleware
const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

app.get("/", isLoggedIn, (req, res) => {
  res
    .status(200)
    .json(`Welcome ${req.user.firstname}, Ready to geek out in the kitchen`);
});

//Google Authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/auth/failure",
  })
);

app.get("/auth/failure", (req, res) => {
  res.send("Something went wrong. Failed to log in");
});

//Logout - From code-along
// app.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       // return next(err);
//       return res.status(500).json({
//         message: "Server error, please try again later",
//         error: err,
//       });
//     }
//     // res.redirect("/");
//   });

//   req.session.destroy(() => {
//     res.redirect("/");
//   });
//   res.send("You've seccessfully logged out");
//   // res.redirect(process.env.CLIENT_URL);
// });

//Logout - From express site
app.get("/logout", function (req, res, next) {
  // logout logic

  // clear the user from the session object and save.
  // this will ensure that re-using the old session id
  // does not have a logged in user
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);

    // regenerate the session, which is good practice to help
    // guard against forms of session fixation
    req.session.regenerate(function (err) {
      if (err) next(err);
      res.redirect("/");
    });
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
