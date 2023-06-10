const express = require("express");
const app = express();
const expressSession = require("express-session");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8080;

const passport = require("passport");
const helmet = require("helmet");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const cookbookRoutes = require("./routes/cookbook");
const shoppingListRoutes = require("./routes/shoppingList");

app.use(express.json());
app.use("/auth/", authRoutes);
// app.use("/api/user/", userRoutes);
app.use("/api/user/:id/recipes", cookbookRoutes);
app.use("/api/shopping", shoppingListRoutes);
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  console.log("Ready to geek out in the kitchen");
  res.status(200).json("Ready to geek out in the kitchen");
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

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
