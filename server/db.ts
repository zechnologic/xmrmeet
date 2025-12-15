import Database, { Database as DatabaseType } from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db: DatabaseType = new Database(path.join(__dirname, "../database.db"));

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
  contact_info: string | null;
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

export function getUserByUsername(username: string): User | undefined {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  return stmt.get(username) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) as User | undefined;
}

export function createUser(
  id: string,
  username: string,
  passwordHash: string
): User {
  const stmt = db.prepare(
    "INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)"
  );
  stmt.run(id, username, passwordHash);
  return getUserById(id)!;
}

export function updateUserSettings(
  userId: string,
  country: string | null,
  postalCode: string | null,
  latitude: number | null,
  longitude: number | null,
  availableSellXmr: boolean,
  availableBuyXmr: boolean,
  contactInfo: string | null
): User | undefined {
  const stmt = db.prepare(`
    UPDATE users
    SET country = ?, postal_code = ?, latitude = ?, longitude = ?, available_sell_xmr = ?, available_buy_xmr = ?, contact_info = ?, updated_at = strftime('%s', 'now')
    WHERE id = ?
  `);
  stmt.run(country, postalCode, latitude, longitude, availableSellXmr ? 1 : 0, availableBuyXmr ? 1 : 0, contactInfo, userId);
  return getUserById(userId);
}

export function getAvailableUsers(
  country?: string,
  state?: string,
  city?: string
): PublicUser[] {
  let query = `
    SELECT id, username, country, state, city, postal_code, latitude, longitude, available_sell_xmr, available_buy_xmr, contact_info, created_at
    FROM users
    WHERE (available_sell_xmr = 1 OR available_buy_xmr = 1)
  `;
  const params: string[] = [];

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
  return stmt.all(...params) as PublicUser[];
}

// Review operations
export function createReview(
  id: string,
  reviewerId: string,
  revieweeUsername: string,
  rating: number,
  comment: string
): Review {
  const stmt = db.prepare(
    "INSERT INTO reviews (id, reviewer_id, reviewee_username, rating, comment) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(id, reviewerId, revieweeUsername, rating, comment);
  return db.prepare("SELECT * FROM reviews WHERE id = ?").get(id) as Review;
}

export function getApprovedReviewsForUser(username: string): ReviewWithReviewer[] {
  const stmt = db.prepare(`
    SELECT r.*, u.username as reviewer_username
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.reviewee_username = ? AND r.approved = 1
    ORDER BY r.created_at DESC
  `);
  return stmt.all(username) as ReviewWithReviewer[];
}

export function getAverageRating(username: string): number | null {
  const stmt = db.prepare(`
    SELECT AVG(rating) as avg_rating
    FROM reviews
    WHERE reviewee_username = ? AND approved = 1
  `);
  const result = stmt.get(username) as { avg_rating: number | null };
  return result.avg_rating;
}

export function getPendingReviews(): ReviewWithReviewer[] {
  const stmt = db.prepare(`
    SELECT r.*, u.username as reviewer_username
    FROM reviews r
    JOIN users u ON r.reviewer_id = u.id
    WHERE r.approved = 0
    ORDER BY r.created_at ASC
  `);
  return stmt.all() as ReviewWithReviewer[];
}

export function approveReview(reviewId: string): boolean {
  const stmt = db.prepare("UPDATE reviews SET approved = 1 WHERE id = ?");
  const result = stmt.run(reviewId);
  return result.changes > 0;
}

export function deleteReview(reviewId: string): boolean {
  const stmt = db.prepare("DELETE FROM reviews WHERE id = ?");
  const result = stmt.run(reviewId);
  return result.changes > 0;
}

export function hasUserReviewedUser(reviewerId: string, revieweeUsername: string): boolean {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count
    FROM reviews
    WHERE reviewer_id = ? AND reviewee_username = ?
  `);
  const result = stmt.get(reviewerId, revieweeUsername) as { count: number };
  return result.count > 0;
}

export default db;
