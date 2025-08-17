interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export const LevelBadge = ({ level, size = "md" }: LevelBadgeProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg"
  };
  
  const fontSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="inline-flex flex-col items-center">
      <div className={`flex items-center justify-center rounded-full bg-blue-500 font-bold text-white ${sizeClasses[size]}`}>
        {level}
      </div>
      <span className={`mt-1 text-gray-500 ${fontSizeClasses[size]}`}>
        Level
      </span>
    </div>
  );
};