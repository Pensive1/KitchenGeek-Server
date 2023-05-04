// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "postgresql",
  connection: {
    database: "my_db",
    user: "username",
    password: "password",
  },
};
