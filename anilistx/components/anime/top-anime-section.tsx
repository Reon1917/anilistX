"use client";

import { FC } from "react";
import { useTopAnime } from "@/lib/api-hooks";
import { AnimeCard } from "@/components/anime/anime-card";
import { AnimeCardSkeleton } from "@/components/anime/anime-card-skeleton";

export function TopAnimeSection() {
  const { data, isLoading, isError } = useTopAnime("", 1, 10);

  if (isError) {
    return (
      <div className="flex justify-center p-8 text-muted-foreground">
        Failed to load top anime. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {isLoading
        ? Array(10)
            .fill(null)
            .map((_, index) => <AnimeCardSkeleton key={index} />)
        : data?.data.map((anime, index) => (
            <AnimeCard key={`${anime.mal_id}-${index}`} anime={anime} size="md" />
          ))}
    </div>
  );
} 