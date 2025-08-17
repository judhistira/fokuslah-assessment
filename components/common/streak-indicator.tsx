import { Flame } from "lucide-react";

interface StreakIndicatorProps {
  streak: number;
  hasActivityToday: boolean;
}

export const StreakIndicator = ({
  streak,
  hasActivityToday,
}: StreakIndicatorProps) => {
  if (hasActivityToday) {
    return (
      <div className="flex items-center space-x-2 rounded-lg bg-green-50 px-3 py-2">
        <Flame className="text-green-500" size={16} />
        <span className="text-sm font-medium text-green-700">
          Great job! You&apos;ve kept your {streak}-day streak alive! 🔥
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-orange-50 px-3 py-2">
      <Flame className="text-orange-500" size={16} />
      <span className="text-sm font-medium text-orange-700">
        Complete a lesson today to keep your {streak}-day streak going! 💪
      </span>
    </div>
  );
};
