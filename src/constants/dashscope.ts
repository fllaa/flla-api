export const DASHSCOPE_API_URL = Bun.env.DASHSCOPE_API_URL || 'https://dashscope-intl.aliyuncs.com/api/v1'
export const DASHSCOPE_API_KEY = Bun.env.DASHSCOPE_API_KEY || ''
export const DASHSCOPE_APP_ID = Bun.env.DASHSCOPE_APP_ID || ''
export const DASHSCOPE_TOKEN_DAILY_LIMIT = Number(Bun.env.DASHSCOPE_TOKEN_DAILY_LIMIT) || 100_000