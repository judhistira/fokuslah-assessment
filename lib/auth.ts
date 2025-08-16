import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import prisma from "@/lib/prisma";

import { UserSchema } from "@/prisma/generated/zod";

const signInSchema = UserSchema.pick({ username: true, password: true });

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async jwt({ token }) {
      // if (!token.sub) return token;

      // const existingUser = await getUserById(token.sub);

      // if (!existingUser) return token;

      // token.role = existingUser.role as "USER" | "ADMIN";

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // session.user.role = token.role;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = signInSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password } = validatedFields.data;

          const user = await prisma.user.findFirst({
            where: {
              username: {
                equals: username,
                mode: "insensitive",
              },
            },
          });

          if (!user || !user.password || !password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);

export const getServerSession = async () => {
  const session = await auth();

  if (session && session.user && session.user && session.user.id) {
    return session.user.id;
  }

  return null;
};
