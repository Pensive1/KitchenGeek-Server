/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("recipe_bookmarks", function (table) {
    table.increments("id").primary();
    table.integer("user_id").unsigned(); // Make .notNullable() after
    table.integer("recipe_id").unsigned();
    table.string("recipe_title").notNullable();
    table.string("recipe_author").notNullable();
    table.text("recipe_image");
    table.timestamp("saved_at").defaultTo(knex.fn.now());

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("recipe_bookmarks");
};
