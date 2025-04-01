"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSeasonalAnime } from "@/lib/api-hooks";
import { AnimeCard } from "@/components/anime/anime-card";
import { AnimeCardSkeleton } from "@/components/anime/anime-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SEASONS = ["winter", "spring", "summer", "fall"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function SeasonalPage() {
  // Get current season and year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  const getCurrentSeason = () => {
    const month = currentDate.getMonth() + 1;
    if (month >= 1 && month <= 3) return "winter";
    if (month >= 4 && month <= 6) return "spring";
    if (month >= 7 && month <= 9) return "summer";
    return "fall";
  };
  
  const [year, setYear] = useState<number | undefined>(undefined);
  const [season, setSeason] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  
  const isCurrentSeason = !year && !season;
  const displayYear = year || currentYear;
  const displaySeason = season || getCurrentSeason();
  
  // Create a key that changes whenever year or season changes to force refetch
  const requestKey = `${displayYear}-${displaySeason}-${page}`;
  
  // Loading timeout handling
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // State to track retry attempts
  const [retryCount, setRetryCount] = useState(0);
  
  // Get the data using our improved hook that handles caching correctly
  const { data, isLoading, isError, refresh } = useSeasonalAnime(year, season, page, 25, retryCount);
  
  // Setup loading timeout to detect stuck loading states
  useEffect(() => {
    if (isLoading) {
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      // Set a new timeout to auto-retry if loading takes too long
      loadingTimeoutRef.current = setTimeout(() => {
        console.log('Loading timeout - auto retrying...');
        setRetryCount(prev => prev + 1);
      }, 10000); // 10 seconds timeout
    } else {
      // Clear timeout when not loading
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);
  
  // Function to retry fetching data
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    refresh();
  }, [refresh]);
  
  const navigatePrevSeason = () => {
    if (!year && !season) {
      // If on current season, navigate to previous season
      const currSeason = getCurrentSeason();
      const seasonIndex = SEASONS.indexOf(currSeason);
      
      if (seasonIndex === 0) {
        // If winter, go to fall of previous year
        setYear(currentYear - 1);
        setSeason("fall");
      } else {
        // Else go to previous season of current year
        setYear(currentYear);
        setSeason(SEASONS[seasonIndex - 1]);
      }
    } else {
      const seasonIndex = SEASONS.indexOf(displaySeason);
      if (seasonIndex === 0) {
        // If winter, go to fall of previous year
        setYear(displayYear - 1);
        setSeason("fall");
      } else {
        // Else go to previous season of current year
        setSeason(SEASONS[seasonIndex - 1]);
      }
    }
    setPage(1);
  };
  
  const navigateNextSeason = () => {
    if (isCurrentSeason) return; // Can't go to future season
    
    const seasonIndex = SEASONS.indexOf(displaySeason);
    if (seasonIndex === 3) {
      // If fall, go to winter of next year
      setYear(displayYear + 1);
      setSeason("winter");
    } else {
      // Else go to next season of current year
      setSeason(SEASONS[seasonIndex + 1]);
    }
    setPage(1);
  };
  
  const resetToCurrentSeason = () => {
    setYear(undefined);
    setSeason(undefined);
    setPage(1);
  };
  
  const canGoNext = !isCurrentSeason && !(displayYear === currentYear && displaySeason === getCurrentSeason());
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Seasonal Anime</h1>
          {!isCurrentSeason && (
            <Button variant="outline" onClick={resetToCurrentSeason}>
              Current Season
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          Discover anime from different seasons throughout the years.
        </p>
      </div>
      
      {/* Season selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={navigatePrevSeason}
            title="Previous Season"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={season || getCurrentSeason()}
              onValueChange={(value) => {
                setSeason(value === getCurrentSeason() && !year ? undefined : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="winter">Winter</SelectItem>
                <SelectItem value="spring">Spring</SelectItem>
                <SelectItem value="summer">Summer</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={String(year || currentYear)}
              onValueChange={(value) => {
                const newYear = parseInt(value);
                setYear(newYear === currentYear && !season ? undefined : newYear);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={navigateNextSeason}
            disabled={!canGoNext}
            title="Next Season"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-sm font-medium">
          {displaySeason.charAt(0).toUpperCase() + displaySeason.slice(1)} {displayYear}
          {isCurrentSeason && " (Current Season)"}
        </div>
      </div>
      
      {/* Results */}
      <div className="space-y-6">
        {isError ? (
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">Error loading anime</h3>
            <p className="text-muted-foreground mb-4">
              There was an error loading the seasonal anime. Please try again.
            </p>
            <Button onClick={handleRetry}>Retry</Button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(15)
              .fill(null)
              .map((_, index) => (
                <AnimeCardSkeleton key={index} />
              ))}
          </div>
        ) : data?.data.length === 0 ? (
          <div className="bg-card rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium mb-2">No anime found</h3>
            <p className="text-muted-foreground mb-4">
              There are no anime listed for this season yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {data?.data.map((anime, index) => (
                <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} />
              ))}
            </div>
            
            {/* Pagination */}
            {data?.pagination && data.pagination.last_visible_page > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, data.pagination.last_visible_page) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={i}
                          variant={pageNum === page ? "default" : "outline"}
                          className="w-10"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                  {data.pagination.last_visible_page > 5 && (
                    <span className="px-2">...</span>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === data.pagination.last_visible_page}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 