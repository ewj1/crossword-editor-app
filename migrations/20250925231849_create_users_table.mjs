export async function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("google_id").unique();
    table.string("name");
    table.string("email");
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists("users");
}
