const router = require("express").Router();
const knex = require("knex")(require("../knexfile.js"));
const userId = 1; // <-- Refactor "1" as user id

const bookmarkCheck = (user_id, recipeId) => {
  return knex("recipe_bookmarks")
    .select("*")
    .from("recipe_bookmarks")
    .where("user_id", user_id)
    .andWhere("recipe_id", recipeId)
    .then((data) => {
      return data.length > 0;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

// GET (USER) BOOKMARKED RECIPES
router.get("/", (req, res) => {
  knex("recipe_bookmarks")
    .where("user_id", userId) // <-- Refactor for OAuth
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

  bookmarkCheck(userId, recipeId)
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
  const recipeId = req.body.recipe_id; // <-- Double check the request data in the client. Match this with it
  const recipeTitle = req.body.recipe_title;
  const recipeAuthor = req.body.recipe_author;
  const recipeImage = req.body.recipe_image;

  const bookmarkInfo = {
    user_id: userId,
    recipe_id: recipeId,
    recipe_title: recipeTitle,
    recipe_author: recipeAuthor,
    recipe_image: recipeImage,
  };

  bookmarkCheck(userId, recipeId)
    .then((result) => {
      if (result) {
        return res.status(409).json({
          error: true,
          message: `${recipeTitle} already exists in your cookbook`,
        });
      } else {
        return knex("recipe_bookmarks")
          .insert(bookmarkInfo)
          .then((data) => {
            return res.status(201).json({
              error: false,
              message: `${recipeTitle} saved successfully`,
            });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: `Error storing ${recipeTitle}: ${err.message}`,
      });
    });
});

// REMOVE BOOKMARKED RECIPE
router.delete("/:id", (req, res) => {
  const recipeId = Number(req.params.id);
  // const targetRecipe = cookbook.findIndex((recipe) => recipe.id === recipeId);
  // console.log(targetRecipe);
  // const recipeTitle = targetRecipe ? cookbook[targetRecipe].title : null;

  // if (targetRecipe === -1) {
  //   return res.status(404).json({ message: "This recipe doesn't exist" });
  // }

  // cookbook.pop(cookbook[targetRecipe]);
  // fs.writeFile(bookmarkedRecipes, JSON.stringify(cookbook), (err) => {
  //   if (err) {
  //     return res
  //       .status(500)
  //       .json({ error: true, message: "Could not update records" });
  //   }

  //   return res.status(200).json({
  //     error: false,
  //     message: "Recipe removed",
  //     title: recipeTitle,
  //   });
  // });

  bookmarkCheck(userId, recipeId)
    .then((result) => {
      if (result) {
        knex("recipe_bookmarks")
          .where("user_id", userId)
          .andWhere("recipe_id", recipeId)
          .del()
          .then((data) => {
            return res.status(204).json({
              error: false,
              message: "Recipe removed",
            });
          });
      } else {
        return res.status(404).json({ message: "This recipe doesn't exist" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: `Could not update records: ${err.message}`,
      });
    });
});
module.exports = router;
