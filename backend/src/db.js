import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: "vishwajeet",
  host: "localhost",
  database: "where_at_today",
  password: "Vishwajeet@18",
  port: 5432,
});

export default pool;