import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

export const db = new Pool({
    host: 'localhost',
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

console.log('Conectado ao PostgreSQL!');

