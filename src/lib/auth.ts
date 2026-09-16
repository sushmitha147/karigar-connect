import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Karigar Credentials",
      credentials: {
        identifier: { label: "Mobile or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your mobile/email and password.");
        }

        const identifier = credentials.identifier.trim();

        // Search by email or mobile
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier.toLowerCase() },
              { mobile: identifier },
            ],
          },
          include: {
            sellerProfile: true,
            buyerProfile: true,
          },
        });

        if (!user) {
          throw new Error("No account found with this mobile or email.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          language: user.language,
          sellerProfileId: user.sellerProfile?.id,
          buyerProfileId: user.buyerProfile?.id,
          isVerified: user.sellerProfile?.isVerified ?? false,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.mobile = (user as any).mobile;
        token.language = (user as any).language;
        token.sellerProfileId = (user as any).sellerProfileId;
        token.buyerProfileId = (user as any).buyerProfileId;
        token.isVerified = (user as any).isVerified;
      }
      if (trigger === "update" && session?.language) {
        token.language = session.language;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).mobile = token.mobile;
        (session.user as any).language = token.language;
        (session.user as any).sellerProfileId = token.sellerProfileId;
        (session.user as any).buyerProfileId = token.buyerProfileId;
        (session.user as any).isVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "karigar-connect-default-secret-2026",
};
