"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Play } from "lucide-react";
import { AnimeBasic } from "@/lib/jikan";
import { cn } from "@/lib/utils";
import { AddToCollectionButton } from "@/components/collection/add-to-collection-button";

interface AnimeCardProps {
  anime: AnimeBasic;
  size?: "sm" | "md" | "lg";
}

export function AnimeCard({ anime, size = "md" }: AnimeCardProps) {
  const imageSizes = {
    sm: "h-[200px]",
    md: "h-[270px]",
    lg: "h-[350px]",
  };

  const titleClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all duration-300 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-1 hover:border-primary/50">
      <Link href={`/anime/${anime.mal_id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {anime.title}</span>
      </Link>

      <div className={cn("relative overflow-hidden", imageSizes[size])}>
        <Image
          src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="line-clamp-3 text-sm">{anime.synopsis}</div>
          
          <div 
            className="mt-2 z-20 relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <AddToCollectionButton 
              animeData={anime}
              variant="secondary"
              size="sm"
              className="w-full"
            />
          </div>
        </div>

        {anime.score > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{anime.score.toFixed(1)}</span>
          </div>
        )}

        {anime.episodes && (
          <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
            <Play className="h-3 w-3" />
            <span>{anime.episodes} eps</span>
          </div>
        )}

        {anime.season && anime.year && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Calendar className="h-3 w-3" />
            <span>
              {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1.5 p-4">
        <h3 className={cn("line-clamp-2 font-semibold leading-tight transition-colors duration-300 group-hover:text-primary", titleClass[size])}>
          {anime.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre.mal_id}
              className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium transition-all duration-300 hover:bg-primary/20"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 