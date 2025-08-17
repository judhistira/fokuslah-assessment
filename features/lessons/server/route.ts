import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { awardXP } from "@/lib/xp-manager";

const lessonsRouter = new Hono()

  // GET /api/lessons - Return lessons with completion/progress status
  .get("/", async (c) => {
    const userId = await getServerSession();

    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }

    const lessonsWithProgress = await prisma.lesson.findMany({
      orderBy: { order: "asc" },
      include: {
        problems: {
          select: {
            id: true,
          },
        },
        userProgress: {
          where: {
            userId,
          },
          select: {
            completed: true,
            percentage: true,
          },
        },
      },
    });

    if (!lessonsWithProgress) {
      console.log("Lessons not found");
      throw new HTTPException(404, { message: "Lessons not found" });
    }

    // Transform to the expected format
    const result = lessonsWithProgress.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      problemCount: lesson.problems.length,
      completed: lesson.userProgress[0]?.completed ?? false,
      percentage: lesson.userProgress[0]?.percentage ?? 0,
    }));

    return c.json({ data: result });
  })

  // GET /api/lessons/:id - Get lesson + problems (don't leak correct answers to frontend)
  .get("/:id", async (c) => {
    const userId = await getServerSession();
    const lessonId = c.req.param("id");

    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        problems: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            type: true,
            question: true,
            order: true,
            options: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                text: true,
              },
            },
            // Note: We intentionally don't select the 'answer' field to prevent leaking it to frontend
          },
        },
        userProgress: {
          where: {
            userId,
          },
          select: {
            completed: true,
            percentage: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new HTTPException(404, { message: "Lesson not found" });
    }

    // Transform problems to include options in the expected format
    const transformedLesson = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      problems: lesson.problems.map((problem) => ({
        id: problem.id,
        type: problem.type,
        question: problem.question,
        order: problem.order,
        options: problem.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
      })),
      completed: lesson.userProgress[0]?.completed ?? false,
      percentage: lesson.userProgress[0]?.percentage ?? 0,
    };

    return c.json({
      data: transformedLesson,
    });
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
          }),
        ),
      }),
    ),
    async (c) => {
      // --- 1. Authentication & Validation (Early Returns) ---
      const userId = await getServerSession();
      if (!userId) {
        throw new HTTPException(403, { message: "Unauthenticated" });
      }

      const { attemptId, answers } = c.req.valid("json");
      if (answers.length !== 1) {
        throw new HTTPException(400, {
          message: "Exactly one answer expected per submission",
        });
      }

      const { problemId, answer } = answers[0];
      const lessonId = c.req.param("id");

      const problem = await prisma.problem.findFirst({
        where: { id: problemId, lessonId: lessonId },
      });

      if (!problem) {
        throw new HTTPException(404, {
          message: "Problem not found in this lesson",
        });
      }

      // --- 2. Idempotency Check (Early Return) ---
      const existingAttemptById = await prisma.userProblemAttempt.findFirst({
        where: { userId, problemId, attemptId },
      });

      if (existingAttemptById) {
        const [userStreak, userProfile] = await Promise.all([
          prisma.userStreak.findUnique({ where: { userId } }),
          prisma.userProfile.findUnique({ where: { userId } }),
        ]);

        return c.json({
          data: {
            xp: existingAttemptById.xpEarned,
            totalXp: userProfile?.totalXP ?? 0,
            streak: userStreak?.currentStreak ?? 0,
            longestStreak: userStreak?.longestStreak ?? 0,
            message: "Attempt already processed",
            isCorrect: existingAttemptById.isCorrect,
            wasNewlyCorrect: false, // Cannot be newly correct on a re-processed attempt
          },
        });
      }

      // --- 3. Process the Answer ---
      const cleanProblemAnswer = problem.answer.trim();
      const isCorrect =
        cleanProblemAnswer.toLowerCase() === answer.trim().toLowerCase();

      let wasNewlyCorrect = false;
      let problemAttemptId: string;

      const previousAttempt = await prisma.userProblemAttempt.findFirst({
        where: { userId, problemId },
        select: { id: true, isCorrect: true },
      });

      if (previousAttempt) {
        problemAttemptId = previousAttempt.id;
        if (!previousAttempt.isCorrect && isCorrect) {
          wasNewlyCorrect = true;
          await prisma.userProblemAttempt.update({
            where: { id: previousAttempt.id },
            data: { attemptId, answer, isCorrect, xpEarned: 10 },
          });
        }
      } else {
        wasNewlyCorrect = isCorrect;
        const newAttempt = await prisma.userProblemAttempt.create({
          data: {
            userId,
            problemId,
            attemptId,
            answer,
            isCorrect,
            xpEarned: isCorrect ? 10 : 0,
          },
          select: { id: true },
        });
        problemAttemptId = newAttempt.id;
      }

      // --- 4. Award XP & Update Streak ---
      if (wasNewlyCorrect) {
        await awardXP({
          userId,
          amount: 10,
          category: "CORRECT_ANSWER",
          description: `Correct answer for problem ${problemId}`,
          sourceType: "USER_PROBLEM_ATTEMPT",
          sourceId: problemAttemptId,
        });
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      // Pre-calculate streak logic outside of Prisma call
      const existingStreak = await prisma.userStreak.findUnique({
        where: { userId },
      });

      let newCurrentStreak: number;
      let newLongestStreak: number;

      if (!existingStreak) {
        newCurrentStreak = wasNewlyCorrect ? 1 : 0;
        newLongestStreak = wasNewlyCorrect ? 1 : 0;
      } else {
        const lastActive = new Date(existingStreak.lastActive);
        lastActive.setUTCHours(0, 0, 0, 0);
        const diffDays = Math.round(
          (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (wasNewlyCorrect) {
          if (diffDays === 1) {
            newCurrentStreak = existingStreak.currentStreak + 1;
          } else if (diffDays > 1) {
            newCurrentStreak = 1;
          } else if (diffDays === 0 && existingStreak.currentStreak === 0) {
            newCurrentStreak = 1;
          } else {
            newCurrentStreak = existingStreak.currentStreak; // No change
          }
        } else {
          if (diffDays > 1) {
            newCurrentStreak = 0; // Reset if incorrect and missed days
          } else {
            newCurrentStreak = existingStreak.currentStreak; // No change
          }
        }
        newLongestStreak = Math.max(
          newCurrentStreak,
          existingStreak.longestStreak,
        );
      }

      const userStreak = await prisma.userStreak.upsert({
        where: { userId },
        create: {
          userId,
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastActive: today,
        },
        update: {
          currentStreak: newCurrentStreak,
          longestStreak: newLongestStreak,
          lastActive: today,
        },
      });

      // --- 5. Final Data Fetch & Return ---
      const updatedUserProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });

      const message = isCorrect
        ? wasNewlyCorrect
          ? "Correct answer! You earned 10 XP."
          : "Correct answer! You already answered this correctly before."
        : "Incorrect answer. Try again!";

      return c.json({
        data: {
          xp: wasNewlyCorrect ? 10 : 0,
          totalXp: updatedUserProfile?.totalXP ?? 0,
          streak: userStreak.currentStreak,
          longestStreak: userStreak.longestStreak,
          message,
          isCorrect,
          wasNewlyCorrect,
        },
      });
    },
  )

  // POST /api/lessons/:id/save-progress - Save user's progress for a lesson
  .post(
    "/:id/save-progress",
    zValidator(
      "json",
      z.object({
        answers: z.array(
          z.object({
            problemId: z.string(),
            answer: z.string(),
          }),
        ),
      }),
    ),
    async (c) => {
      const userId = await getServerSession();
      const lessonId = c.req.param("id");
      const { answers } = c.req.valid("json");

      if (!userId) {
        throw new HTTPException(403, { message: "Unauthenticated" });
      }

      try {
        // Verify that the lesson exists
        const lesson = await prisma.lesson.findUnique({
          where: { id: lessonId },
        });

        if (!lesson) {
          throw new HTTPException(404, { message: "Lesson not found" });
        }

        // Save each answer
        for (const { problemId, answer } of answers) {
          // Create or update the temporary answer record
          await prisma.temporaryAnswer.upsert({
            where: {
              userId_problemId: {
                userId,
                problemId,
              },
            },
            update: {
              answer,
            },
            create: {
              userId,
              problemId,
              answer,
              lessonId,
            },
          });
        }

        return c.json({
          success: true,
          message: "Progress saved successfully",
        });
      } catch (error) {
        if (error instanceof HTTPException) {
          throw error;
        }
        throw new HTTPException(500, { message: "Failed to save progress" });
      }
    },
  )

  // GET /api/lessons/:id/saved-progress - Get user's saved progress for a lesson
  .get("/:id/saved-progress", async (c) => {
    const userId = await getServerSession();
    const lessonId = c.req.param("id");

    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }

    try {
      // Verify that the lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (!lesson) {
        throw new HTTPException(404, { message: "Lesson not found" });
      }

      // Get saved answers for this lesson
      const savedAnswers = await prisma.temporaryAnswer.findMany({
        where: {
          userId,
          lessonId,
        },
        select: {
          problemId: true,
          answer: true,
        },
      });

      // Convert to object for easier lookup
      const answersMap = savedAnswers.reduce(
        (acc, curr) => {
          acc[curr.problemId] = curr.answer;
          return acc;
        },
        {} as Record<string, string>,
      );

      return c.json({
        data: answersMap,
      });
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }
      throw new HTTPException(500, {
        message: "Failed to fetch saved progress",
      });
    }
  })

  // GET /api/lessons/:id/problem-attempts - Get attempt status for all problems in a lesson
  .get("/:id/problem-attempts", async (c) => {
    const userId = await getServerSession();
    const lessonId = c.req.param("id");

    if (!userId) {
      throw new HTTPException(403, { message: "Unauthenticated" });
    }

    // Verify that the lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new HTTPException(404, { message: "Lesson not found" });
    }

    // Get all attempts for this user and lesson
    const attempts = await prisma.userProblemAttempt.findMany({
      where: {
        userId,
        problem: {
          lessonId: lessonId,
        },
      },
      select: {
        problemId: true,
        isCorrect: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create a map for quick lookup of latest attempt per problem
    const attemptMap = new Map();
    for (const attempt of attempts) {
      // Only store the most recent attempt for each problem
      if (!attemptMap.has(attempt.problemId)) {
        attemptMap.set(attempt.problemId, {
          isCorrect: attempt.isCorrect,
          attempted: true,
          lastAttempted: attempt.createdAt,
        });
      }
    }

    return c.json({
      data: Object.fromEntries(attemptMap),
    });
  });

export { lessonsRouter };
