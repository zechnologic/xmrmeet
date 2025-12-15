import { Pool } from "pg";
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
    `);
        console.log("Database tables initialized successfully");
    }
    catch (error) {
        console.error("Error initializing database tables:", error);
        throw error;
    }
    finally {
        client.release();
    }
}
// Run initialization
initializeTables().catch(console.error);
export async function getUserByUsername(username) {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
}
export async function getUserById(id) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
}
export async function createUser(id, username, passwordHash) {
    await pool.query("INSERT INTO users (id, username, password_hash) VALUES ($1, $2, $3)", [id, username, passwordHash]);
    return (await getUserById(id));
}
export async function updateUserSettings(userId, country, postalCode, latitude, longitude, availableSellXmr, availableBuyXmr, contactInfo) {
    await pool.query(`UPDATE users
     SET country = $1, postal_code = $2, latitude = $3, longitude = $4,
         available_sell_xmr = $5, available_buy_xmr = $6, contact_info = $7,
         updated_at = EXTRACT(EPOCH FROM NOW())::BIGINT
     WHERE id = $8`, [country, postalCode, latitude, longitude, availableSellXmr ? 1 : 0, availableBuyXmr ? 1 : 0, contactInfo, userId]);
    return getUserById(userId);
}
export async function updateUserPassword(userId, passwordHash) {
    const result = await pool.query(`UPDATE users
     SET password_hash = $1, updated_at = EXTRACT(EPOCH FROM NOW())::BIGINT
     WHERE id = $2`, [passwordHash, userId]);
    return result.rowCount !== null && result.rowCount > 0;
}
export async function deleteUser(userId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        // Anonymize reviews made by this user
        await client.query(`UPDATE reviews SET reviewer_id = 'deleted' WHERE reviewer_id = $1`, [userId]);
        // Delete the user
        const result = await client.query("DELETE FROM users WHERE id = $1", [userId]);
        await client.query("COMMIT");
        return result.rowCount !== null && result.rowCount > 0;
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
export async function getAvailableUsers(country, state, city) {
    let query = `
    SELECT id, username, country, state, city, postal_code, latitude, longitude,
           available_sell_xmr, available_buy_xmr, contact_info, created_at
    FROM users
    WHERE (available_sell_xmr = 1 OR available_buy_xmr = 1 OR (latitude IS NOT NULL AND longitude IS NOT NULL))
  `;
    const params = [];
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
        query += ` AND city = $${paramCount}`;
        params.push(city);
        paramCount++;
    }
    query += " ORDER BY updated_at DESC";
    const result = await pool.query(query, params);
    return result.rows;
}
// Review operations
export async function createReview(id, reviewerId, revieweeUsername, rating, comment) {
    await pool.query("INSERT INTO reviews (id, reviewer_id, reviewee_username, rating, comment) VALUES ($1, $2, $3, $4, $5)", [id, reviewerId, revieweeUsername, rating, comment]);
    const result = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    return result.rows[0];
}
export async function getApprovedReviewsForUser(username) {
    const result = await pool.query(`SELECT r.*,
            CASE
              WHEN r.reviewer_id = 'deleted' THEN '[Deleted User]'
              ELSE COALESCE(u.username, '[Deleted User]')
            END as reviewer_username
     FROM reviews r
     LEFT JOIN users u ON r.reviewer_id = u.id
     WHERE r.reviewee_username = $1 AND r.approved = 1
     ORDER BY r.created_at DESC`, [username]);
    return result.rows;
}
export async function getAverageRating(username) {
    const result = await pool.query(`SELECT AVG(rating) as avg_rating
     FROM reviews
     WHERE reviewee_username = $1 AND approved = 1`, [username]);
    return result.rows[0].avg_rating;
}
export async function getPendingReviews() {
    const result = await pool.query(`SELECT r.*,
            CASE
              WHEN r.reviewer_id = 'deleted' THEN '[Deleted User]'
              ELSE COALESCE(u.username, '[Deleted User]')
            END as reviewer_username
     FROM reviews r
     LEFT JOIN users u ON r.reviewer_id = u.id
     WHERE r.approved = 0
     ORDER BY r.created_at ASC`);
    return result.rows;
}
export async function approveReview(reviewId) {
    const result = await pool.query("UPDATE reviews SET approved = 1 WHERE id = $1", [reviewId]);
    return result.rowCount !== null && result.rowCount > 0;
}
export async function deleteReview(reviewId) {
    const result = await pool.query("DELETE FROM reviews WHERE id = $1", [reviewId]);
    return result.rowCount !== null && result.rowCount > 0;
}
export async function hasUserReviewedUser(reviewerId, revieweeUsername) {
    const result = await pool.query(`SELECT COUNT(*) as count
     FROM reviews
     WHERE reviewer_id = $1 AND reviewee_username = $2`, [reviewerId, revieweeUsername]);
    return result.rows[0].count > 0;
}
export { pool };
export default pool;
//# sourceMappingURL=db.js.map