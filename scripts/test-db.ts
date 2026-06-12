// Script one-time untuk mengetes koneksi database
import * as dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ DATABASE_URL tidak ditemukan di .env");
  process.exit(1);
}

console.log("🔌 Mencoba koneksi ke:", url.replace(/:([^:@]+)@/, ":****@"));

const pool = mysql.createPool({ uri: url });

try {
  const conn = await pool.getConnection();
  const [rows] = await conn.query("SELECT 1 + 1 AS result");
  console.log("✅ Koneksi database BERHASIL!", rows);
  conn.release();
  await pool.end();
} catch (err: any) {
  console.error("❌ Koneksi database GAGAL:", err.message);
  process.exit(1);
}
