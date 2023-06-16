const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");

const helmet = require("helmet");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const knex = require("knex")(require("./knexfile.js"));
const authCheck = require("./middleware/authCheck.js");

//Additional routes
const cookbookRoutes = require("./routes/cookbook");
const shoppingListRoutes = require("./routes/shoppingList");

// Middleware
const app = express();
const crypto = require("crypto");
const port = process.env.PORT || 8080;
require("dotenv").config();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    },
    rolling: true, // Reset session expiry on every request
    genid: () => {
      // Generate a unique session ID
      return crypto.randomBytes(32).toString("hex");
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));

// =========== Passport Config ============
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.authenticate("session"));

// Google OAuth 2.0 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      // First let's check if we already have this user in our DB
      await knex("users")
        .select("id")
        .where({ google_id: profile.id })
        .then((user) => {
          if (user.length) {
            // If user is found, pass the user object to serialize function
            done(null, user[0]);
          } else {
            // If user isn't found, we create a record
            knex("users")
              .insert({
                firstname: profile.name.givenName,
                surname: profile.name.familyName,
                email: profile._json.email,
                google_id: String(profile.id),
                avatar_url: profile._json.picture,
              })
              .then((userId) => {
                // Pass the user object to serialize function
                done(null, { id: userId[0] });
              })
              .catch((err) => {
                console.log("Error creating a user", err);
              });
          }
        })
        .catch((err) => {
          console.log("Error fetching a user", err);
        });
    }
  )
);

// Facebook OAuth 2.0 Strategy

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  //   done(null, user);

  // Query user information from the database for currently authenticated user
  knex("users")
    .where({ id: user.id })
    .then((user) => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      //   console.log("req.user:", user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch((err) => {
      console.log("Error finding user", err);
    });
});

// Routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);
// app.use("/api/user/", userRoutes);
app.use("/api/user/:id/recipes", cookbookRoutes);
app.use("/api/shopping", shoppingListRoutes);

app.get("/", authCheck, (req, res) => {
  res
    .status(200)
    .json(`Welcome ${req.user.firstname}, Ready to geek out in the kitchen`);
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
