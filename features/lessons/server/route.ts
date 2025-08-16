import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const lessonsRouter = new Hono()
  // GET /api/lessons - Return lessons with completion/progress status
  .get("/", async (c) => {
    const userId = await getServerSession();
    
    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }
    
    try {
      const lessons = await prisma.lesson.findMany({
        orderBy: { order: "asc" },
        include: {
          problems: {
            select: {
              id: true,
            },
          },
        },
      });
      
      // Get user progress for each lesson
      const lessonsWithProgress = await Promise.all(
        lessons.map(async (lesson) => {
          const progress = await prisma.userLessonProgress.findUnique({
            where: {
              userId_lessonId: {
                userId,
                lessonId: lesson.id,
              },
            },
          });
          
          return {
            ...lesson,
            problemCount: lesson.problems.length,
            completed: progress?.completed ?? false,
            percentage: progress?.percentage ?? 0,
          };
        })
      );
      
      return c.json({ data: lessonsWithProgress });
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to fetch lessons" });
    }
  })
  
  // GET /api/lessons/:id - Get lesson + problems (don't leak correct answers to frontend)
  .get("/:id", async (c) => {
    const userId = await getServerSession();
    const lessonId = c.req.param("id");
    
    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }
    
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          problems: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              type: true,
              question: true,
              options: true,
              order: true,
              // Note: We intentionally don't select the 'answer' field to prevent leaking it to frontend
            },
          },
        },
      });
      
      if (!lesson) {
        throw new HTTPException(404, { message: "Lesson not found" });
      }
      
      // Get user progress for this lesson
      const progress = await prisma.userLessonProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: lesson.id,
          },
        },
      });
      
      return c.json({
        data: {
          ...lesson,
          completed: progress?.completed ?? false,
          percentage: progress?.percentage ?? 0,
        },
      });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, { message: "Failed to fetch lesson" });
    }
  })
  
  // POST /api/lessons/:id/submit - Submit answers with attempt_id ; return XP, streak, progress (idempotent)
  .post(
    "/:id/submit",
    zValidator(
      "json",
      z.object({
        attemptId: z.string(),
        answers: z.array(
          z.object({
            problemId: z.string(),
            answer: z.string(),
          })
        ),
      })
    ),
    async (c) => {
      const userId = await getServerSession();
      const lessonId = c.req.param("id");
      const { attemptId, answers } = c.req.valid("json");
      
      if (!userId) {
        throw new HTTPException(403, { message: "Unauthenticated" });
      }
      
      try {
        // Check if this attempt has already been processed (idempotency)
        const existingAttempt = await prisma.userProblemAttempt.findFirst({
          where: {
            attemptId,
          },
        });
        
        if (existingAttempt) {
          // Return the same result as the previous attempt
          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              streak: true,
              profile: true,
            },
          });
          
          return c.json({
            data: {
              xp: existingAttempt.xpEarned,
              totalXp: user?.profile?.totalXP ?? 0,
              streak: user?.streak?.currentStreak ?? 0,
              message: "Attempt already processed",
            },
          });
        }
        
        // Verify that the lesson exists
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
          include: { problems: true },
        });
        
        if (!lesson) {
          throw new HTTPException(404, { message: "Lesson not found" });
        }
        
        // Verify that all problems belong to this lesson
        const problemIds = answers.map((a) => a.problemId);
        const validProblems = lesson.problems.filter((p) =>
          problemIds.includes(p.id)
        );
        
        if (validProblems.length !== answers.length) {
          throw new HTTPException(400, {
            message: "Some problems do not belong to this lesson",
          });
        }
        
        // Process each answer
        let correctAnswers = 0;
        const xpPerProblem = 10; // As defined in the schema
        const attempts = [];
        
        for (const { problemId, answer } of answers) {
          const problem = lesson.problems.find((p) => p.id === problemId);
          
          if (!problem) {
            continue; // Skip if problem not found
          }
          
          const isCorrect = problem.answer === answer;
          if (isCorrect) {
            correctAnswers++;
          }
          
          // Record the attempt
          const attempt = await prisma.userProblemAttempt.create({
            data: {
              userId,
              problemId,
              attemptId, // Same attemptId for all problems in this submission
              answer,
              isCorrect,
              xpEarned: isCorrect ? xpPerProblem : 0,
            },
          });
          
          attempts.push(attempt);
        }
        
        // Calculate XP earned
        const xpEarned = correctAnswers * xpPerProblem;
        
        // Update user's total XP
        const userProfile = await prisma.userProfile.upsert({
          where: { userId },
          update: {
            totalXP: {
              increment: xpEarned,
            },
          },
          create: {
            userId,
            totalXP: xpEarned,
          },
        });
        
        // Update lesson progress
        const totalProblems = lesson.problems.length;
        const progressPercentage = totalProblems > 0 ? (correctAnswers / totalProblems) * 100 : 0;
        
        const lessonProgress = await prisma.userLessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId,
              lessonId,
            },
          },
          update: {
            percentage: progressPercentage,
            completed: progressPercentage === 100,
          },
          create: {
            userId,
            lessonId,
            percentage: progressPercentage,
            completed: progressPercentage === 100,
          },
        });
        
        // Update streak logic
        let streakData = null;
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        
        const userStreak = await prisma.userStreak.upsert({
          where: { userId },
          update: {},
          create: {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            lastActive: today,
          },
        });
        
        // Check if we need to increment streak
        const lastActive = new Date(userStreak.lastActive);
        lastActive.setUTCHours(0, 0, 0, 0);
        
        // Calculate the difference in days
        const diffTime = Math.abs(today.getTime() - lastActive.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          // Reset streak if a day was missed
          await prisma.userStreak.update({
            where: { userId },
            data: {
              currentStreak: correctAnswers > 0 ? 1 : 0,
              lastActive: today,
            },
          });
        } else if (diffDays === 1 && correctAnswers > 0) {
          // Increment streak if user completed >=1 problem on a different UTC day
          const newStreak = userStreak.currentStreak + 1;
          const longestStreak = Math.max(newStreak, userStreak.longestStreak);
          
          await prisma.userStreak.update({
            where: { userId },
            data: {
              currentStreak: newStreak,
              longestStreak,
              lastActive: today,
            },
          });
          
          streakData = {
            current: newStreak,
            longest: longestStreak,
          };
        } else if (diffDays === 0 && correctAnswers > 0) {
          // User is active today, but streak was already incremented
          // We just need to update the lastActive date
          await prisma.userStreak.update({
            where: { userId },
            data: {
              lastActive: today,
            },
          });
        }
        
        // Fetch updated streak data
        if (!streakData) {
          const updatedStreak = await prisma.userStreak.findUnique({
            where: { userId },
          });
          
          streakData = {
            current: updatedStreak?.currentStreak ?? 0,
            longest: updatedStreak?.longestStreak ?? 0,
          };
        }
        
        return c.json({
          data: {
            xp: xpEarned,
            totalXp: userProfile.totalXP,
            streak: streakData.current,
            longestStreak: streakData.longest,
            message: `Correct: ${correctAnswers}/${answers.length}`,
          },
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, { message: "Failed to submit answers" });
      }
    }
  )
  
  // GET /api/profile - Return user stats (total XP, current/best streak, progress percentage)
  .get("/profile", async (c) => {
    const userId = await getServerSession();
    
    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }
    
    try {
      // Get user profile
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });
      
      // Get user streak
      const userStreak = await prisma.userStreak.findUnique({
        where: { userId },
      });
      
      // Calculate overall progress percentage
      const totalLessons = await prisma.lesson.count();
      const completedLessons = await prisma.userLessonProgress.count({
        where: {
          userId,
          completed: true,
        },
      });
      
      const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
      
      return c.json({
        data: {
          totalXP: userProfile?.totalXP ?? 0,
          progress: progressPercentage,
          streak: {
            current: userStreak?.currentStreak ?? 0,
            longest: userStreak?.longestStreak ?? 0,
          },
        },
      });
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to fetch profile" });
    }
  });

export { lessonsRouter };