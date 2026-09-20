import { z } from "zod";
const schema = z.object({
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  APP_ORIGIN: z.string().url(),
  PORT: z.coerce.number().int().min(1024).max(65535).default(4000),
  HOST: z.string().default("127.0.0.1"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().default("socratescode <accounts@localhost.test>"),
  SMTP_SECURE: z.enum(["true", "false"]).default("false"),
});
export function readConfig(env: NodeJS.ProcessEnv) {
  const result = schema.safeParse(env);
  if (!result.success) throw new Error("Missing or invalid gateway configuration: " + result.error.issues.map(i => i.path.join(".")).join(", "));
  const config = result.data;
  if (new URL(config.APP_ORIGIN).origin !== config.APP_ORIGIN || new URL(config.BETTER_AUTH_URL).origin !== config.APP_ORIGIN) throw new Error("Authentication URL must match the public application origin.");
  if (config.NODE_ENV === "production" && (!config.SMTP_HOST || !config.APP_ORIGIN.startsWith("https://") || config.BETTER_AUTH_SECRET.startsWith("replace-"))) throw new Error("Production requires HTTPS, configured email delivery and a unique secret.");
  return config;
}
export type Config = ReturnType<typeof readConfig>;
