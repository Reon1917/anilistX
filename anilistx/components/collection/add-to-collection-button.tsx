'use client';

import { useState } from "react";
import { PlusCircle, Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SelectedAnimeDetails } from "./selected-anime-details";
import { useUserCollection } from "@/components/anime/user-collection-provider";

interface AddToCollectionButtonProps extends ButtonProps {
  animeData: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    type?: string;
    episodes?: number;
    year?: number;
    studios?: Array<{ name: string }>;
    score?: number;
    synopsis?: string;
  };
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

export function AddToCollectionButton({
  animeData,
  variant = "default",
  size = "sm",
  showIcon = true,
  className,
  ...props
}: AddToCollectionButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  const { userAnimeCollection, refreshCollection } = useUserCollection();
  
  // Check if anime is in collection using the cached data
  const isInCollection = userAnimeCollection.has(animeData.mal_id);
  
  const handleAddAnime = async (status: string, score: number) => {
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
        anime_id: animeData.mal_id,
        title: animeData.title,
        image_url: animeData.images.jpg.image_url,
        type: animeData.type || 'TV',
        episodes: animeData.episodes || 0,
        status,
        score,
        year: animeData.year || null,
        studio: animeData.studios && animeData.studios.length > 0 ? 
          animeData.studios[0].name : null,
        mal_score: animeData.score || null
      };
      
      const { error: insertError } = await supabase
        .from("anime_lists")
        .upsert(anime, { onConflict: "user_id,anime_id" });
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      toast.success("Anime added", {
        description: `${animeData.title} has been added to your collection.`
      });
      
      // Refresh the collection context
      await refreshCollection();
      
      router.refresh();
      setDialogOpen(false);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to add anime to collection"
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setDialogOpen(true)}
        className={className}
        disabled={isAdding}
        {...props}
      >
        {showIcon && (
          isInCollection ? 
            <Check className="mr-2 h-4 w-4" /> : 
            <PlusCircle className="mr-2 h-4 w-4" />
        )}
        {isInCollection ? "In Collection" : "Add to Collection"}
      </Button>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add to Collection</DialogTitle>
          </DialogHeader>
          
          <SelectedAnimeDetails
            anime={animeData}
            onBack={() => setDialogOpen(false)}
            onAdd={handleAddAnime}
            isAdding={isAdding}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 