"use client";

import { useState } from "react";
import { useTopAnime } from "@/lib/hooks-wrapper";
import { AnimeCard } from "@/components/anime/anime-card";
import { AnimeCardSkeleton } from "@/components/anime/anime-card-skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TOP_FILTERS = [
  { label: "All Anime", value: "all" },
  { label: "Airing", value: "airing" },
  { label: "Upcoming", value: "upcoming" },
  { label: "TV Series", value: "tv" },
  { label: "Movies", value: "movie" },
  { label: "OVAs", value: "ova" },
  { label: "Specials", value: "special" },
  { label: "By Popularity", value: "bypopularity" },
  { label: "By Favorites", value: "favorite" },
];

export default function TopAnimePage() {
  const [activeTab, setActiveTab] = useState<"all" | "bypopularity" | "favorite">("all");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  
  // Map tabs to filter values
  const getFilterValue = () => {
    if (activeTab === "bypopularity") return "bypopularity";
    if (activeTab === "favorite") return "favorite";
    return filter === "all" ? "" : filter;
  };
  
  const { data, isLoading, isError } = useTopAnime(getFilterValue(), page);
  
  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as "all" | "bypopularity" | "favorite");
    setFilter("all");
    setPage(1);
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Top Anime</h1>
        <p className="text-muted-foreground">
          Discover the highest rated and most popular anime of all time.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b">
          <TabsList className="grid w-full sm:w-auto grid-cols-3">
            <TabsTrigger value="all">By Score</TabsTrigger>
            <TabsTrigger value="bypopularity">By Popularity</TabsTrigger>
            <TabsTrigger value="favorite">By Favorites</TabsTrigger>
          </TabsList>
          
          {activeTab === "all" && (
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter anime" />
              </SelectTrigger>
              <SelectContent>
                {TOP_FILTERS.filter(f => !["bypopularity", "favorite"].includes(f.value)).map((filterOption) => (
                  <SelectItem key={filterOption.value} value={filterOption.value}>
                    {filterOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <TabsContent value="all" className="space-y-6">
          {renderResults()}
        </TabsContent>
        
        <TabsContent value="bypopularity" className="space-y-6">
          {renderResults()}
        </TabsContent>
        
        <TabsContent value="favorite" className="space-y-6">
          {renderResults()}
        </TabsContent>
      </Tabs>
    </div>
  );
  
  function renderResults() {
    if (isError) {
      return (
        <div className="bg-card rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">Error loading anime</h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading the top anime. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array(25)
            .fill(null)
            .map((_, index) => (
              <AnimeCardSkeleton key={index} />
            ))}
        </div>
      );
    }
    
    if (!data || data.data.length === 0) {
      return (
        <div className="bg-card rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No anime found</h3>
          <p className="text-muted-foreground mb-4">
            There are no anime listed for this category.
          </p>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {activeTab === "bypopularity"
              ? "Most Popular Anime"
              : activeTab === "favorite"
              ? "Most Favorited Anime"
              : filter
              ? `Top ${TOP_FILTERS.find(f => f.value === filter)?.label || "Anime"}`
              : "Top Rated Anime"}
          </h2>
          <div className="text-sm text-muted-foreground">
            Page {data.pagination.current_page} of {data.pagination.last_visible_page}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data.data.map((anime, index) => (
            <div key={anime.mal_id} className="relative">
              {page === 1 && (
                <div className="absolute top-2 left-2 z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
              )}
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {data.pagination.last_visible_page > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, data.pagination.last_visible_page) },
                (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={i}
                      variant={pageNum === page ? "default" : "outline"}
                      className="w-10"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}
              {data.pagination.last_visible_page > 5 && (
                <span className="px-2">...</span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.last_visible_page}
            >
              Next
            </Button>
          </div>
        )}
      </>
    );
  }
} 