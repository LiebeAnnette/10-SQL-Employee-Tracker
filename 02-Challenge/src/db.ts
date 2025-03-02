import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;

