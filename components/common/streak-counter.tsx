import { Flame } from "lucide-react";

interface StreakCounterProps {
  streak: number;
  longestStreak: number;
}

export const StreakCounter = ({
  streak,
  longestStreak,
}: StreakCounterProps) => {
  return (
    <div className="flex items-center space-x-4 rounded-full bg-orange-50 px-4 py-2">
      <div className="flex items-center space-x-1">
        <Flame className="text-orange-500" size={20} />
        <span className="font-bold text-orange-700">{streak}</span>
      </div>
      <span className="text-sm text-gray-500">Longest: {longestStreak}</span>
    </div>
  );
};
