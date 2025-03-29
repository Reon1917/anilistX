'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Type for the anime data passed in
type AnimeItem = {
  id: string;
  anime_id: number;
  title: string;
  image_url: string;
  type: string;
  episodes: number; // Total episodes
  status: string;
  score: number;
  episodes_watched: number;
};

type EditAnimeDialogProps = {
  anime: AnimeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (status: string, score: number, episodesWatched: number) => void;
  isUpdating?: boolean;
};

export function EditAnimeDialog({
  anime,
  open,
  onOpenChange,
  onUpdate,
  isUpdating = false,
}: EditAnimeDialogProps) {
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(0);
  const [episodesWatched, setEpisodesWatched] = useState(0);

  // Pre-fill form when anime data changes (dialog opens)
  useEffect(() => {
    if (anime) {
      setStatus(anime.status || "watching");
      setScore(anime.score || 0);
      setEpisodesWatched(anime.episodes_watched || 0);
    } else {
      // Reset form when dialog closes
      setStatus("watching");
      setScore(0);
      setEpisodesWatched(0);
    }
  }, [anime]);

  const handleEpisodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    // Ensure value is not negative and not greater than total episodes (if available)
    const maxEpisodes = anime?.episodes > 0 ? anime.episodes : Infinity;
    setEpisodesWatched(Math.max(0, Math.min(isNaN(value) ? 0 : value, maxEpisodes)));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anime) return;
    onUpdate(status, score, episodesWatched);
  };

  if (!anime) return null; // Don't render if no anime selected

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Collection Entry</DialogTitle>
          <DialogDescription>Update status and score for: {anime.title}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex gap-4 items-center">
             <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
               <Image
                 src={anime.image_url || '/placeholder-anime.jpg'}
                 alt={anime.title}
                 fill
                 className="object-cover"
               />
             </div>
            <h3 className="font-semibold flex-1">{anime.title}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus} disabled={isUpdating} name="status">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watching">Watching</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                  <SelectItem value="plan_to_watch">Plan to Watch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Select value={score.toString()} onValueChange={(val) => setScore(parseInt(val))} disabled={isUpdating} name="score">
                <SelectTrigger id="score">
                  <SelectValue placeholder="Select score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Not rated</SelectItem>
                  {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="episodesWatched">Episodes Watched</Label>
            <Input 
              id="episodesWatched"
              type="number"
              value={episodesWatched}
              onChange={handleEpisodesChange}
              min="0"
              max={anime.episodes > 0 ? anime.episodes : undefined}
              disabled={isUpdating}
              placeholder={`0 / ${anime.episodes || '??'}`}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 