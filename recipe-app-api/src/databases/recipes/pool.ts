import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  host: "localhost",
  port: Number(process.env.PORT),
  database: process.env.MY_COMPUTER ? "recipes" : "shmuelde_recipes",
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
});

export default pool;
