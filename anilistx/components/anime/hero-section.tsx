"use client";

import { useTopAnime } from "@/lib/hooks-axios";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Tv, Users } from "lucide-react";

export function HeroSection() {
  const { data, isLoading } = useTopAnime("bypopularity", 1, 1);
  const anime = data?.data[0];

  return (
    <section className="relative overflow-hidden rounded-xl">
      {!isLoading && anime && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 p-6 md:p-10">
            <div className="shrink-0 w-48 md:w-64 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                width={256}
                height={384}
                className="w-full h-auto"
                priority
              />
            </div>

            <div className="flex flex-col gap-4 text-white max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold">{anime.title}</h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-xl text-gray-300">{anime.title_english}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{anime.score} ({anime.scored_by.toLocaleString()} votes)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tv className="h-4 w-4" />
                  <span>{anime.episodes ? `${anime.episodes} episodes` : 'Unknown'}</span>
                </div>
                {anime.season && anime.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{anime.members.toLocaleString()} members</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Link
                    key={genre.mal_id}
                    href={`/search?genres=${genre.mal_id}`}
                    className="inline-flex rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-medium transition"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <p className="text-sm md:text-base line-clamp-4 md:line-clamp-5 text-gray-300">
                {anime.synopsis}
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <Button asChild>
                  <Link href={`/anime/${anime.mal_id}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link href="/search">
                    Explore More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {isLoading && (
        <div className="bg-card h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-48 h-6 bg-muted rounded"></div>
            <div className="w-64 h-4 bg-muted rounded"></div>
            <div className="mt-4 w-32 h-10 bg-primary/50 rounded"></div>
          </div>
        </div>
      )}
    </section>
  );
} 