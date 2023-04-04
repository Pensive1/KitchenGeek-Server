// const express = require('express');
const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the user list." });
});
// GET ACCOUNT DETAILS

// DELETE ACCOUNT

module.exports = router;
