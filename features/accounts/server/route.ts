import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcryptjs";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { UserSchema } from "@/prisma/generated/zod";

export const authRouter = new Hono()
  .post(
    "/sign-up",
    zValidator(
      "json",
      UserSchema.pick({ username: true, email: true, password: true }),
    ),
    async (c) => {
      const { username, email, password } = c.req.valid("json");

      if (!password) {
        throw new HTTPException(400, { message: "Password is required" });
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
      });

      if (existingUser) {
        throw new HTTPException(400, { message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          // Create user profile upon registration
          profile: {
            create: {
              totalXP: 0,
              progress: 0
            }
          },
          // Create initial user streak with default values
          streak: {
            create: {
              currentStreak: 0,
              longestStreak: 0,
              lastActive: new Date(new Date().setUTCHours(0, 0, 0, 0))
            }
          }
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      return c.json({ data: userWithoutPassword });
    },
  )
  .get("/current", async (c) => {
    const userId = await getServerSession();

    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return c.json({ user: userWithoutPassword });
  });
