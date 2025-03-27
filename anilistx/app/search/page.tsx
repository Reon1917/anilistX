"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAnimeSearch } from "@/lib/hooks";
import { AnimeCard } from "@/components/anime/anime-card";
import { AnimeCardSkeleton } from "@/components/anime/anime-card-skeleton";
import { SearchFilters } from "@/components/anime/search-filters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [genres, setGenres] = useState(searchParams.get("genres") || "");
  const [minScore, setMinScore] = useState(searchParams.get("min_score") || "");
  const [orderBy, setOrderBy] = useState(searchParams.get("order_by") || "score");
  const [sort, setSort] = useState(searchParams.get("sort") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  
  // Check if there are any search params
  const hasSearchParams = searchParams.toString().length > 0;
  
  // Build the search params
  const searchQueryParams = {
    q: query,
    type: type,
    status: status,
    genres: genres,
    min_score: minScore ? Number(minScore) : undefined,
    order_by: orderBy,
    sort: sort as "desc" | "asc",
    page: page,
    limit: 24,
  };
  
  const { data, isLoading, isError } = useAnimeSearch(
    hasSearchParams ? searchQueryParams : { limit: 24 },
    hasSearchParams
  );
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build the URL params
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (genres) params.set("genres", genres);
    if (minScore) params.set("min_score", minScore);
    if (orderBy !== "score") params.set("order_by", orderBy);
    if (sort !== "desc") params.set("sort", sort);
    if (page !== 1) params.set("page", page.toString());
    
    // Navigate to the new URL
    router.push(`/search?${params.toString()}`);
  };
  
  const handleReset = () => {
    setQuery("");
    setType("");
    setStatus("");
    setGenres("");
    setMinScore("");
    setOrderBy("score");
    setSort("desc");
    setPage(1);
    router.push("/search");
  };
  
  const handlePageChange = (newPage: number) => {
    const current = new URLSearchParams(searchParams.toString());
    current.set("page", newPage.toString());
    setPage(newPage);
    router.push(`/search?${current.toString()}`);
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Search Anime</h1>
        <p className="text-muted-foreground">Find your favorite anime with advanced filtering.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-4">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search anime..."
                    className="pl-8"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <SearchFilters
                type={type}
                setType={setType}
                status={status}
                setStatus={setStatus}
                genres={genres}
                setGenres={setGenres}
                minScore={minScore}
                setMinScore={setMinScore}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                sort={sort}
                setSort={setSort}
              />
              
              <div className="flex flex-col gap-2">
                <Button type="submit">Apply Filters</Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  Reset Filters
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {isError ? (
            <div className="bg-card rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Error loading results</h3>
              <p className="text-muted-foreground mb-4">
                There was an error loading the search results. Please try again.
              </p>
              <Button onClick={handleSearch}>Retry</Button>
            </div>
          ) : isLoading ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Loading results...</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array(12)
                  .fill(null)
                  .map((_, index) => (
                    <AnimeCardSkeleton key={index} />
                  ))}
              </div>
            </>
          ) : data && data.data.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {data.pagination.items.total.toLocaleString()} Results
                </h2>
                <div className="text-sm text-muted-foreground">
                  Page {data.pagination.current_page} of {data.pagination.last_visible_page}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {data.data.map((anime) => (
                  <AnimeCard key={anime.mal_id} anime={anime} />
                ))}
              </div>
              
              {/* Pagination */}
              {data.pagination.last_visible_page > 1 && (
                <div className="flex justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(data.pagination.current_page - 1)}
                    disabled={data.pagination.current_page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.pagination.last_visible_page) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={i}
                          variant={pageNum === data.pagination.current_page ? "default" : "outline"}
                          className="w-10"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {data.pagination.last_visible_page > 5 && <span className="px-2">...</span>}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(data.pagination.current_page + 1)}
                    disabled={data.pagination.current_page === data.pagination.last_visible_page}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-card rounded-lg p-8 text-center">
              {hasSearchParams ? (
                <>
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any anime matching your search criteria. Try adjusting your filters.
                  </p>
                  <Button onClick={handleReset}>Reset Filters</Button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-medium mb-2">Start searching</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter a search term or apply filters to find anime.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 