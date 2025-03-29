'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { AddAnimeDialog } from "./add-anime-dialog";
import { useState } from "react";

export function CollectionEmptyState() {
  const [showAddAnimeDialog, setShowAddAnimeDialog] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center space-y-4">
      <div className="relative w-32 h-32 mb-4">
        <Image 
          src="/empty-collection.svg"
          alt="Empty collection"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold">Your collection is empty</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        Start tracking your anime journey by adding anime to your collection. You can mark them as watching, completed, plan to watch, and more.
      </p>
      <Button 
        onClick={() => setShowAddAnimeDialog(true)}
        className="mt-4 flex items-center gap-2"
      >
        <PlusCircle className="h-4 w-4" />
        Add Your First Anime
      </Button>

      <AddAnimeDialog 
        open={showAddAnimeDialog} 
        onOpenChange={setShowAddAnimeDialog} 
      />
    </div>
  );
} 