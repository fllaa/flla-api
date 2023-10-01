import { createClient } from "redis";

import {
  REDIS_HOSTNAME,
  REDIS_PASSWORD,
  REDIS_PORT,
} from "@app/constants/redis";

export const redis = createClient({
  url: `rediss://${REDIS_HOSTNAME}:${REDIS_PORT}`,
  password: REDIS_PASSWORD,
}).on("error", (err) => {
  console.error(`Redis error: ${err}`);
});
