import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
//   database_URL do i need a specific thing here?
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;
