import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "server", "database.db");

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("✓ Database deleted successfully from server/database.db");
} else {
  console.log("ℹ No database file found at server/database.db");
}

console.log("✓ Database will be recreated on next server start");
