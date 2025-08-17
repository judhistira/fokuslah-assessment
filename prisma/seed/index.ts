import prisma from "@/lib/prisma";

import { lessonsData, problemsData, problemOptionsData } from "./lessons";

async function seed() {
  try {
    console.log("Start seeding...");
    
    // Insert lessons
    console.log("Seeding lessons...");
    await prisma.lesson.createMany({
      data: lessonsData,
      skipDuplicates: true,
    });
    
    // Insert problems
    console.log("Seeding problems...");
    await prisma.problem.createMany({
      data: problemsData,
      skipDuplicates: true,
    });
    
    // Insert problem options
    console.log("Seeding problem options...");
    // Delete existing options first to avoid duplicates
    await prisma.problemOption.deleteMany({});
    
    // Then create new options
    await prisma.problemOption.createMany({
      data: problemOptionsData,
    });
    
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();