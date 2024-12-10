/** User roles */
export const Roles = ["guest", "user", "admin"] as const;

/** User roles */
export type Role = (typeof Roles)[number];
