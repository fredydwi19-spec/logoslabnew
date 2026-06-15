import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { authPlugin } from "../plugins/auth";

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(authPlugin)
  
  // Endpoint: Register
  .post("/register", async ({ body, set }) => {
    const { name, email, password, role } = body;

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      set.status = 409;
      return { success: false, message: "Email sudah terdaftar" };
    }

    // Hash password
    const passwordHash = await Bun.password.hash(password);

    // Insert user
    await db.insert(users).values({
      name,
      email,
      password: passwordHash,
      role,
    });

    set.status = 201;
    return { success: true, message: "Registrasi berhasil" };
  }, {
    body: t.Object({
      name: t.String({ minLength: 3 }),
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
      role: t.Union([
        t.Literal("ketua_tim"),
        t.Literal("pembuat_materi"),
        t.Literal("pembuat_game"),
        t.Literal("pakar"),
        t.Literal("siswa"),
      ]),
    })
  })

  // Endpoint: Login
  .post("/login", async ({ body, jwt, set, cookie }) => {
    const { email, password } = body;

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      set.status = 401;
      return { success: false, message: "Email atau password salah" };
    }

    // Verify password
    const isPasswordValid = await Bun.password.verify(password, user.password);
    if (!isPasswordValid) {
      set.status = 401;
      return { success: false, message: "Email atau password salah" };
    }

    // Generate JWT
    const token = await jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set cookie (TypeScript expects cookie object to potentially miss 'session', so we use non-null assertion or optional chaining)
    if (cookie.session) {
      cookie.session.set({
        value: token,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 86400, // 7 days
      });
    }

    return { success: true, role: user.role };
  }, {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: 8 }),
    })
  })

  // Endpoint: Logout
  .post("/logout", ({ cookie, set }) => {
    if (cookie.session) {
      cookie.session.remove();
    }
    set.status = 302;
    set.headers['Location'] = '/';
    return new Response(null, {
      status: 302,
      headers: { Location: '/' },
    });
  });
