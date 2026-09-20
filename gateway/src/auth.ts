import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import type { Config } from "./config.js";
export function createAuth(db: PrismaClient, config: Config) {
  const transport = config.SMTP_HOST ? nodemailer.createTransport({
    host: config.SMTP_HOST, port: config.SMTP_PORT, secure: config.SMTP_SECURE === "true",
    auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASSWORD } : undefined,
    connectionTimeout: 5000, socketTimeout: 10000,
  }) : null;
  const send = async (to: string, subject: string, url: string) => {
    if (!transport) throw new Error("Email delivery is not configured.");
    await transport.sendMail({ from: config.SMTP_FROM, to, subject, text: `${subject}\n\n${url}\n\nIf you did not request this, you can ignore this email.` });
  };
  return betterAuth({
    appName: "socratescode", baseURL: config.BETTER_AUTH_URL, basePath: "/api/auth",
    secret: config.BETTER_AUTH_SECRET,
    database: prismaAdapter(db, { provider: "postgresql" }),
    trustedOrigins: [config.APP_ORIGIN],
    emailAndPassword: {
      enabled: true, minPasswordLength: 12, maxPasswordLength: 128,
      requireEmailVerification: config.NODE_ENV === "production",
      revokeSessionsOnPasswordReset: true,
      ...(transport ? { sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => send(user.email, "Reset your socratescode password", url) } : {}),
    },
    emailVerification: transport ? {
      sendOnSignUp: config.NODE_ENV === "production", autoSignInAfterVerification: false,
      sendVerificationEmail: async ({ user, url }) => send(user.email, "Verify your socratescode email", url),
    } : undefined,
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24, cookieCache: { enabled: false } },
    account: { accountLinking: { enabled: false } },
    advanced: { useSecureCookies: config.NODE_ENV === "production", defaultCookieAttributes: { httpOnly: true, sameSite: "lax" } },
    // Shared PostgreSQL admission middleware enforces limits across instances.
    rateLimit: { enabled: false },
    logger: { disabled: true },
  });
}
