import knex from "knex";
import knexConfig from "../knexfile.cjs";

export const db = knex(knexConfig.development);

console.log("Connected to Postgres via Knex");
