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
router.post("/", (req, res) => {
  const cookbook = JSON.parse(fs.readFileSync(bookmarkedRecipes));
  const recipeId = req.body.id;
  const recipeTitle = req.body.title;
  const recipeAuthor = req.body.sourceName;
  const recipeImage = req.body.image;

  const recipeInfo = {
    id: recipeId,
    title: recipeTitle,
    sourceName: recipeAuthor,
    image: recipeImage,
  };

  //CHECK IF THE RECIPE ALREADY EXISTS
  const recipeCheck = cookbook.find((recipe) => recipe.id === recipeId);
  console.log(recipeCheck);
  //if it does, return a response that it exists
  if (recipeCheck) {
    return res.status(409).json({
      error: true,
      message: `${recipeTitle} already exists in your cookbook`,
    });
  }
  cookbook.push(recipeInfo);

  fs.writeFile(bookmarkedRecipes, JSON.stringify(cookbook), (err) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: `Could not store ${recipeTitle}`,
      });
    }
    return res.status(201).json({
      error: false,
      message: `${recipeTitle} saved successfully`,
    });
  });
});

// REMOVE BOOKMARKED RECIPE

module.exports = router;
