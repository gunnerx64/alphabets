// 👇 constant value in all uppercase
export const FREE_QUOTA = {
  maxEventsPerMonth: 100,
  maxEventCategories: 3,
} as const;

export const PRO_QUOTA = {
  maxEventsPerMonth: 1000,
  maxEventCategories: 10,
} as const;

export const AUTH_CUSTOM_CODENAME =
  process.env.NEXT_PUBLIC_AUTH_CUSTOM_CODENAME;
export const AUTH_CUSTOM_TITLE = process.env.NEXT_PUBLIC_AUTH_CUSTOM_TITLE;
export const AUTH_CUSTOM_URL = process.env.AUTH_CUSTOM_URL;
export const AUTH_CUSTOM_ID = process.env.AUTH_CUSTOM_ID;
export const AUTH_CUSTOM_SECRET = process.env.AUTH_CUSTOM_SECRET;
export const AUTH_GOOGLE_ID = process.env.AUTH_GOOGLE_ID;
export const AUTH_GOOGLE_SECRET = process.env.AUTH_GOOGLE_SECRET;
