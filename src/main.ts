import { Elysia, t } from "elysia";
import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { logger } from "@bogeychan/elysia-logger";

import { redis } from "@app/lib/redis";
import { getGithubLanguages, getGithubStats } from "@app/services/github";
import {
  getAllTimeSinceToday,
  getCommit,
  getCommits,
  getDataDumps,
  getDurations,
  getExternalDurations,
  getGoal,
  getGoals,
  getHeartbeats,
  getInsights,
  getMachineNames,
  getMe,
  getProjects,
  getStats,
  getStatusBar,
  getSummaries,
  getUserAgent,
} from "@app/services/wakatime";
import { InsightType } from "@app/types/wakatime";
import { postCompletion } from "@app/services/dashscope";

const PORT = Bun.env.PORT ?? 80;

const app = new Elysia()
  .use(swagger())
  .use(cors({
    origin: "*",
  }))
  .use(
    logger({
      autoLogging: true,
    })
  )
  .state("name", "flla-api")
  .state("version", 1)
  .state("author", "Fallah Andy Prakasa")
  .state("description", "It's just an API")
  .state("cached_paths", {} as Record<string, boolean>)
  .get("/", ({ store: { name, version, author, description } }) => ({
    name,
    version,
    author,
    description,
  }))
  .onBeforeHandle(async (ctx) => {
    const cached = await redis.get<Record<string, any>>(ctx.path);
    if (cached) {
      ctx.store.cached_paths = { ...ctx.store.cached_paths, [ctx.path]: true };
      return cached;
    }
  })
  .onAfterHandle(async (ctx) => {
    const whitelistPaths = [
      "/chats/completions",
    ]

    if (!ctx.store.cached_paths[ctx.path] && !whitelistPaths.includes(ctx.path)) {
      await redis.set(
        ctx.path,
        {
          ...(ctx.response as Object),
          cache: {
            is_cached: true,
            expires_at: new Date(Date.now() + 60 * 60 * 24 * 1000),
          },
        },
        {
          ex: 60 * 60 * 24,
        }
      );
    }
  })
  .group("chats", (app) =>
    app.post("/completions", async ({ body }) => postCompletion(body.prompt, body.sessionId), {
      body: t.Object({
        prompt: t.String(),
        sessionId: t.Optional(t.String()),
      }),
    })
  )
  .group("wakatime", (app) =>
    app
      .get("/", getMe)
      .get("/all-time", getAllTimeSinceToday)
      .get("/summaries", ({ query }) => getSummaries(query), {
        query: t.Object({
          start: t.Date(),
          end: t.Date(),
          project: t.Optional(t.String()),
          branches: t.Optional(t.Array(t.String())),
          timeout: t.Optional(t.Number()),
          writes_only: t.Optional(t.Boolean()),
          timezone: t.Optional(t.String()),
          range: t.Optional(t.String()),
        }),
      })
      .get("stats", ({ query }) => getStats(query?.range), {
        query: t.Object({
          range: t.Optional(t.String()),
        }),
      })
      .get("/projects", getProjects)
      .get(
        "/insights",
        ({ query }) => getInsights(query.type as InsightType, query.range),
        {
          query: t.Object({
            type: t.String(),
            range: t.String(),
          }),
        }
      )
      .get("/heartbeats", getHeartbeats)
      .get("/projects", getProjects)
      .get("/commits/:project", ({ params }) => getCommits(params.project))
      .get("/commits/:project/:hash", ({ params }) =>
        getCommit(params.project, params.hash)
      )
      .get("/durations", getDurations)
      .get("/external-durations", getExternalDurations)
      .get("/goals", getGoals)
      .get("/goals/:goal", ({ params }) => getGoal(params.goal))
      .get("/data-dumps", getDataDumps)
      .get("/machines", getMachineNames)
      .get("/status-bar", getStatusBar)
      .get("/user-agent", getUserAgent)
  )
  .group("github", (app) =>
    app
      .get("/stats", ({ query }) => getGithubStats(query?.username), {
        query: t.Object({
          username: t.Optional(t.String()),
        }),
      })
      .get("/languages", ({ query }) => getGithubLanguages(query?.username), {
        query: t.Object({
          username: t.Optional(t.String()),
        }),
      })
  )
  .listen(PORT);

console.log(
  `==============================================

🦊 Elysia is running at ${app.server?.url}

* ID: ${app.server?.id || "N/A"}
* Enviroment: ${app.server?.development ? "DEVELOPMENT" : "PRODUCTION"}
* Hostname: ${app.server?.hostname}
* Port: ${app.server?.port}
* Started at: ${new Date().toLocaleString()}

==============================================`
);
