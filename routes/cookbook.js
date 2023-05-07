const router = require("express").Router();
const fs = require("fs");
// const { default: knex } = require("knex");
const knex = require("knex")(require("../knexfile.js"));
const bookmarkedRecipes = "./storage/user/cookbook.json";
const cookbook = JSON.parse(fs.readFileSync(bookmarkedRecipes));

const bookmarkCheck = (userId, recipeId) => {
  return knex
    .select("*")
    .from("recipe_bookmarks")
    .where("user_id", userId)
    .andWhere("recipe_id", recipeId)
    .then((data) => {
      if (data.length > 0) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      throw err;
    });
};

// GET (USER) BOOKMARKED RECIPES
router.get("/", (req, res) => {
  knex
    .select("*")
    .from("recipe_bookmarks")
    .where("user_id", 1) // <-- Refactor for OAuth
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send("Error getting bookmarks");
    });
});

// CHECK IF BOOKMARK EXISTS
router.get("/:id", (req, res) => {
  const recipeId = Number(req.params.id);

  bookmarkCheck(1, recipeId) // <-- Refactor "1" as user id
    .then((result) => {
      if (result) {
        return res
          .status(200)
          .json({ error: false, message: "Recipe is bookmarked" });
      } else {
        return res
          .status(200)
          .json({ error: true, message: "Recipe isn't bookmarked" });
      }
    })
    .catch((err) => {
      res.status(500).send("Error getting bookmarks");
    });
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
    timestamp: Date.now(),
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
  const targetRecipe = cookbook.findIndex((recipe) => recipe.id === recipeId);
  console.log(targetRecipe);
  const recipeTitle = targetRecipe ? cookbook[targetRecipe].title : null;

  if (targetRecipe === -1) {
    return res.status(404).json({ message: "This recipe doesn't exist" });
  }

  cookbook.pop(cookbook[targetRecipe]);
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
