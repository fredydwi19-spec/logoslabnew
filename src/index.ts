import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { renderLanding } from "./views/landing";
import { renderLogin } from "./views/login";
import { renderRegister } from "./views/register";

const app = new Elysia()
  // Daftar route API Backend
  .use(authRoutes)
  
  // Daftar route UI Frontend (Mengembalikan HTML)
  .get("/", () => new Response(renderLanding(), { headers: { "Content-Type": "text/html" } }))
  .get("/login", () => new Response(renderLogin(), { headers: { "Content-Type": "text/html" } }))
  .get("/register", () => new Response(renderRegister(), { headers: { "Content-Type": "text/html" } }))
  
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
