'use client';

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectedAnimeDetailsProps = {
  anime: any;
  onBack: () => void;
  onAdd: (status: string, score: number) => void;
};

export function SelectedAnimeDetails({
  anime,
  onBack,
  onAdd,
}: SelectedAnimeDetailsProps) {
  const [status, setStatus] = useState("watching");
  const [score, setScore] = useState(0);
  
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        className="pl-0 text-muted-foreground"
        onClick={onBack}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to search
      </Button>
      
      <div className="flex gap-4">
        <div className="relative h-[200px] w-[140px] flex-shrink-0 overflow-hidden rounded-md">
          <Image
            src={anime.images.jpg.image_url || '/placeholder-anime.jpg'}
            alt={anime.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{anime.title}</h2>
          <p className="text-sm text-muted-foreground">
            {anime.studios.length > 0 && anime.studios[0].name}
            {anime.year && ` • ${anime.year}`}
            {anime.episodes && ` • ${anime.episodes} episodes`}
          </p>
          
          <div className="mt-2 flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{anime.score || 'N/A'}</span>
          </div>
          
          <ScrollArea className="mt-3 h-[100px] pr-4">
            <p className="text-sm text-muted-foreground">
              {anime.synopsis || 'No synopsis available.'}
            </p>
          </ScrollArea>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
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
          <label className="text-sm font-medium">Score</label>
          <Select value={score.toString()} onValueChange={(val) => setScore(parseInt(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not rated</SelectItem>
              <SelectItem value="1">1 - Appalling</SelectItem>
              <SelectItem value="2">2 - Horrible</SelectItem>
              <SelectItem value="3">3 - Very Bad</SelectItem>
              <SelectItem value="4">4 - Bad</SelectItem>
              <SelectItem value="5">5 - Average</SelectItem>
              <SelectItem value="6">6 - Fine</SelectItem>
              <SelectItem value="7">7 - Good</SelectItem>
              <SelectItem value="8">8 - Very Good</SelectItem>
              <SelectItem value="9">9 - Great</SelectItem>
              <SelectItem value="10">10 - Masterpiece</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button className="w-full" onClick={() => onAdd(status, score)}>
        Add to Collection
      </Button>
    </div>
  );
} 