export interface SummariesParams {
  start: Date;
  end: Date;
  project?: string;
  branches?: string[];
  timeout?: number;
  writes_only?: boolean;
  timezone?: string;
  range?: Range;
}

export type InsightType =
  | "weekday"
  | "days"
  | "best_day"
  | "dailu_average"
  | "projects"
  | "languages"
  | "editors"
  | "categories"
  | "machines"
  | "operating_systems";

export type Range =
  | "last_7_days"
  | "last_30_days"
  | "last_6_months"
  | "last_year"
  | "all_time"
  | string;
