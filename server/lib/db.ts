import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com')
    ? { rejectUnauthorized: false }
    : undefined,
});

// Initialize database tables
async function initializeTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        country TEXT,
        state TEXT,
        city TEXT,
        postal_code TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        available_sell_xmr INTEGER DEFAULT 0,
        available_buy_xmr INTEGER DEFAULT 0,
        available_meetup INTEGER DEFAULT 0,
        on_break INTEGER DEFAULT 0,
        contact_info TEXT,
        is_admin INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
        updated_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
      );

      CREATE INDEX IF NOT EXISTS idx_users_location ON users(country, state, city);
      CREATE INDEX IF NOT EXISTS idx_users_available ON users(available_sell_xmr, available_buy_xmr);
      CREATE INDEX IF NOT EXISTS idx_users_postal ON users(country, postal_code);
      CREATE INDEX IF NOT EXISTS idx_users_coordinates ON users(latitude, longitude);

      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        reviewer_id TEXT NOT NULL,
        reviewee_username TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        approved INTEGER DEFAULT 0,
        created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT,
        FOREIGN KEY (reviewer_id) REFERENCES users(id)
      );

      CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_username);
      CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

      CREATE TABLE IF NOT EXISTS schema_version (
        version INTEGER PRIMARY KEY,
        applied_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::BIGINT
      );

      -- Add on_break column if it doesn't exist (for existing databases)
      ALTER TABLE users ADD COLUMN IF NOT EXISTS on_break INTEGER DEFAULT 0;

      -- Add available_meetup column if it doesn't exist (for existing databases)
      ALTER TABLE users ADD COLUMN IF NOT EXISTS available_meetup INTEGER DEFAULT 0;
    `);
    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Run initialization and export the promise so server can wait for it
export const dbReady = initializeTables();

// User operations
export interface User {
  id: string;
  username: string;
  password_hash: string;
  country: string | null;
  state: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  available_sell_xmr: number;
  available_buy_xmr: number;
  available_meetup: number;
  on_break: number;
  contact_info: string | null;
  is_admin: number;
  created_at: number;
  updated_at: number;
}

export interface PublicUser {
  id: string;
  username: string;
  country: string | null;
  state: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  available_sell_xmr: number;
  available_buy_xmr: number;
  available_meetup: number;
  on_break: number;
  contact_info: string | null;
  created_at: number;
}

export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_username: string;
  rating: number;
  comment: string;
  approved: number;
  created_at: number;
}

export interface ReviewWithReviewer extends Review {
  reviewer_username: string;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return result.rows[0];
}

export async function getUserById(id: string): Promise<User | undefined> {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function createUser(
  id: string,
  username: string,
  passwordHash: string
): Promise<User> {
  await pool.query(
    "INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)",
    [id, username, passwordHash]
  );
  return (await getUserById(id))!;
}

export async function updateUserSettings(
  userId: string,
  country: string | null,
  state: string | null,
  city: string | null,
  postalCode: string | null,
  latitude: number | null,
  longitude: number | null,
  availableSellXmr: boolean,
  availableBuyXmr: boolean,
  availableMeetup: boolean,
  onBreak: boolean,
  contactInfo: string | null
): Promise<User | undefined> {
  await pool.query(
    `UPDATE users
     SET country = $1, state = $2, city = $3, postal_code = $4, latitude = $5, longitude = $6,
         available_sell_xmr = $7, available_buy_xmr = $8, available_meetup = $9, on_break = $10, contact_info = $11,
         updated_at = EXTRACT(EPOCH FROM NOW())::BIGINT
     WHERE id = $12`,
    [country, state, city, postalCode, latitude, longitude, availableSellXmr ? 1 : 0, availableBuyXmr ? 1 : 0, availableMeetup ? 1 : 0, onBreak ? 1 : 0, contactInfo, userId]
  );
  return getUserById(userId);
}

export async function updateUserPassword(
  userId: string,
  passwordHash: string
): Promise<boolean> {
  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1, updated_at = EXTRACT(EPOCH FROM NOW())::BIGINT
     WHERE id = $2`,
    [passwordHash, userId]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function deleteUser(userId: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Anonymize reviews made by this user
    await client.query(
      `UPDATE reviews SET reviewer_id = 'deleted' WHERE reviewer_id = $1`,
      [userId]
    );

    // Delete the user
    const result = await client.query("DELETE FROM users WHERE id = $1", [userId]);

    await client.query("COMMIT");
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getAvailableUsers(
  country?: string,
  state?: string,
  city?: string
): Promise<PublicUser[]> {
  let query = `
    SELECT id, username, country, state, city, postal_code, latitude, longitude,
           available_sell_xmr, available_buy_xmr, available_meetup, on_break, contact_info, created_at
    FROM users
    WHERE (available_sell_xmr = 1 OR available_buy_xmr = 1 OR available_meetup = 1 OR (latitude IS NOT NULL AND longitude IS NOT NULL))
  `;
  const params: string[] = [];
  let paramCount = 1;

  if (country) {
    query += ` AND country = $${paramCount}`;
    params.push(country);
    paramCount++;
  }
  if (state) {
    query += ` AND state = $${paramCount}`;
    params.push(state);
    paramCount++;
  }
  if (city) {
    query += ` AND city ILIKE $${paramCount}`;
    params.push(`%${city}%`);
    paramCount++;
  }

  query += " ORDER BY updated_at DESC";
  const result = await pool.query(query, params);
  return result.rows;
}

// Review operations
export async function createReview(
  id: string,
  reviewerId: string,
  revieweeUsername: string,
  rating: number,
  comment: string
): Promise<Review> {
  await pool.query(
    "INSERT INTO reviews (id, reviewer_id, reviewee_username, rating, comment) VALUES ($1, $2, $3, $4, $5)",
    [id, reviewerId, revieweeUsername, rating, comment]
  );
  const result = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
  return result.rows[0];
}

export async function getApprovedReviewsForUser(username: string): Promise<ReviewWithReviewer[]> {
  const result = await pool.query(
    `SELECT r.*,
            CASE
              WHEN r.reviewer_id = 'deleted' THEN '[Deleted User]'
              ELSE COALESCE(u.username, '[Deleted User]')
            END as reviewer_username
     FROM reviews r
     LEFT JOIN users u ON r.reviewer_id = u.id
     WHERE r.reviewee_username = $1 AND r.approved = 1
     ORDER BY r.created_at DESC`,
    [username]
  );
  return result.rows;
}

export async function getAverageRating(username: string): Promise<number | null> {
  const result = await pool.query(
    `SELECT AVG(rating) as avg_rating
     FROM reviews
     WHERE reviewee_username = $1 AND approved = 1`,
    [username]
  );
  return result.rows[0].avg_rating;
}

export async function getPendingReviews(): Promise<ReviewWithReviewer[]> {
  const result = await pool.query(
    `SELECT r.*,
            CASE
              WHEN r.reviewer_id = 'deleted' THEN '[Deleted User]'
              ELSE COALESCE(u.username, '[Deleted User]')
            END as reviewer_username
     FROM reviews r
     LEFT JOIN users u ON r.reviewer_id = u.id
     WHERE r.approved = 0
     ORDER BY r.created_at ASC`
  );
  return result.rows;
}

export async function approveReview(reviewId: string): Promise<boolean> {
  const result = await pool.query("UPDATE reviews SET approved = 1 WHERE id = $1", [reviewId]);
  return result.rowCount !== null && result.rowCount > 0;
}

export async function deleteReview(reviewId: string): Promise<boolean> {
  const result = await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
  return result.rowCount !== null && result.rowCount > 0;
}

export async function hasUserReviewedUser(reviewerId: string, revieweeUsername: string): Promise<boolean> {
  const result = await pool.query(
    `SELECT COUNT(*) as count
     FROM reviews
     WHERE reviewer_id = $1 AND reviewee_username = $2`,
    [reviewerId, revieweeUsername]
  );
  return result.rows[0].count > 0;
}

export { pool };
export default pool;
