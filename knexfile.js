// Update with your config settings.
const path = require("path");
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "rootroot",
    database: "kitchen_geek",
    charset: "utf8",
  },
  migrations: {
    directory: path.join(__dirname, "./db/migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "./db/seeds"),
  },
};
