import prisma from "@/lib/prisma";

import { lessonsData, problemsData } from "./lessons";

async function seed() {
  try {
    console.log("Start seeding...");
    
    // Insert lessons
    console.log("Seeding lessons...");
    for (const lesson of lessonsData) {
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {},
        create: lesson,
      });
    }
    
    // Insert problems
    console.log("Seeding problems...");
    for (const problem of problemsData) {
      await prisma.problem.upsert({
        where: { id: problem.id },
        update: {},
        create: problem,
      });
    }
    
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();