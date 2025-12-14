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
  available_sell_xmr: number;
  available_buy_xmr: number;
  contact_info: string | null;
  created_at: number;
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
  state: string | null,
  city: string | null,
  availableSellXmr: boolean,
  availableBuyXmr: boolean,
  contactInfo: string | null
): User | undefined {
  const stmt = db.prepare(`
    UPDATE users
    SET country = ?, state = ?, city = ?, available_sell_xmr = ?, available_buy_xmr = ?, contact_info = ?, updated_at = strftime('%s', 'now')
    WHERE id = ?
  `);
  stmt.run(country, state, city, availableSellXmr ? 1 : 0, availableBuyXmr ? 1 : 0, contactInfo, userId);
  return getUserById(userId);
}

export function getAvailableUsers(
  country?: string,
  state?: string,
  city?: string
): PublicUser[] {
  let query = `
    SELECT id, username, country, state, city, available_sell_xmr, available_buy_xmr, contact_info, created_at
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

export default db;
