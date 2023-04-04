const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to your cookbook." });
});
// GET (USER) BOOKMARKED RECIPES

// BOOKMARK RECIPE

// REMOVE BOOKMARKED RECIPE

module.exports = router;
