"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { useAnimeSearch } from '@/lib/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

// Define the anime item type
interface AnimeItem {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    }
  };
  score?: number;
  type?: string;
  episodes?: number;
  status?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [currentQuery, setCurrentQuery] = useState(query);
  
  // Reset current query when URL param changes
  useEffect(() => {
    setCurrentQuery(query);
  }, [query]);
  
  const { anime, isLoading, isError } = useAnimeSearch(currentQuery);
  
  return (
    <main className="container py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Search Results for "{query}"</h1>
        <p className="text-muted-foreground">
          {!isLoading && anime ? `Found ${anime.length} results` : 'Searching...'}
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-[3/4] relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-xl font-semibold mb-2">Failed to load search results</p>
          <p className="text-muted-foreground mb-6">Please try again later</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : anime && anime.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {anime.map((item: AnimeItem) => (
            <Card key={item.mal_id} className="overflow-hidden transition-all hover:shadow-md">
              <Link href={`/anime/${item.mal_id}`} className="block">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={item.images.jpg.large_image_url || item.images.jpg.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {item.score && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold py-1 px-2 rounded">
                      ★ {item.score}
                    </div>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background/90"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
              <CardContent className="p-3">
                <Link href={`/anime/${item.mal_id}`} className="block">
                  <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {item.type} • {item.episodes ? `${item.episodes} eps` : 'Unknown eps'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.status === 'Currently Airing' ? 'Airing' : item.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl font-semibold mb-2">No results found</p>
          <p className="text-muted-foreground mb-6">Try a different search term</p>
        </div>
      )}
    </main>
  );
} 