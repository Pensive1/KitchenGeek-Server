const express = require("express");
const router = require("express").Router();
const knex = require("knex")(require("../knexfile.js"));
const authCheck = require("../middleware/authCheck.js");
const userId = 1; // <-- Refactor "1" as user id

//TODO: Fetch user id from session. Not working at the moment

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
router.get("/", express, authCheck, (req, res) => {
  console.log("------ NEW REQUEST ------", req);

  knex("recipe_bookmarks")
    .where("user_id", req.session.passport.user.id) // <-- Refactor for OAuth
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
  // const userId = req.session.passport.user.id;
  console.log("---- API call from cookbook endpoint ----");
  console.log(req.session);
  console.log(req);

  bookmarkCheck(req.session.passport.user.id, recipeId)
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
router.post("/", express, authCheck, (req, res) => {
  const recipeId = req.body.recipe_id; // <-- Double check the request data in the client. Match this with it
  const recipeTitle = req.body.recipe_title;
  const recipeAuthor = req.body.recipe_author;
  const recipeImage = req.body.recipe_image;

  const bookmarkInfo = {
    user_id: req.session.user.id,
    recipe_id: recipeId,
    recipe_title: recipeTitle,
    recipe_author: recipeAuthor,
    recipe_image: recipeImage,
  };

  bookmarkCheck(req.session.user.id, recipeId)
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
router.delete("/:id", express, authCheck, (req, res) => {
  const recipeId = Number(req.params.id);

  bookmarkCheck(req.session.user.id, recipeId)
    .then((result) => {
      if (result) {
        knex("recipe_bookmarks")
          .where("user_id", req.session.user.id)
          .andWhere("recipe_id", recipeId)
          .del()
          .then((data) => {
            return res.status(200).json({
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
