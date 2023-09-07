import { create } from "apisauce";

import {
  ENCODED_WAKATIME_API_KEY,
  WAKATIME_API_URL,
} from "@app/constants/wakatime";
import type { Range, InsightType, SummariesParams } from "@app/types/wakatime";

const wakatime = create({
  baseURL: WAKATIME_API_URL,
  headers: {
    Authorization: `Basic ${ENCODED_WAKATIME_API_KEY}`,
  },
});

export const getAllTimeSinceToday = async () => {
  const { data } = await wakatime.get("/users/current/all_time_since_today");
  return data;
};

export const getCommit = async (project: string, hash: string) => {
  const { data } = await wakatime.get(
    `/users/current/projects/${project}/commits/${hash}`
  );
  return data;
};

export const getCommits = async (project: string) => {
  const { data } = await wakatime.get(
    `/users/current/projects/${project}/commits`
  );
  return data;
};

export const getDataDumps = async () => {
  const { data } = await wakatime.get("/users/current/data_dumps");
  return data;
};

export const getDurations = async () => {
  const { data } = await wakatime.get(`/users/current/durations`);
  return data;
};

export const getExternalDurations = async () => {
  const { data } = await wakatime.get(`/users/current/external_durations`);
  return data;
};

export const getGoal = async (goal: string) => {
  const { data } = await wakatime.get(`/users/current/goals/${goal}`);
  return data;
};

export const getGoals = async () => {
  const { data } = await wakatime.get("/users/current/goals");
  return data;
};

export const getHeartbeats = async () => {
  const { data } = await wakatime.get("/users/current/heartbeats");
  return data;
};

export const getInsights = async (type: InsightType, range: Range) => {
  const { data } = await wakatime.get(
    `/users/current/insights/${type}/${range}`
  );
  return data;
};

export const getMachineNames = async () => {
  const { data } = await wakatime.get("/users/current/machine_names");
  return data;
};

export const getProjects = async () => {
  const { data } = await wakatime.get("/users/current/projects");
  return data;
};

export const getStats = async (range?: Range) => {
  const { data } = await wakatime.get(
    "/users/current/stats" + (range ? `/${range}` : "")
  );
  return data;
};

export const getStatusBar = async () => {
  const { data } = await wakatime.get("/users/current/status_bar");
  return data;
};

export const getSummaries = async (params: SummariesParams) => {
  const { data } = await wakatime.get("/users/current/summaries", params);
  return data;
};

export const getUserAgent = async () => {
  const { data } = await wakatime.get("/users/current/user_agent");
  return data;
};

export const getMe = async () => {
  const { data } = await wakatime.get("/users/current");
  return data;
};
