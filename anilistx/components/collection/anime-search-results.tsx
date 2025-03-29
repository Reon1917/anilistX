'use client';

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type AnimeSearchResultsProps = {
  results: any[];
  loading: boolean;
  onSelect: (anime: any) => void;
};

export function AnimeSearchResults({ results, loading, onSelect }: AnimeSearchResultsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <ScrollArea className="max-h-[400px] pr-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {results.map((anime) => (
          <Card 
            key={anime.mal_id}
            className="overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary"
            onClick={() => onSelect(anime)}
          >
            <div className="flex h-24">
              <div className="w-16 h-24 relative flex-shrink-0">
                <Image
                  src={anime.images.jpg.image_url || '/placeholder-anime.jpg'}
                  alt={anime.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-sm line-clamp-1">{anime.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {anime.studios.length > 0 && anime.studios[0].name}
                    {anime.year && ` • ${anime.year}`}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    {anime.type || 'TV'}
                  </span>
                  {anime.score && (
                    <span className="text-xs text-muted-foreground">
                      ★ {anime.score}
                    </span>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
} 