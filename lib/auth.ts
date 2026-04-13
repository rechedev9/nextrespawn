import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";
import { resend, getFromAddress } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { config } from "@/config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM ?? "noreply@localhost", // validated at startup by lib/env.ts
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
    error: "/login",
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      try {
        await resend.emails.send({
          from: getFromAddress(),
          to: user.email,
          subject: `Welcome to ${config.appName}!`,
          react: WelcomeEmail({ name: user.name ?? "there", appUrl }),
        });
      } catch (err) {
        // Welcome email failure should not block sign-up
        console.error("[auth/events] Failed to send welcome email:", err);
      }
    },
  },
  callbacks: {
    session({ session, user }) {
      if (user) {
        session.user.id = user.id;
        session.user.hasAccess = user.hasAccess ?? false;
      }
      return session;
    },
  },
});
