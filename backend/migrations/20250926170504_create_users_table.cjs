exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("google_id").unique();
    table.string("name");
    table.string("email");
    table.string("google_avatar");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
