import prisma from "@/lib/prisma";

async function resetLessons() {
  try {
    console.log("Start resetting lessons...");

    // Delete all user progress first (because of foreign key constraints)
    await prisma.userLessonProgress.deleteMany({});
    console.log("Deleted all user lesson progress");

    // Delete all user problem attempts
    await prisma.userProblemAttempt.deleteMany({});
    console.log("Deleted all user problem attempts");

    // Delete all problems
    await prisma.problem.deleteMany({});
    console.log("Deleted all problems");

    // Delete all lessons
    await prisma.lesson.deleteMany({});
    console.log("Deleted all lessons");

    console.log("Reset completed successfully!");
  } catch (error) {
    console.error("Error resetting lessons:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetLessons();
