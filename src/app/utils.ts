import * as pg from 'pg';

// create a new connection to the database
export const pool = new pg.Pool({
    host: "postgres",
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT)
  });

