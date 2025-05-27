import apisauce from "apisauce";
import {
  DASHSCOPE_API_URL,
  DASHSCOPE_API_KEY,
  DASHSCOPE_APP_ID,
  DASHSCOPE_TOKEN_DAILY_LIMIT,
} from "./../constants/dashscope";
import { redis } from "@app/lib/redis";

interface CompletionResponse {
  output: CompletionOutput;
  usage: TokenUsage;
  request_id: string;
}

interface CompletionOutput {
  finish_reason: string;
  session_id: string;
  text: string;
}

interface TokenUsage {
  models: {
    output_tokens: number;
    model_id: string;
    input_tokens: number;
  }[];
}

class Dashscope {
  private readonly api;
  constructor() {
    this.api = apisauce.create({
      baseURL: DASHSCOPE_API_URL,
      headers: {
        Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  }

  async completion(prompt: string, sessionId?: string) {
    const data = {
      input: {
        prompt,
        session_id: sessionId,
      },
      parameters: {},
    };

    try {
      const response = await this.api.post<CompletionResponse>(
        `/v1/apps/${DASHSCOPE_APP_ID}/completion`,
        data,
        {}
      );
      return response.data;
    } catch (err) {
      console.error(err);
      throw new Error("INTERNAL_SERVER_ERROR");
    }
  }

  totalTokensUsed(usage: TokenUsage) {
    return usage.models.reduce(
      (acc, curr) => acc + curr.input_tokens + curr.output_tokens,
      0
    );
  }
}

export const postCompletion = async (
  prompt: string,
  sessionId?: string
): Promise<CompletionOutput | null> => {
  const canUse = await checkDailyLimit();
  if (!canUse) {
    throw new Error("DAILY_LIMIT_REACHED");
  }

  const dashscope = new Dashscope();
  const result = await dashscope.completion(prompt, sessionId);
  if (!result?.output.text) return null;

  await incrementTokenCount(dashscope.totalTokensUsed(result.usage));

  return result.output;
};

export const incrementTokenCount = async (count: number) => {
  const today = new Date().toISOString().split("T")[0];
  const key = `daily_limit:${today}`;
  const tokenCount = (await redis.get<number>(key)) ?? 0;
  await redis.set(key, tokenCount + count);
};

export const checkDailyLimit = async () => {
  // get date only
  const today = new Date().toISOString().split("T")[0];
  const key = `daily_limit:${today}`;
  const dailyLimit = await redis.get<number>(key);
  if (dailyLimit && dailyLimit > DASHSCOPE_TOKEN_DAILY_LIMIT) return false;
  return true;
};
