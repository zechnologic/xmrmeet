import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = new Database(path.join(__dirname, "../database.db"));
// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    country TEXT,
    state TEXT,
    city TEXT,
    available_sell_xmr INTEGER DEFAULT 0,
    available_buy_xmr INTEGER DEFAULT 0,
    contact_info TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_users_location ON users(country, state, city);
  CREATE INDEX IF NOT EXISTS idx_users_available ON users(available_sell_xmr, available_buy_xmr);
`);
export function getUserByUsername(username) {
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    return stmt.get(username);
}
export function getUserById(id) {
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    return stmt.get(id);
}
export function createUser(id, username, passwordHash) {
    const stmt = db.prepare("INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)");
    stmt.run(id, username, passwordHash);
    return getUserById(id);
}
export function updateUserSettings(userId, country, postalCode, latitude, longitude, availableSellXmr, availableBuyXmr, contactInfo) {
    const stmt = db.prepare(`
    UPDATE users
    SET country = ?, postal_code = ?, latitude = ?, longitude = ?, available_sell_xmr = ?, available_buy_xmr = ?, contact_info = ?, updated_at = strftime('%s', 'now')
    WHERE id = ?
  `);
    stmt.run(country, postalCode, latitude, longitude, availableSellXmr ? 1 : 0, availableBuyXmr ? 1 : 0, contactInfo, userId);
    return getUserById(userId);
}
export function getAvailableUsers(country, state, city) {
    let query = `
    SELECT id, username, country, state, city, postal_code, latitude, longitude, available_sell_xmr, available_buy_xmr, contact_info, created_at
    FROM users
    WHERE (available_sell_xmr = 1 OR available_buy_xmr = 1)
  `;
    const params = [];
    if (country) {
        query += " AND country = ?";
        params.push(country);
    }
    if (state) {
        query += " AND state = ?";
        params.push(state);
    }
    if (city) {
        query += " AND city = ?";
        params.push(city);
    }
    const stmt = db.prepare(query + " ORDER BY updated_at DESC");
    return stmt.all(...params);
}
// Review operations
export function createReview(id, reviewerId, revieweeUsername, rating, comment) {
    const stmt = db.prepare("INSERT INTO reviews (id, reviewer_id, reviewee_username, rating, comment) VALUES (?, ?, ?, ?, ?)");
    stmt.run(id, reviewerId, revieweeUsername, rating, comment);
    return db.prepare("SELECT * FROM reviews WHERE id = ?").get(id);
}
export function getApprovedReviewsForUser(username) {
    const stmt = db.prepare(`
    SELECT r.*, u.username as reviewer_username
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewee_username = ? AND r.approved = 1
    ORDER BY r.created_at DESC
  `);
    return stmt.all(username);
}
export function getAverageRating(username) {
    const stmt = db.prepare(`
    SELECT AVG(rating) as avg_rating
    FROM reviews
    WHERE reviewee_username = ? AND approved = 1
  `);
    const result = stmt.get(username);
    return result.avg_rating;
}
export function getPendingReviews() {
    const stmt = db.prepare(`
    SELECT r.*, u.username as reviewer_username
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.approved = 0
    ORDER BY r.created_at ASC
  `);
    return stmt.all();
}
export function approveReview(reviewId) {
    const stmt = db.prepare("UPDATE reviews SET approved = 1 WHERE id = ?");
    const result = stmt.run(reviewId);
    return result.changes > 0;
}
export function deleteReview(reviewId) {
    const stmt = db.prepare("DELETE FROM reviews WHERE id = ?");
    const result = stmt.run(reviewId);
    return result.changes > 0;
}
export function hasUserReviewedUser(reviewerId, revieweeUsername) {
    const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM reviews
    WHERE reviewer_id = ? AND reviewee_username = ?
  `);
    const result = stmt.get(reviewerId, revieweeUsername);
    return result.count > 0;
}
export default db;
//# sourceMappingURL=db.js.map