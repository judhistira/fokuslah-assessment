"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { LoadingState } from "@/components/common/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useGetLesson } from "@/features/lessons/api/use-get-lesson";
import { useGetProblemAttempts } from "@/features/lessons/api/use-get-problem-attempts";

export default function LessonOverviewPage() {
  const { id } = useParams<{ id: string }>();

  const { data: lesson, isLoading, isError, error } = useGetLesson(id);
  const { data: problemAttempts } = useGetProblemAttempts(id);

  // Redirect if lesson not found

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px] items-center justify-center px-4 py-8">
        <LoadingState message="Loading lesson..." />
      </div>
    );
  }

  if (isError) {
    // Log the error for debugging
    console.error("Lesson fetch error:", error);
    return notFound();
  }

  if (!lesson) {
    return notFound();
  }

  const completedCount = Math.round(
    (lesson.percentage / 100) * lesson.problems.length,
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">{lesson.title}</CardTitle>
            <p className="text-gray-600">
              {lesson.description || "No description available"}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Progress: {Math.round(lesson.percentage)}%
                </span>
                <span className="text-sm font-medium">
                  {completedCount} / {lesson.problems.length} completed
                </span>
              </div>
              <Progress value={lesson.percentage} className="mt-2 h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Questions</h3>
              <div className="space-y-3">
                {lesson.problems.map((problem, index) => {
                  // Get attempt status for this problem
                  const attempt = problemAttempts?.get(problem.id);
                  const isAttempted = attempt?.attempted || false;
                  const isCorrect = attempt?.isCorrect || false;

                  return (
                    <Link
                      key={problem.id}
                      href={`/lessons/${id}/${problem.id}`}
                      className="block"
                    >
                      <div
                        className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
                          isAttempted
                            ? isCorrect
                              ? "border-green-500 bg-green-50"
                              : "border-red-500 bg-red-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${
                              isAttempted
                                ? isCorrect
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium">
                            Question {index + 1}
                          </span>
                          {isAttempted && (
                            <span
                              className={`ml-2 rounded-full px-2 py-1 text-xs ${
                                isCorrect
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          {isAttempted
                            ? isCorrect
                              ? "Review"
                              : "Retry"
                            : "Start"}
                        </Button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
