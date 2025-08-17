import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { calculateLevelProgress } from "@/lib/level-system";

const profileRouter = new Hono()
  // GET /api/profile - Return user stats (total XP, current/best streak, progress percentage, level info)
  .get("/profile", async (c) => {
    const userId = await getServerSession();

    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }

    try {
      // Get today's date in UTC for comparison
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Calculate total XP from XP transactions
      const xpAggregation = await prisma.userXP.aggregate({
        where: { userId },
        _sum: {
          amount: true,
        },
      });

      const totalXP = xpAggregation._sum.amount || 0;

      // Calculate level and progress
      const levelInfo = calculateLevelProgress(totalXP);

      // Get user streak data and check if user has activity today
      const [userStreak, totalLessons, completedLessons, todayActivity] = await Promise.all([
        prisma.userStreak.findUnique({
          where: { userId },
        }),
        prisma.lesson.count(),
        prisma.userLessonProgress.count({
          where: {
            userId,
            completed: true,
          },
        }),
        prisma.userProblemAttempt.findFirst({
          where: {
            userId,
            createdAt: {
              gte: today,
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

      const progressPercentage =
        totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return c.json({
        data: {
          totalXP: totalXP,
          progress: progressPercentage,
          streak: {
            current: userStreak?.currentStreak ?? 0,
            longest: userStreak?.longestStreak ?? 0,
          },
          hasActivityToday: !!todayActivity,
          level: levelInfo.level,
          xpIntoLevel: levelInfo.xpIntoLevel,
          xpForNextLevel: levelInfo.xpForNextLevel,
          levelProgress: levelInfo.progressPercentage,
        },
      });
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to fetch profile" });
    }
  });

export { profileRouter };
