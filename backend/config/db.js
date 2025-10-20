import dotenv from "dotenv";
dotenv.config();

import knex from "knex";
import knexConfig from "../knexfile.cjs";

export const db = knex(knexConfig.development);

console.log("Connected to MySQL via Knex");
