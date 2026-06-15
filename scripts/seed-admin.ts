import { db } from "../src/db";
import { users } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  console.log("🌱 Menjalankan Seeder Ketua Tim (Admin)...");
  
  const adminEmail = "ketuatim@logoslab.com";
  
  // Cek apakah admin sudah ada
  const existing = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
  if (existing.length > 0) {
    console.log("✅ Akun Ketua Tim sudah ada. Melewati proses seeding.");
    process.exit(0);
  }

  // Buat akun admin default
  const passwordHash = await Bun.password.hash("admin12345");
  await db.insert(users).values({
    name: "Ketua Tim Default",
    email: adminEmail,
    password: passwordHash,
    role: "ketua_tim",
    status: "active"
  });

  console.log("✅ Berhasil membuat akun Ketua Tim:");
  console.log("   Email: " + adminEmail);
  console.log("   Password: admin12345");
  console.log("⚠️ PERHATIAN: Segera ganti password ini setelah login!");
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("❌ Seeder gagal:", err);
  process.exit(1);
});
