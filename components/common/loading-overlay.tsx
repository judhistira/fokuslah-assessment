"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  message?: string;
  fullscreen?: boolean;
  className?: string;
}

export function LoadingOverlay({ 
  message = "Loading...", 
  fullscreen = false,
  className 
}: LoadingOverlayProps) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <p className="text-lg font-medium text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
    </div>
  );
}