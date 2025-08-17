"use client";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGetProfile } from "@/features/profile/api/use-get-profile";

interface LessonResultProps {
  xp: number;
  totalXp: number;
  streak: number;
  correctAnswers: number;
  totalQuestions: number;
  onContinue: () => void;
}

export const LessonResult = ({
  xp,
  totalXp,
  streak,
  correctAnswers,
  totalQuestions,
  onContinue,
}: LessonResultProps) => {
  const { data: userProfile } = useGetProfile();
  const [longestStreak, setLongestStreak] = useState(0);

  // Update longest streak when user profile data is available
  useEffect(() => {
    if (userProfile?.streak?.longest !== undefined) {
      setLongestStreak(userProfile.streak.longest);
    }
  }, [userProfile]);

  // Trigger confetti for perfect score
  useEffect(() => {
    if (correctAnswers === totalQuestions) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [correctAnswers, totalQuestions]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {correctAnswers === totalQuestions
              ? "Perfect Score! 🎉"
              : correctAnswers > totalQuestions / 2
                ? "Good Job! 👍"
                : "Keep Practicing! 💪"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{xp}</div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
            </div>

            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Streak</span>
                <span className="text-xl font-bold text-orange-600">
                  {streak}
                </span>
              </div>
              {streak > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {streak === longestStreak
                    ? "New personal best! 🔥"
                    : `Just ${longestStreak - streak} more to beat your record!`}
                </div>
              )}
            </div>

            <div className="rounded-lg bg-purple-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total XP</span>
                <span className="text-xl font-bold text-purple-600">
                  {totalXp}
                </span>
              </div>
            </div>

            <Button onClick={onContinue} className="w-full">
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
