import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { cookie } from "@elysiajs/cookie";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables");
}

export const authPlugin = new Elysia({ name: "plugin.auth" })
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .use(cookie())
  .derive(async ({ jwt, cookie: { session } }) => {
    return {
      getCurrentUser: async () => {
        if (!session.value) return null;
        try {
          const payload = await jwt.verify(session.value);
          if (!payload) return null;
          return payload as { id: number; email: string; role: string };
        } catch (error) {
          return null;
        }
      },
    };
  });

export const requireAuth = (app: Elysia) =>
  app.use(authPlugin).onBeforeHandle(async ({ getCurrentUser, set }) => {
    const user = await getCurrentUser();
    if (!user) {
      set.status = 401;
      return { success: false, message: "Unauthorized" };
    }
  });
