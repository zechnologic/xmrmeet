import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : undefined,
});

async function resetDatabase() {
  const client = await pool.connect();
  try {
    console.log("Dropping all tables...");

    // Drop all tables
    await client.query("DROP TABLE IF EXISTS reviews CASCADE");
    await client.query("DROP TABLE IF EXISTS users CASCADE");
    await client.query("DROP TABLE IF EXISTS schema_version CASCADE");

    console.log("✓ All database tables dropped successfully");
    console.log("✓ Database will be recreated on next server start");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
