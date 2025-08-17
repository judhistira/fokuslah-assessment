import { Prisma } from "@/lib/generated/prisma";

export const lessonsData: Prisma.LessonCreateManyInput[] = [
  {
    id: "lesson-basic-arithmetic",
    title: "Basic Arithmetic",
    description: "Addition and subtraction problems",
    order: 1,
  },
  {
    id: "lesson-multiplication-mastery",
    title: "Multiplication Mastery",
    description: "Times tables",
    order: 2,
  },
  {
    id: "lesson-division-basics",
    title: "Division Basics",
    description: "Simple division",
    order: 3,
  },
];

export const problemsData: Prisma.ProblemCreateManyInput[] = [
  // Basic Arithmetic Problems (Multiple Choice)
  {
    id: "problem-ba-1",
    lessonId: "lesson-basic-arithmetic",
    type: "MULTIPLE_CHOICE",
    question: "What is 5 + 7?",
    answer: "12",
    order: 1,
  },
  {
    id: "problem-ba-2",
    lessonId: "lesson-basic-arithmetic",
    type: "MULTIPLE_CHOICE",
    question: "What is 15 - 8?",
    answer: "7",
    order: 2,
  },
  {
    id: "problem-ba-3",
    lessonId: "lesson-basic-arithmetic",
    type: "MULTIPLE_CHOICE",
    question: "What is 9 + 6?",
    answer: "15",
    order: 3,
  },
  {
    id: "problem-ba-4",
    lessonId: "lesson-basic-arithmetic",
    type: "MULTIPLE_CHOICE",
    question: "What is 20 - 12?",
    answer: "8",
    order: 4,
  },
  {
    id: "problem-ba-5",
    lessonId: "lesson-basic-arithmetic",
    type: "MULTIPLE_CHOICE",
    question: "What is 13 + 9?",
    answer: "22",
    order: 5,
  },

  // Multiplication Mastery Problems (Multiple Choice)
  {
    id: "problem-mm-1",
    lessonId: "lesson-multiplication-mastery",
    type: "MULTIPLE_CHOICE",
    question: "What is 7 × 8?",
    answer: "56",
    order: 1,
  },
  {
    id: "problem-mm-2",
    lessonId: "lesson-multiplication-mastery",
    type: "MULTIPLE_CHOICE",
    question: "What is 9 × 6?",
    answer: "54",
    order: 2,
  },
  {
    id: "problem-mm-3",
    lessonId: "lesson-multiplication-mastery",
    type: "MULTIPLE_CHOICE",
    question: "What is 12 × 5?",
    answer: "60",
    order: 3,
  },
  {
    id: "problem-mm-4",
    lessonId: "lesson-multiplication-mastery",
    type: "MULTIPLE_CHOICE",
    question: "What is 4 × 11?",
    answer: "44",
    order: 4,
  },
  {
    id: "problem-mm-5",
    lessonId: "lesson-multiplication-mastery",
    type: "MULTIPLE_CHOICE",
    question: "What is 8 × 7?",
    answer: "56",
    order: 5,
  },

  // Division Basics Problems (Multiple Choice)
  {
    id: "problem-db-1",
    lessonId: "lesson-division-basics",
    type: "MULTIPLE_CHOICE",
    question: "What is 24 ÷ 6?",
    answer: "4",
    order: 1,
  },
  {
    id: "problem-db-2",
    lessonId: "lesson-division-basics",
    type: "MULTIPLE_CHOICE",
    question: "What is 45 ÷ 9?",
    answer: "5",
    order: 2,
  },
  {
    id: "problem-db-3",
    lessonId: "lesson-division-basics",
    type: "MULTIPLE_CHOICE",
    question: "What is 63 ÷ 7?",
    answer: "9",
    order: 3,
  },
  {
    id: "problem-db-4",
    lessonId: "lesson-division-basics",
    type: "MULTIPLE_CHOICE",
    question: "What is 81 ÷ 9?",
    answer: "9",
    order: 4,
  },
  {
    id: "problem-db-5",
    lessonId: "lesson-division-basics",
    type: "MULTIPLE_CHOICE",
    question: "What is 50 ÷ 5?",
    answer: "10",
    order: 5,
  },
];

export const problemOptionsData: Prisma.ProblemOptionCreateManyInput[] = [
  // Basic Arithmetic Problem Options
  { problemId: "problem-ba-1", text: "10", order: 1 },
  { problemId: "problem-ba-1", text: "11", order: 2 },
  { problemId: "problem-ba-1", text: "12", order: 3 },
  { problemId: "problem-ba-1", text: "13", order: 4 },
  
  { problemId: "problem-ba-2", text: "5", order: 1 },
  { problemId: "problem-ba-2", text: "6", order: 2 },
  { problemId: "problem-ba-2", text: "7", order: 3 },
  { problemId: "problem-ba-2", text: "8", order: 4 },
  
  { problemId: "problem-ba-3", text: "14", order: 1 },
  { problemId: "problem-ba-3", text: "15", order: 2 },
  { problemId: "problem-ba-3", text: "16", order: 3 },
  { problemId: "problem-ba-3", text: "17", order: 4 },
  
  { problemId: "problem-ba-4", text: "7", order: 1 },
  { problemId: "problem-ba-4", text: "8", order: 2 },
  { problemId: "problem-ba-4", text: "9", order: 3 },
  { problemId: "problem-ba-4", text: "10", order: 4 },
  
  { problemId: "problem-ba-5", text: "21", order: 1 },
  { problemId: "problem-ba-5", text: "22", order: 2 },
  { problemId: "problem-ba-5", text: "23", order: 3 },
  { problemId: "problem-ba-5", text: "24", order: 4 },

  // Multiplication Mastery Problem Options
  { problemId: "problem-mm-1", text: "54", order: 1 },
  { problemId: "problem-mm-1", text: "56", order: 2 },
  { problemId: "problem-mm-1", text: "58", order: 3 },
  { problemId: "problem-mm-1", text: "60", order: 4 },
  
  { problemId: "problem-mm-2", text: "52", order: 1 },
  { problemId: "problem-mm-2", text: "54", order: 2 },
  { problemId: "problem-mm-2", text: "56", order: 3 },
  { problemId: "problem-mm-2", text: "58", order: 4 },
  
  { problemId: "problem-mm-3", text: "55", order: 1 },
  { problemId: "problem-mm-3", text: "60", order: 2 },
  { problemId: "problem-mm-3", text: "65", order: 3 },
  { problemId: "problem-mm-3", text: "70", order: 4 },
  
  { problemId: "problem-mm-4", text: "40", order: 1 },
  { problemId: "problem-mm-4", text: "42", order: 2 },
  { problemId: "problem-mm-4", text: "44", order: 3 },
  { problemId: "problem-mm-4", text: "46", order: 4 },
  
  { problemId: "problem-mm-5", text: "54", order: 1 },
  { problemId: "problem-mm-5", text: "56", order: 2 },
  { problemId: "problem-mm-5", text: "58", order: 3 },
  { problemId: "problem-mm-5", text: "60", order: 4 },

  // Division Basics Problem Options
  { problemId: "problem-db-1", text: "3", order: 1 },
  { problemId: "problem-db-1", text: "4", order: 2 },
  { problemId: "problem-db-1", text: "5", order: 3 },
  { problemId: "problem-db-1", text: "6", order: 4 },
  
  { problemId: "problem-db-2", text: "4", order: 1 },
  { problemId: "problem-db-2", text: "5", order: 2 },
  { problemId: "problem-db-2", text: "6", order: 3 },
  { problemId: "problem-db-2", text: "7", order: 4 },
  
  { problemId: "problem-db-3", text: "7", order: 1 },
  { problemId: "problem-db-3", text: "8", order: 2 },
  { problemId: "problem-db-3", text: "9", order: 3 },
  { problemId: "problem-db-3", text: "10", order: 4 },
  
  { problemId: "problem-db-4", text: "7", order: 1 },
  { problemId: "problem-db-4", text: "8", order: 2 },
  { problemId: "problem-db-4", text: "9", order: 3 },
  { problemId: "problem-db-4", text: "10", order: 4 },
  
  { problemId: "problem-db-5", text: "8", order: 1 },
  { problemId: "problem-db-5", text: "9", order: 2 },
  { problemId: "problem-db-5", text: "10", order: 3 },
  { problemId: "problem-db-5", text: "11", order: 4 },
];