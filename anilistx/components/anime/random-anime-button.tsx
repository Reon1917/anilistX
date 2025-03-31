"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export function RandomAnimeButton({ className }: { className?: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRandomAnime = async () => {
    try {
      setIsLoading(true);
      // We'll get a random anime ID from 1 to 40000 (a reasonable range in MyAnimeList)
      const randomId = Math.floor(Math.random() * 40000) + 1;
      router.push(`/anime/${randomId}`);
    } catch (error) {
      console.error("Error navigating to random anime:", error);
    } finally {
      // We don't set loading to false here because we're navigating away
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
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <Shuffle className="h-[1.2rem] w-[1.2rem]" />
            </motion.div>
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