import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";

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

const app = new Elysia()
  .use(swagger())
  .state("name", "flla-api")
  .state("version", 1)
  .state("author", "Fallah Andy Prakasa")
  .state("description", "It's just an API")
  .get("/", ({ store: { name, version, author, description } }) => ({
    name,
    version,
    author,
    description,
  }))
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
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
