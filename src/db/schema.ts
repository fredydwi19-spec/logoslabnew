// Skema tabel Drizzle ORM untuk LogosLAB
// Tambahkan definisi tabel baru di bawah baris ini seiring perkembangan fitur

import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

// Tabel contoh: users (akan diperluas oleh fitur Autentikasi & RBAC)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});
