import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const DB_HOST = process.env.DB_HOST ?? "localhost";
const DB_PORT = (process.env.DB_PORT as number | undefined) ?? 5444;
const DB_USER = process.env.DB_USER ?? "postgres"
const DB_PASSWORD = process.env.DB_PASSWORD ?? "postgres"
const DB_NAME = process.env.DB_NAME ?? "marketplace"

export const pool = new Pool({
  connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum number of clients in the pool
  idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000'), // Close idle clients after 30 seconds
  connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT || '2000'), // Return an error after 2 seconds if connection cannot be established
});

pool.on('connect', () => {
  console.log('New client connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool);

export const getClient = async () => {
  const client = await pool.connect();
  const release = client.release;

  client.release = () => {
    console.log('Client released back to pool');
    return release.apply(client);
  };

  return client;
};

export const closePool = async () => {
  await pool.end();
  console.log('Database pool has been closed');
};