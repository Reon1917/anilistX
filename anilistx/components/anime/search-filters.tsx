"use client";

import React, { useEffect, useState } from "react";
import { useAnimeGenres } from "@/lib/hooks-axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface SearchFiltersProps {
  type: string;
  setType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  genres: string;
  setGenres: (value: string) => void;
  minScore: string;
  setMinScore: (value: string) => void;
  orderBy: string;
  setOrderBy: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
}

export function SearchFilters({
  type,
  setType,
  status,
  setStatus,
  genres,
  setGenres,
  minScore,
  setMinScore,
  orderBy,
  setOrderBy,
  sort,
  setSort,
}: SearchFiltersProps) {
  const { genres: genresList, isLoading: isGenresLoading } = useAnimeGenres();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    if (genres) {
      setSelectedGenres(genres.split(","));
    } else {
      setSelectedGenres([]);
    }
  }, [genres]);

  const handleGenreChange = (genreId: string, checked: boolean) => {
    let newSelectedGenres: string[];
    
    if (checked) {
      newSelectedGenres = [...selectedGenres, genreId];
    } else {
      newSelectedGenres = selectedGenres.filter(id => id !== genreId);
    }
    
    setSelectedGenres(newSelectedGenres);
    setGenres(newSelectedGenres.join(","));
  };

  return (
    <Accordion type="multiple" className="space-y-4" defaultValue={["type", "sort"]}>
      <AccordionItem value="type" className="border-b-0">
        <AccordionTrigger className="py-2">Type & Status</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any type</SelectItem>
                  <SelectItem value="tv">TV</SelectItem>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="ova">OVA</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                  <SelectItem value="ona">ONA</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="airing">Currently Airing</SelectItem>
                  <SelectItem value="complete">Completed</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="genres" className="border-b-0">
        <AccordionTrigger className="py-2">Genres</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {isGenresLoading ? (
              <div className="text-sm text-muted-foreground">Loading genres...</div>
            ) : (
              genresList.map((genre: any) => (
                <div key={genre.mal_id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`genre-${genre.mal_id}`} 
                    checked={selectedGenres.includes(genre.mal_id.toString())}
                    onCheckedChange={(checked) => 
                      handleGenreChange(genre.mal_id.toString(), checked === true)
                    }
                  />
                  <Label
                    htmlFor={`genre-${genre.mal_id}`}
                    className="text-sm font-normal"
                  >
                    {genre.name}
                  </Label>
                </div>
              ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="score" className="border-b-0">
        <AccordionTrigger className="py-2">Score</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            <Label htmlFor="min-score">Minimum Score</Label>
            <Select value={minScore} onValueChange={setMinScore}>
              <SelectTrigger id="min-score">
                <SelectValue placeholder="Any score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any score</SelectItem>
                <SelectItem value="9">9+</SelectItem>
                <SelectItem value="8">8+</SelectItem>
                <SelectItem value="7">7+</SelectItem>
                <SelectItem value="6">6+</SelectItem>
                <SelectItem value="5">5+</SelectItem>
                <SelectItem value="4">4+</SelectItem>
                <SelectItem value="3">3+</SelectItem>
                <SelectItem value="2">2+</SelectItem>
                <SelectItem value="1">1+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="sort" className="border-b-0">
        <AccordionTrigger className="py-2">Sort</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-by">Order By</Label>
              <Select value={orderBy} onValueChange={setOrderBy}>
                <SelectTrigger id="order-by">
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="rank">Rank</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                  <SelectItem value="favorites">Favorites</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">Sort Direction</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Descending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
} 