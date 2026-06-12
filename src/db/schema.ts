// Skema tabel Drizzle ORM untuk LogosLAB
// Tambahkan definisi tabel baru di bawah baris ini seiring perkembangan fitur

import { mysqlTable, serial, varchar, mysqlEnum, timestamp } from "drizzle-orm/mysql-core";

// Tabel users: menyimpan akun semua peran (KETUA_TIM, PEMBUAT_MATERI, PEMBUAT_GAME, PAKAR, SISWA)
export const users = mysqlTable("users", {
  id:           serial("id").primaryKey(),
  name:         varchar("name", { length: 255 }).notNull(),
  email:        varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role:         mysqlEnum("role", ["KETUA_TIM", "PEMBUAT_MATERI", "PEMBUAT_GAME", "PAKAR", "SISWA"]).notNull().default("SISWA"),
  createdAt:    timestamp("created_at").defaultNow().notNull(),
});

// Tipe TypeScript yang diinfer dari skema (reusable di seluruh codebase)
export type User    = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
