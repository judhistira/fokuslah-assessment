"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LessonCard } from "@/components/common/lesson-card";
import { LevelProgressBar } from "@/components/common/level-progress-bar";
import { LoadingState } from "@/components/common/loading-state";
import { StreakCounter } from "@/components/common/streak-counter";
import { StreakIndicator } from "@/components/common/streak-indicator";

import { useCurrentAccount } from "@/features/accounts/api/use-current-user";
import { useGetLessons } from "@/features/lessons/api/use-get-lessons";
import { useGetProfile } from "@/features/profile/api/use-get-profile";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentAccount();
  const { data: lessons, isLoading: isLessonsLoading, isError: isLessonsError } = useGetLessons();
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError } = useGetProfile();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!isUserLoading && (!user || isUserError)) {
      router.push("/auth/sign-in");
    }
  }, [user, isUserLoading, isUserError, router]);

  // Show loading state only for authentication
  if (isUserLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <LoadingState message="Loading your dashboard..." />
      </div>
    );
  }

  // If authentication failed, we'll redirect in the effect above
  if (!user || isUserError) {
    return null;
  }

  // Show errors for non-critical data
  if (isLessonsError || isProfileError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Math Lessons</h1>
            <p className="mt-2 text-gray-600">
              Practice math skills and earn points!
            </p>
          </div>
          <div className="text-red-500">
            {isLessonsError ? "Failed to load lessons" : "Failed to load profile"}
          </div>
        </div>
        <div className="text-red-500">
          Error loading dashboard data. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Math Lessons</h1>
          <p className="mt-2 text-gray-600">
            Practice math skills and earn points!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {isProfileLoading ? (
            <LoadingState variant="skeleton" size="sm" />
          ) : (
            <>
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-500">Level</span>
                <span className="text-xl font-bold text-blue-600">{profile?.level ?? 1}</span>
              </div>
              <StreakCounter
                streak={profile?.streak?.current ?? 0}
                longestStreak={profile?.streak?.longest ?? 0}
              />
            </>
          )}
        </div>
      </div>

      {/* Level Progress - show only when profile data is loaded */}
      {!isProfileLoading && profile && (
        <div className="mb-6 rounded-lg bg-blue-50 p-4">
          <LevelProgressBar
            level={profile.level ?? 1}
            xpIntoLevel={profile.xpIntoLevel ?? 0}
            xpForNextLevel={profile.xpForNextLevel ?? 100}
            levelProgress={profile.levelProgress ?? 0}
            showDetails={true}
            size="md"
          />
        </div>
      )}

      {/* Streak indicator - show only when profile data is loaded */}
      {!isProfileLoading && profile && (
        <div className="mb-8">
          <StreakIndicator
            streak={profile.streak?.current ?? 0}
            hasActivityToday={profile.hasActivityToday ?? false}
          />
        </div>
      )}

      {isLessonsLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <LoadingState key={i} variant="skeleton" className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons?.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}
