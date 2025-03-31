"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export function RandomAnimeButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomAnime = async () => {
    try {
      setIsLoading(true);
      
      // Use the Jikan API random endpoint instead of generating a random ID
      const response = await fetch('https://api.jikan.moe/v4/random/anime');
      
      if (!response.ok) {
        throw new Error(`Error fetching random anime: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.mal_id) {
        router.push(`/anime/${data.data.mal_id}`);
      } else {
        throw new Error('Failed to get a valid anime ID');
      }
    } catch (error) {
      console.error("Error fetching random anime:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to find a random anime. Please try again.",
        variant: "destructive",
      });
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