"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

import { LevelProgressBar } from "@/components/common/level-progress-bar";
import { LoadingState } from "@/components/common/loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { useCurrentAccount } from "@/features/accounts/api/use-current-user";
import { SignOutButton } from "@/features/accounts/components/sign-out-button";
import { useGetLessons } from "@/features/lessons/api/use-get-lessons";
import { useGetProfile } from "@/features/profile/api/use-get-profile";

export default function ProfilePage() {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useCurrentAccount();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useGetProfile();
  const { data: lessons, isLoading: isLessonsLoading } = useGetLessons();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isUserLoading && (!user || isUserError)) {
      redirect("/auth/sign-in");
    }
  }, [user, isUserLoading, isUserError]);

  // Show loading state
  if (isUserLoading || isProfileLoading || isLessonsLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <LoadingState message="Loading your profile..." />
      </div>
    );
  }

  // If authentication or data fetching failed, we'll redirect or return null
  if (!user || isUserError || !profile || isProfileError || !lessons) {
    return null;
  }

  const totalLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) => lesson.completed).length;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-violet-500 text-4xl font-bold text-white">
            {user.user?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.user?.username}
          </h1>
          <p className="mt-2 text-gray-600">{user.user?.email}</p>
        </div>

        {/* Level Progress Bar */}
        <div className="mb-8 rounded-lg bg-blue-50 p-4">
          <LevelProgressBar
            level={profile.level ?? 1}
            xpIntoLevel={profile.xpIntoLevel ?? 0}
            xpForNextLevel={profile.xpForNextLevel ?? 100}
            levelProgress={profile.levelProgress ?? 0}
            showDetails={true}
            size="lg"
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Total XP</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-violet-600">
                {profile.totalXP || 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Current Streak</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-orange-500">
                {profile.streak?.current ?? 0}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Longest: {profile.streak?.longest ?? 0}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-blue-500">
                {Math.round(progressPercentage)}%
              </p>
              <p className="mt-2 text-sm text-gray-500">
                {completedLessons} of {totalLessons} lessons
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm text-gray-600">
                  <span>Completion</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="my-4 flex w-full items-center justify-end">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
