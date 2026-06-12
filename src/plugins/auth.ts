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
  .derive(async ({ jwt, cookie }) => {
    return {
      getCurrentUser: async () => {
        const sessionValue = cookie?.session?.value;
        if (!sessionValue) return null;
        try {
          const payload = await jwt.verify(sessionValue as string);
          if (!payload) return null;
          return payload as { id: number; email: string; role: string };
        } catch (error) {
          return null;
        }
      },
    };
  });

export const requireAuth = new Elysia({ name: "require.auth" })
  .use(authPlugin)
  .onBeforeHandle(async (ctx: any) => {
    const user = await ctx.getCurrentUser();
    if (!user) {
      ctx.set.status = 401;
      return { success: false, message: "Unauthorized" };
    }
  });
