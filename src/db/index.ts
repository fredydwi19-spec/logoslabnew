import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import * as schema from "./schema";

// Muat variabel environment dari .env
dotenv.config();

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan di file .env. Pastikan Anda sudah mengisi kredensial database.");
}

// Buat connection pool agar koneksi ke MySQL efisien dan reusable
export const pool = mysql.createPool({
  uri: connectionString,
});

// Ekspor instance Drizzle ORM yang siap digunakan oleh semua route/handler
export const db = drizzle(pool, { schema, mode: "default" });
