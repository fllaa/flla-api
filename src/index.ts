import { Elysia } from "elysia";

const app = new Elysia()
  .state("name", "flla-api")
  .state("version", 1)
  .state("author", "Fallah Andy Prakasa")
  .state("description", "It's just an API")
  .get("/", () => ({ msg: "Hello, Elysia!" }))
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
