import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";
import { resend, FROM_ADDRESS } from "@/lib/resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM ?? "noreply@localhost",
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
          from: FROM_ADDRESS,
          to: user.email,
          subject: "Welcome!",
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
      // Expose hasAccess and id on the session so clients can gate features
      if (user) {
        session.user.id = user.id;
        (session.user as typeof session.user & { hasAccess: boolean }).hasAccess =
          (user as typeof user & { hasAccess: boolean }).hasAccess ?? false;
      }
      return session;
    },
  },
});
