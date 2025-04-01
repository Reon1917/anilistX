'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAnimeSearch } from '@/lib/api-hooks';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Handle clicks outside of search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch search results
  const { anime, isLoading } = useAnimeSearch(debouncedQuery);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearching(false);
    }
  };
  
  return (
    <div className="relative w-full max-w-xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Search anime..."
          className="pr-24"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.length > 2) setIsSearching(true);
          }}
          onFocus={() => {
            if (searchQuery.length > 2) setIsSearching(true);
          }}
        />
        
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 top-0 h-full"
            onClick={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1 bottom-1"
        >
          <Search className="h-4 w-4 mr-1" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Search</span>
        </Button>
      </form>
      
      {isSearching && debouncedQuery.length >= 3 && (
        <Card className="absolute top-full left-0 right-0 mt-1 p-2 max-h-[80vh] overflow-y-auto z-50">
          <div className="space-y-1">
            {isLoading ? (
              <div className="py-2 px-4 text-center">
                <div className="animate-pulse">Searching...</div>
              </div>
            ) : anime && anime.length > 0 ? (
              <>
                {anime.slice(0, 5).map((item) => (
                  <Link
                    key={item.mal_id}
                    href={`/anime/${item.mal_id}`}
                    className="flex items-center gap-3 p-2 hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsSearching(false)}
                  >
                    <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded-sm">
                      <Image
                        src={item.images.jpg.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium line-clamp-1">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.type} • {item.episodes ? `${item.episodes} eps` : 'Unknown eps'} • {item.status}
                      </span>
                    </div>
                  </Link>
                ))}
                <div className="py-2 px-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                      setIsSearching(false);
                    }}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>View all results for "{searchQuery}"</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No results found for "{debouncedQuery}"</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
} 