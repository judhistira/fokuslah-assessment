import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LeaderboardPage() {
  const userId = await getServerSession();

  if (!userId) {
    redirect("/auth/sign-in");
  }

  // Get top users by XP
  const topUsers = await prisma.userProfile.findMany({
    orderBy: {
      totalXP: "desc",
    },
    take: 10,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  // Get current user's rank
  const currentUserProfile = await prisma.userProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  // Calculate user's rank
  const userRank = currentUserProfile
    ? (await prisma.userProfile.count({
        where: {
          totalXP: {
            gt: currentUserProfile.totalXP,
          },
        },
      })) + 1
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Leaderboard
        </h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-center">Your Rank</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUserProfile && userRank ? (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold text-gray-900">
                    #{userRank}
                  </div>
                  <Avatar>
                    <AvatarFallback>
                      {currentUserProfile.user.username
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {currentUserProfile.user.username}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {currentUserProfile.totalXP} XP
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Complete lessons to appear on the leaderboard
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Learners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.map((userProfile, index) => (
                <div
                  key={userProfile.userId}
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    userProfile.userId === userId
                      ? "border border-green-200 bg-green-50"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`text-xl font-bold ${
                        index === 0
                          ? "text-yellow-500"
                          : index === 1
                            ? "text-gray-400"
                            : index === 2
                              ? "text-amber-700"
                              : "text-gray-900"
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {userProfile.user.username?.charAt(0)?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">
                        {userProfile.user.username}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      {userProfile.totalXP} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
