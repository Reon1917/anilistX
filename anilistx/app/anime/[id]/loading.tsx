"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingAnimation } from "@/components/ui/loading-animation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnimeDetailsLoading() {
  return (
    <div className="container py-8 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg bg-muted flex items-center justify-center">
            <LoadingAnimation size="lg" />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          
          <div className="flex flex-wrap gap-2 my-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
          
          <div className="flex items-center gap-6 my-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="h-10 w-40" />

          <div className="space-y-2 mt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: More Details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array(10).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 