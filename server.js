const express = require("express");
const app = express();
const knex = require("knex")(require("./knexfile.js"));
const router = express.Router();
const cors = require("cors");
const port = 8080;

const userRoutes = require("./routes/users");
const cookbookRoutes = require("./routes/cookbook");
const shoppingListRoutes = require("./routes/shoppingList");

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/api/user/", userRoutes);
app.use("/api/user/:id/recipes", cookbookRoutes);
app.use("/api/user/:id/shopping", shoppingListRoutes);

app.get("/", (req, res) => {
  console.log("Ready to geek out in the kitchen");
  res.status(200).json("Ready to geek out in the kitchen");
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
