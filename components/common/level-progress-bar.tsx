import { Progress } from "@/components/ui/progress";

interface LevelProgressBarProps {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  levelProgress: number;
  showDetails?: boolean;
  size?: "sm" | "md" | "lg";
}

export const LevelProgressBar = ({ 
  level, 
  xpIntoLevel, 
  xpForNextLevel, 
  levelProgress,
  showDetails = true,
  size = "md"
}: LevelProgressBarProps) => {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };
  
  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="w-full">
      {showDetails && (
        <div className="mb-1 flex items-center justify-between">
          <span className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
            Level {level}
          </span>
          <span className={`text-gray-500 ${textSizeClasses[size]}`}>
            {xpIntoLevel} / {xpForNextLevel} XP
          </span>
        </div>
      )}
      <Progress 
        value={levelProgress} 
        className={`${sizeClasses[size]} w-full`} 
      />
      {showDetails && (
        <div className={`mt-1 text-right text-gray-500 ${textSizeClasses[size]}`}>
          {Math.round(levelProgress)}% to Level {level + 1}
        </div>
      )}
    </div>
  );
};