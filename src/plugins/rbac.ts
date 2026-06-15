import { Elysia } from "elysia";
import { authPlugin } from "./auth";

export const rbacPlugin = new Elysia({ name: "plugin.rbac" })
  .use(authPlugin)
  .derive(async (ctx: any) => {
    const user = await ctx.getCurrentUser();
    return {
      userRole: user?.role || null,
      user
    };
  });

export const requireRole = (allowedRoles: string[]) => new Elysia()
  .use(rbacPlugin)
  .onBeforeHandle((ctx: any) => {
    if (!ctx.user) {
      ctx.set.status = 401;
      return new Response("Unauthorized", { status: 401 });
    }
    if (!allowedRoles.includes(ctx.user.role)) {
      ctx.set.status = 403;
      return new Response("Akses ditolak: Peran tidak diizinkan.", { status: 403 });
    }
  });
