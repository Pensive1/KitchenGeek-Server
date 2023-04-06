const router = require("express").Router();
const fs = require("fs");
const bookmarkedRecipes = "./storage/user/cookbook.json";
const cookbook = JSON.parse(fs.readFileSync(bookmarkedRecipes));

// GET (USER) BOOKMARKED RECIPES
router.get("/", (req, res) => {
  fs.readFile(bookmarkedRecipes, null, (err, data) => {
    if (err) {
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

// CHECK IF BOOKMARK EXISTS
router.get("/:id", (req, res) => {
  const recipeId = Number(req.params.id);
  const targetRecipe = cookbook.find((recipe) => recipe.id === recipeId);

  if (targetRecipe) {
    return res.status(200).json({ error: false, message: "Recipe exists" });
  }
  if (!targetRecipe) {
    return res
      .status(200) //usually would be 404 but the error isn't cause for concern. The client will know it's missing via the "error:true" property.
      .json({ error: true, message: "Recipe doesn't exist" });
  }
});

// BOOKMARK RECIPE
router.post("/", (req, res) => {
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
router.delete("/:id", (req, res) => {
  const recipeId = Number(req.params.id);
  const targetRecipe = cookbook.find((recipe) => recipe.id === recipeId);
  console.log(targetRecipe);
  const recipeTitle = targetRecipe ? targetRecipe.title : null;

  if (targetRecipe === -1) {
    return res.status(404).json({ message: "This recipe doesn't exist" });
  }

  cookbook.pop(targetRecipe);
  fs.writeFile(bookmarkedRecipes, JSON.stringify(cookbook), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: true, message: "Could not update records" });
    }

    return res.status(200).json({
      error: false,
      message: "Recipe removed",
      title: recipeTitle,
    });
  });
});
module.exports = router;
