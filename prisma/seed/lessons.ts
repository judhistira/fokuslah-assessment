import { Prisma } from "@prisma/client";

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
  // Basic Arithmetic Problems
  {
    id: "problem-ba-1",
    lessonId: "lesson-basic-arithmetic",
    type: "INPUT",
    question: "What is 5 + 7?",
    answer: "12",
    order: 1,
  },
  {
    id: "problem-ba-2",
    lessonId: "lesson-basic-arithmetic",
    type: "INPUT",
    question: "What is 15 - 8?",
    answer: "7",
    order: 2,
  },
  {
    id: "problem-ba-3",
    lessonId: "lesson-basic-arithmetic",
    type: "INPUT",
    question: "What is 9 + 6?",
    answer: "15",
    order: 3,
  },
  {
    id: "problem-ba-4",
    lessonId: "lesson-basic-arithmetic",
    type: "INPUT",
    question: "What is 20 - 12?",
    answer: "8",
    order: 4,
  },
  {
    id: "problem-ba-5",
    lessonId: "lesson-basic-arithmetic",
    type: "INPUT",
    question: "What is 13 + 9?",
    answer: "22",
    order: 5,
  },
  
  // Multiplication Mastery Problems
  {
    id: "problem-mm-1",
    lessonId: "lesson-multiplication-mastery",
    type: "INPUT",
    question: "What is 7 × 8?",
    answer: "56",
    order: 1,
  },
  {
    id: "problem-mm-2",
    lessonId: "lesson-multiplication-mastery",
    type: "INPUT",
    question: "What is 9 × 6?",
    answer: "54",
    order: 2,
  },
  {
    id: "problem-mm-3",
    lessonId: "lesson-multiplication-mastery",
    type: "INPUT",
    question: "What is 12 × 5?",
    answer: "60",
    order: 3,
  },
  {
    id: "problem-mm-4",
    lessonId: "lesson-multiplication-mastery",
    type: "INPUT",
    question: "What is 4 × 11?",
    answer: "44",
    order: 4,
  },
  {
    id: "problem-mm-5",
    lessonId: "lesson-multiplication-mastery",
    type: "INPUT",
    question: "What is 8 × 7?",
    answer: "56",
    order: 5,
  },
  
  // Division Basics Problems
  {
    id: "problem-db-1",
    lessonId: "lesson-division-basics",
    type: "INPUT",
    question: "What is 24 ÷ 6?",
    answer: "4",
    order: 1,
  },
  {
    id: "problem-db-2",
    lessonId: "lesson-division-basics",
    type: "INPUT",
    question: "What is 45 ÷ 9?",
    answer: "5",
    order: 2,
  },
  {
    id: "problem-db-3",
    lessonId: "lesson-division-basics",
    type: "INPUT",
    question: "What is 63 ÷ 7?",
    answer: "9",
    order: 3,
  },
  {
    id: "problem-db-4",
    lessonId: "lesson-division-basics",
    type: "INPUT",
    question: "What is 81 ÷ 9?",
    answer: "9",
    order: 4,
  },
  {
    id: "problem-db-5",
    lessonId: "lesson-division-basics",
    type: "INPUT",
    question: "What is 50 ÷ 5?",
    answer: "10",
    order: 5,
  },
];