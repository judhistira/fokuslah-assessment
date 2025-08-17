import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "skeleton";
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  size = "md",
  variant = "spinner",
  className = "",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  };

  if (variant === "skeleton") {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className={`animate-pulse rounded-full bg-gray-200 ${sizeClasses[size]}`} />
        {message && (
          <p className="text-sm text-gray-500">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      {message && (
        <p className="text-sm text-gray-500">{message}</p>
      )}
    </div>
  );
}