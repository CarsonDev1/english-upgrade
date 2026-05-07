import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, "..", "supabase", "schema.sql");
const sql = readFileSync(schemaPath, "utf8");

const PROJECT_REF = "qrmodtvwaspnicvmqvnz";
const PASSWORD = "Buitritinh@123";

// Try pooler regions in order, then fall back to direct connection
const targets = [
  // Session-mode pooler (5432) — supports DDL across statements
  `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
  `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
  `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-us-east-2.pooler.supabase.com:5432/postgres`,
  `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`,
  `postgres://postgres.${PROJECT_REF}:${encodeURIComponent(PASSWORD)}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
  // Direct connection (may be IPv6-only on some networks)
  `postgres://postgres:${encodeURIComponent(PASSWORD)}@db.${PROJECT_REF}.supabase.co:5432/postgres`,
];

async function tryConnect(url) {
  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  return client;
}

let client = null;
let lastErr = null;
for (const url of targets) {
  const masked = url.replace(/:[^:@/]+@/, ":****@");
  try {
    process.stdout.write(`Trying ${masked} ... `);
    client = await tryConnect(url);
    console.log("OK");
    break;
  } catch (e) {
    console.log("FAIL", e.code || e.message);
    lastErr = e;
  }
}

if (!client) {
  console.error("\n❌ Could not connect to any target.");
  console.error("Last error:", lastErr);
  process.exit(1);
}

try {
  console.log("\nRunning migration...");
  await client.query(sql);
  console.log("✅ Migration applied.");

  // Verify tables
  const { rows } = await client.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' order by table_name;
  `);
  console.log("\nTables in public schema:");
  for (const r of rows) console.log("  -", r.table_name);
} catch (e) {
  console.error("❌ Migration failed:", e.message);
  process.exit(1);
} finally {
  await client.end();
}
