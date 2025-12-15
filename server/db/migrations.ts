import db from "../db.js";

function createMigrationsTable(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);
}

function getCurrentVersion(): number {
  const row = db.prepare("SELECT MAX(version) as version FROM schema_version").get() as { version: number | null };
  return row.version || 0;
}

function applyMigration(version: number, sql: string): void {
  db.exec(sql);
  db.prepare("INSERT INTO schema_version (version) VALUES (?)").run(version);
}

const migrations = [
  {
    version: 1,
    name: "add_postal_code_and_coordinates",
    sql: `
      ALTER TABLE users ADD COLUMN postal_code TEXT;
      ALTER TABLE users ADD COLUMN latitude REAL;
      ALTER TABLE users ADD COLUMN longitude REAL;
      CREATE INDEX IF NOT EXISTS idx_users_postal ON users(country, postal_code);
      CREATE INDEX IF NOT EXISTS idx_users_coordinates ON users(latitude, longitude);
    `
  },
  {
    version: 2,
    name: "add_admin_field",
    sql: `
      ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0;
    `
  },
  {
    version: 3,
    name: "create_reviews_table",
    sql: `
      CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        reviewer_id TEXT NOT NULL,
        reviewee_username TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        approved INTEGER DEFAULT 0,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (reviewer_id) REFERENCES users(id)
      );
      CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_username);
      CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
    `
  }
];

export function runMigrations(): void {
  createMigrationsTable();
  const currentVersion = getCurrentVersion();

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`Applying migration ${migration.version}: ${migration.name}`);
      applyMigration(migration.version, migration.sql);
      console.log(`✓ Migration ${migration.version} applied`);
    }
  }
}
