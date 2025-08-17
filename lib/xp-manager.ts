import prisma from "@/lib/prisma";

/**
 * Award XP to a user and create an XP transaction record
 * @param userId The user ID to award XP to
 * @param amount The amount of XP to award
 * @param sourceType The type of source for this XP
 * @param sourceId The ID of the source entity
 * @param description Description of how XP was earned
 * @param category Category of XP earned
 * @returns The created XP transaction record
 */
export async function awardXP({
  userId,
  amount,
  sourceType,
  sourceId,
  description,
  category
}: {
  userId: string;
  amount: number;
  sourceType: "USER_PROBLEM_ATTEMPT" | "MANUAL_ADJUSTMENT" | "SPECIAL_ACHIEVEMENT" | "DAILY_STREAK";
  sourceId: string;
  description: string;
  category: "CORRECT_ANSWER" | "STREAK_BONUS" | "ACHIEVEMENT" | "MANUAL";
}) {
  // Create the XP transaction record
  const xpTransaction = await prisma.userXP.create({
    data: {
      userId,
      amount,
      sourceType,
      sourceId,
      description,
      category
    }
  });

  // Update user's total XP by recalculating from all XP transactions
  const totalXP = await prisma.userXP.aggregate({
    where: {
      userId
    },
    _sum: {
      amount: true
    }
  });

  // Update user profile with new total XP
  await prisma.userProfile.update({
    where: {
      userId
    },
    data: {
      totalXP: totalXP._sum.amount || 0
    }
  });

  return xpTransaction;
}

/**
 * Recalculate and update a user's total XP based on all XP transactions
 * @param userId The user ID to recalculate XP for
 * @returns The updated total XP amount
 */
export async function recalculateUserXP(userId: string) {
  // Sum all XP transactions for this user
  const totalXPResult = await prisma.userXP.aggregate({
    where: {
      userId
    },
    _sum: {
      amount: true
    }
  });

  const totalXP = totalXPResult._sum.amount || 0;

  // Update user profile with recalculated total XP
  await prisma.userProfile.update({
    where: {
      userId
    },
    data: {
      totalXP
    }
  });

  return totalXP;
}