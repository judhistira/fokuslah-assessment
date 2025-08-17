"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
  problemCount: number;
  completed: boolean;
  percentage: number;
}

interface LessonCardProps {
  lesson: Lesson;
}

export const LessonCard = ({ lesson }: LessonCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{lesson.title}</h3>
            <p className="mt-1 text-gray-600">
              {lesson.description || `${lesson.problemCount} problems`}
            </p>
          </div>
          {lesson.completed && (
            <Badge
              variant="secondary"
              className="bg-violet-100 text-violet-800"
            >
              Completed
            </Badge>
          )}
        </div>

        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(lesson.percentage)}%</span>
          </div>
          <Progress value={lesson.percentage} className="h-2" />
        </div>

        <Link
          href={`/lessons/${lesson.id}`}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-violet-500 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-600"
        >
          {lesson.completed ? "Review" : "Start Lesson"}
        </Link>
      </div>
    </motion.div>
  );
};
