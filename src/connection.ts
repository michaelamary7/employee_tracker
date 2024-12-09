import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a connection pool using the configuration from .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432, // Default PostgreSQL port
});

// Function to query the database
const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// Export the pool and query function
export { pool, query };