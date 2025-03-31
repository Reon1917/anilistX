"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function RandomAnimeButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requestTimedOut, setRequestTimedOut] = useState(false);

  // Reset loading state after a timeout (safety mechanism)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      // Auto-reset after 8 seconds in case navigation doesn't happen
      timeoutId = setTimeout(() => {
        setIsLoading(false);
        setRequestTimedOut(true);
        toast.error("Request timed out. The request is taking too long. Please try again.");
      }, 8000);
    }
    
    // Cleanup timeout on component unmount or when loading state changes
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Reset timeout flag when component is interacted with
  const resetState = useCallback(() => {
    setRequestTimedOut(false);
  }, []);

  const handleRandomAnime = async () => {
    // Don't allow new requests while loading
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      resetState();
      
      // Use the Jikan API random endpoint instead of generating a random ID
      const response = await fetch('https://api.jikan.moe/v4/random/anime', {
        cache: 'no-store' // Ensure we get a fresh random anime each time
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching random anime: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.mal_id) {
        const animeId = data.data.mal_id;
        
        // We use a small timeout before navigation to ensure animations can be seen
        setTimeout(() => {
          // Reset loading state before navigation in case the page transition is slow
          setIsLoading(false);
          router.push(`/anime/${animeId}`);
        }, 500);
      } else {
        throw new Error('Failed to get a valid anime ID');
      }
    } catch (error) {
      console.error("Error fetching random anime:", error);
      setIsLoading(false);
      toast.error("Failed to find a random anime. Please try again.");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRandomAnime}
            disabled={isLoading}
            className={className}
            onMouseEnter={resetState}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="flex items-center justify-center"
              >
                <Shuffle className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <Shuffle className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            )}
            <span className="sr-only">Random Anime</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Discover a random anime</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 