const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const knex = require("knex")(require("../knexfile.js"));

// router.get("/login", function (req, res, next) {
//   res.render("login");
// });

router.get("/", (req, res) => {
  res.send("Authentication happens here");
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // First let's check if we already have this user in our DB
      knex("users")
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

      // return cb(user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  //   done(null, user);

  // Query user information from the database for currently authenticated user
  knex("users")
    .where({ id: userId })
    .then((user) => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log("req.user:", user[0]);

      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch((err) => {
      console.log("Error finding user", err);
    });
});

module.exports = router;
