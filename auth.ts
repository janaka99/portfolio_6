import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { AppPropertise } from "./config";

// This would typically come from an environment variable
// For a real application, use environment variables instead of hardcoding
const ADMIN_EMAIL = AppPropertise.ADMIN_EMAIL;
const ADMIN_PASSWORD = AppPropertise.ADMIN_PASSWORD; // hashed version of "supremePassword9921"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        console.log("Reached");
        // In a real app, you would look this up in a database
        if (credentials.email !== ADMIN_EMAIL) {
          return null;
        }

        // Verify password using bcrypt
        const isValidPassword = await compare(
          String(credentials.password),
          ADMIN_PASSWORD
        );
        console.log("Is valid password ", isValidPassword);
        if (!isValidPassword) {
          return null;
        }

        return {
          id: "1",
          email: ADMIN_EMAIL,
          name: "Portfolio Admin",
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
});
