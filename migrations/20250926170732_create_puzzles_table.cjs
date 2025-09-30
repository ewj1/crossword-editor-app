exports.up = function (knex) {
  return knex.schema.createTable("puzzles", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("title");
    table.json("data");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("puzzles");
};
