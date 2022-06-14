import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const configDatabase = {
    connectionString: process.env.DATABASE_URL
};

if (process.env.MODE === "PROD") {
    configDatabase.ssl = {
        rejectUnauthorized: false
    }
}

const db = new Pool(configDatabase);
export default db;