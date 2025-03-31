'use client';

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimeSearchResults } from "@/components/collection/anime-search-results";
import { SelectedAnimeDetails } from "@/components/collection/selected-anime-details";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type AddAnimeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddAnimeDialog({ open, onOpenChange }: AddAnimeDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<any | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Base Jikan API URL
      const url = new URL('https://api.jikan.moe/v4/anime');
      // Add search query
      url.searchParams.append('q', searchQuery);
      // Sort by popularity to get most relevant results first
      url.searchParams.append('order_by', 'popularity');
      // Limit to 20 results
      url.searchParams.append('limit', '20');
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching anime:', error);
      setSearchError('Failed to search anime. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSelectAnime = (anime: any) => {
    setSelectedAnime(anime);
  };
  
  const handleBackToSearch = () => {
    setSelectedAnime(null);
  };
  
  const handleAddAnime = async (status: string, score: number) => {
    if (!selectedAnime) return;
    
    setIsAdding(true);
    
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("You must be logged in to add anime to your collection");
      }
      
      const anime = {
        user_id: user.id,
        anime_id: selectedAnime.mal_id,
        title: selectedAnime.title,
        image_url: selectedAnime.images.jpg.image_url || selectedAnime.images.webp.image_url,
        type: selectedAnime.type || 'TV',
        episodes: selectedAnime.episodes || 0,
        status,
        score,
        year: selectedAnime.year || null,
        studio: selectedAnime.studios && selectedAnime.studios.length > 0 ? 
          selectedAnime.studios[0].name : null,
        mal_score: selectedAnime.score || null
      };
      
      const { error: insertError } = await supabase
        .from("anime_lists")
        .upsert(anime, { onConflict: "user_id,anime_id" });
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      toast.success("Anime added", {
        description: `${selectedAnime.title} has been added to your collection.`,
      });
      
      router.refresh();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to add anime to collection",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{selectedAnime ? "Add to Collection" : "Search Anime"}</DialogTitle>
        </DialogHeader>
        
        {!selectedAnime ? (
          <>
            <div className="relative">
              <Input
                placeholder="Search anime by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
              />
              {searchQuery && (
                <button
                  className="absolute right-10 top-0 h-full flex items-center px-2 text-muted-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            {searchError && (
              <p className="text-sm text-destructive">{searchError}</p>
            )}
            
            <AnimeSearchResults
              results={searchResults}
              loading={isSearching}
              onSelect={handleSelectAnime}
            />
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <SelectedAnimeDetails
            anime={selectedAnime}
            onBack={handleBackToSearch}
            onAdd={handleAddAnime}
            isAdding={isAdding}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 