export interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  problemCount: number;
  completed: boolean;
  percentage: number;
}

export interface Problem {
  id: string;
  type: "MULTIPLE_CHOICE" | "INPUT";
  question: string;
  options: Array<{ id: string; text: string }>;
  order: number;
}

export interface ProblemAttempt {
  id: string;
  problemId: string;
  isCorrect: boolean;
  attempted: boolean;
  lastAttempted?: Date;
}