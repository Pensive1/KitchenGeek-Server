const router = require("express").Router();
const fs = require("fs");
const bookmarkedRecipes = "./storage/user/cookbook.json";

// router.get("/", (req, res) => {
//   res.status(200).json({ message: "Welcome to your cookbook." });
// });

// GET (USER) BOOKMARKED RECIPES
router.get("/", (req, res) => {
  fs.readFile(bookmarkedRecipes, null, (err, data) => {
    if (err) {
      //if file doesn't exist
      //   if (err.code === "ENOENT") {
      //     //Create file
      //     fs.writeFile(bookmarkedRecipes, JSON.stringify([{}]), (err) => {
      //       return res
      //         .status(200)
      //         .json({ error: false, message: "Cookbook empty" });
      //     });
      //   }
      return res.status(500).json({
        error: true,
        message: "Could not read recipes from JSON file",
      });
    }

    const recipes = JSON.parse(data);
    res.status(200).json(
      recipes.map((recipe) => {
        return {
          id: recipe.id,
          title: recipe.title,
          sourceName: recipe.sourceName,
          image: recipe.image,
        };
      })
    );
  });
});

// BOOKMARK RECIPE

// REMOVE BOOKMARKED RECIPE

module.exports = router;
