"use client";

import { cn } from "@/lib/utils";

interface AnimeCardSkeletonProps {
  size?: "sm" | "md" | "lg";
}

export function AnimeCardSkeleton({ size = "md" }: AnimeCardSkeletonProps) {
  const imageSizes = {
    sm: "h-[200px]",
    md: "h-[270px]",
    lg: "h-[350px]",
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow">
      <div className={cn("animate-pulse bg-muted", imageSizes[size])} />
      <div className="flex flex-col space-y-2 p-4">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="flex gap-1">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
} 