"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { LessonResult } from "@/components/common/lesson-result";
import { LoadingState } from "@/components/common/loading-state";
import { ProblemSolver } from "@/components/common/problem-solver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useGetLesson } from "@/features/lessons/api/use-get-lesson";
import { useSubmitLesson } from "@/features/lessons/api/use-submit-lesson";

// Define the result data type based on the actual API response
interface ResultData {
  xp: number;
  totalXp: number;
  streak: number;
  longestStreak: number;
  message: string;
  isCorrect: boolean;
  wasNewlyCorrect: boolean;
}

export default function QuestionPage() {
  const { id, questionId } = useParams<{
    id: string;
    questionId: string;
  }>();
  const router = useRouter();

  const { data: lesson, isLoading, isError } = useGetLesson(id);
  const { mutate: submitLesson, isPending: isSubmitting } = useSubmitLesson(id);

  const [answer, setAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Calculate if the answer was correct using explicit API field
  const isAnswerCorrect = useCallback((): boolean => {
    if (!resultData) return false;

    // Use the explicit isCorrect field from the API response
    return resultData.isCorrect ?? false;
  }, [resultData]);

  // Calculate correct answers for the LessonResult component
  const calculateCorrectAnswers = (): number => {
    // Use the isAnswerCorrect function to determine correctness
    // This function properly handles the case where a correct answer was
    // submitted to a problem already answered correctly before
    return isAnswerCorrect() ? 1 : 0;
  };

  // Redirect if lesson not found
  useEffect(() => {
    if (isError) {
      router.push("/404");
    }
  }, [isError, router]);

  // Auto-navigate to next question if answer was correct
  useEffect(() => {
    if (submitted && resultData) {
      const answerWasCorrect = isAnswerCorrect();

      if (answerWasCorrect) {
        // Show result for 1.5 seconds before navigating
        setShowResult(true);
        const timer = setTimeout(() => {
          if (lesson && lesson.problems) {
            const problemIndex = lesson.problems.findIndex(
              (p) => p.id === questionId,
            );
            if (problemIndex < lesson.problems.length - 1) {
              router.push(
                `/lessons/${id}/${lesson.problems[problemIndex + 1].id}`,
              );
            } else {
              // Last question, go back to lesson overview
              router.push(`/lessons/${id}`);
            }
          }
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [submitted, resultData, lesson, questionId, id, router, isAnswerCorrect]);

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[calc(100vh-80px] items-center justify-center px-4 py-8">
        <LoadingState message="Loading question..." />
      </div>
    );
  }

  if (!lesson) {
    return notFound();
  }

  // Find the current problem
  const currentProblem = lesson.problems.find((p) => p.id === questionId);
  const problemIndex = lesson.problems.findIndex((p) => p.id === questionId);

  // If questionId doesn't match any problem in this lesson
  if (!currentProblem || problemIndex === -1) {
    return notFound();
  }

  // Calculate progress within this lesson
  const progressPercentage = lesson.percentage;

  const handleSubmit = () => {
    // Submit just this one answer as if it's the entire lesson
    submitLesson(
      {
        param: { id },
        json: {
          attemptId: `${id}-${questionId}-${Date.now()}`,
          answers: [
            {
              problemId: questionId,
              answer: answer,
            },
          ],
        },
      },
      {
        onSuccess: (response) => {
          setResultData(response.data);
          setSubmitted(true);
          // For incorrect answers, we show the result inline
          // For correct answers, we show the result in a modal
          // Use the explicit isCorrect field from the API response
          const answerWasCorrect = response.data.isCorrect ?? false;

          if (!answerWasCorrect) {
            setShowResult(false); // Show inline feedback for incorrect answers
          }
        },
        onError: (error) => {
          console.error("Submission error:", error);
          // Reset submission state on error to allow retry
          setSubmitted(false);
          setResultData(null);
        },
      },
    );
  };

  const handlePrevious = () => {
    if (problemIndex > 0) {
      router.push(`/lessons/${id}/${lesson.problems[problemIndex - 1].id}`);
    } else {
      router.push(`/lessons/${id}`);
    }
  };

  const handleNext = () => {
    if (problemIndex < lesson.problems.length - 1) {
      router.push(`/lessons/${id}/${lesson.problems[problemIndex + 1].id}`);
    } else {
      // Last question, go back to lesson overview
      router.push(`/lessons/${id}`);
    }
  };

  const handleAnswer = (problemId: string, selectedAnswer: string) => {
    setAnswer(selectedAnswer);
    // If we're showing the retry UI (submitted with incorrect answer),
    // reset the submission state when user selects a new answer
    if (submitted && resultData) {
      const answerWasCorrect = isAnswerCorrect();
      if (!answerWasCorrect) {
        // Reset submission state to allow resubmission
        setSubmitted(false);
        setResultData(null);
        setShowResult(false);
      }
    }
  };

  // Show the LessonResult modal for correct answers
  if (showResult && resultData) {
    const correctAnswers = calculateCorrectAnswers();
    return (
      <>
        {/* Show the question page in the background */}
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-gray-600">
                      {lesson.description || "No description available"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/lessons/${id}`)}
                  >
                    Back to Lesson
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Question {problemIndex + 1} of {lesson.problems.length}
                  </span>
                  <span className="text-sm font-medium">
                    Progress: {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </CardHeader>
              <CardContent>
                <ProblemSolver
                  problem={currentProblem}
                  onAnswer={handleAnswer}
                  selectedAnswer={answer}
                />

                <div className="mt-6 flex justify-between">
                  <Button onClick={handlePrevious} variant="outline">
                    {problemIndex === 0 ? "Back to Lesson" : "Previous"}
                  </Button>
                  <div className="space-x-2">
                    {problemIndex < lesson.problems.length - 1 && (
                      <Button onClick={handleNext} variant="outline">
                        Skip
                      </Button>
                    )}
                    <Button
                      onClick={handleSubmit}
                      disabled={!answer || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Show the result modal on top */}
        <LessonResult
          xp={resultData.xp}
          totalXp={resultData.totalXp}
          streak={resultData.streak}
          correctAnswers={correctAnswers}
          totalQuestions={1} // Only one question on this page
          onContinue={() => {}} // Auto-continue handled by useEffect
        />
      </>
    );
  }

  // Show inline feedback for incorrect answers or before submission
  if (submitted && resultData) {
    // const correctAnswers = calculateCorrectAnswers();
    const answerWasCorrect = isAnswerCorrect();

    // If answer was incorrect, show inline feedback and allow retry
    if (!answerWasCorrect) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      {lesson.title}
                    </CardTitle>
                    <p className="text-gray-600">
                      {lesson.description || "No description available"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/lessons/${id}`)}
                  >
                    Back to Lesson
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Question {problemIndex + 1} of {lesson.problems.length}
                  </span>
                  <span className="text-sm font-medium">
                    Progress: {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="mt-2 h-2" />
              </CardHeader>
              <CardContent>
                <div className="mb-6 rounded-lg bg-red-50 p-4">
                  <h3 className="font-medium text-red-800">Incorrect Answer</h3>
                  <p className="mt-1 text-red-700">
                    Your answer was not correct. Please try again.
                  </p>
                </div>

                <ProblemSolver
                  problem={currentProblem}
                  onAnswer={handleAnswer}
                  selectedAnswer={answer}
                />

                <div className="mt-6 flex justify-between">
                  <Button onClick={handlePrevious} variant="outline">
                    {problemIndex === 0 ? "Back to Lesson" : "Previous"}
                  </Button>
                  <div className="space-x-2">
                    <Button
                      onClick={handleSubmit}
                      disabled={!answer || isSubmitting}
                    >
                      {isSubmitting ? "Checking..." : "Try Again"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {lesson.title}
                </CardTitle>
                <p className="text-gray-600">
                  {lesson.description || "No description available"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/lessons/${id}`)}
              >
                Back to Lesson
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Question {problemIndex + 1} of {lesson.problems.length}
              </span>
              <span className="text-sm font-medium">
                Progress: {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="mt-2 h-2" />
          </CardHeader>
          <CardContent>
            <ProblemSolver
              problem={currentProblem}
              onAnswer={handleAnswer}
              selectedAnswer={answer}
            />

            <div className="mt-6 flex justify-between">
              <Button onClick={handlePrevious} variant="outline">
                {problemIndex === 0 ? "Back to Lesson" : "Previous"}
              </Button>
              <div className="space-x-2">
                {problemIndex < lesson.problems.length - 1 && (
                  <Button onClick={handleNext} variant="outline">
                    Skip
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!answer || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
