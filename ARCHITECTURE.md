# 🏛️ LogosLAB Architecture & System Design

## 1. Tech Stack Overview
- **Runtime:** Bun
- **Backend Framework:** ElysiaJS
- **ORM:** Drizzle ORM
- **Database:** MySQL
- **Frontend/UI:** Tailwind CSS & Bootstrap Icons (Inline SVG / Local Class)

## 2. Directory Structure
```text
logoslabnew/
├── src/
│   ├── db/
│   │   ├── index.ts      # Entry point koneksi database (Drizzle + mysql2 pool)
│   │   ├── db.ts         # (Legacy) Koneksi awal — akan digantikan oleh index.ts
│   │   └── schema.ts     # Definisi skema tabel Drizzle ORM
│   └── index.ts          # Entry point server ElysiaJS (port 3000)
├── drizzle/              # Output hasil drizzle-kit generate (SQL migration files)
├── drizzle.config.ts     # Konfigurasi Drizzle Kit (schema, dialek, credentials)
├── .env                  # Variabel lingkungan (DB credentials, DATABASE_URL)
├── .gitignore            # Mengecualikan .env, node_modules, dist
├── package.json          # Scripts: dev, db:generate, db:push, db:studio
└── ARCHITECTURE.md       # Dokumen arsitektur ini
```

## 3. Database Configuration
- **ORM:** Drizzle ORM (`drizzle-orm/mysql2`)
- **Koneksi:** `src/db/index.ts` — menggunakan `mysql.createPool({ uri: DATABASE_URL })`
- **Skema:** `src/db/schema.ts` — tabel didefinisikan menggunakan sintaks Drizzle
- **Migrasi:** `drizzle.config.ts` — output ke folder `./drizzle/`, dialek `mysql`

### Environment Variables
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=...
DB_NAME=logoslab_dev
DB_PORT=3306
DATABASE_URL="mysql://root:password@localhost:3306/logoslab_dev"
```

### Skrip Database (package.json)
| Script | Keterangan |
|---|---|
| `bun run db:generate` | Generate file SQL migration dari schema |
| `bun run db:push` | Push skema langsung ke database |
| `bun run db:studio` | Buka Drizzle Studio (GUI database browser) |

## 4. Tabel Database
| Tabel | File Schema | Keterangan |
|---|---|---|
| `users` | `src/db/schema.ts` | Tabel awal contoh — akan diperluas oleh fitur RBAC |

## 5. API Routes (ElysiaJS)
| Method | Path | Keterangan |
|---|---|---|
| GET | `/` | Hello World — health check server |

*(Akan diperbarui seiring penambahan fitur)*