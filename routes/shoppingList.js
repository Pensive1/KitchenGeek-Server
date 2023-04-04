const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to your shopping list." });
});
// GET (USER) SHOPPING LIST

// CLEAR SHOPPING LIST

// ADD INGREDIENT

// EDIT INGREDIENT AMOUNT

// REMOVE INGREDIENT

module.exports = router;
