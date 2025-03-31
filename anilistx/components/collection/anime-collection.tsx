'use client';

import { useState } from "react";
import Image from "next/image";
import { Star, Pencil, MoreHorizontal, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { EditAnimeDialog } from "./edit-anime-dialog";

type AnimeItem = {
  id: string;
  anime_id: number;
  title: string;
  image_url: string;
  type: string;
  episodes: number;
  status: string;
  score: number;
  episodes_watched: number;
  year: number | null;
  studio: string | null;
  mal_score: number | null;
};

type AnimeCollectionProps = {
  animeList: AnimeItem[];
};

const STATUS_LABELS = {
  watching: "Watching",
  completed: "Completed",
  on_hold: "On Hold",
  dropped: "Dropped",
  plan_to_watch: "Plan to Watch",
};

export function AnimeCollection({ animeList }: AnimeCollectionProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [animeToDelete, setAnimeToDelete] = useState<AnimeItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [animeToEdit, setAnimeToEdit] = useState<AnimeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  
  const filteredAnimeList = activeTab === "all" 
    ? animeList 
    : animeList.filter((anime) => anime.status === activeTab);
  
  const handleDeleteAnime = async () => {
    if (!animeToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("anime_lists")
        .delete()
        .eq("id", animeToDelete.id);
        
      if (error) throw error;
      
      toast({
        title: "Anime removed",
        description: `${animeToDelete.title} has been removed from your collection.`,
      });
      
      router.refresh();
    } catch (error) {
      console.error("Error deleting anime:", error);
      toast({
        title: "Error",
        description: "Failed to remove anime from your collection.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setAnimeToDelete(null);
    }
  };
  
  const handleUpdateAnime = async (updatedStatus: string, updatedScore: number, updatedEpisodesWatched: number) => {
    if (!animeToEdit) return;
    
    setIsEditing(true);
    
    try {
      const updateData = {
        status: updatedStatus,
        score: updatedScore,
        episodes_watched: updatedEpisodesWatched,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("anime_lists")
        .update(updateData)
        .eq("id", animeToEdit.id);
        
      if (error) throw error;
      
      toast({
        title: "Collection updated",
        description: `${animeToEdit.title} has been updated.`,
      });
      
      router.refresh();
      setAnimeToEdit(null);
    } catch (error) {
      console.error("Error updating anime:", error);
      toast({
        title: "Error",
        description: "Failed to update anime in your collection.",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="watching">Watching</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="plan_to_watch">Plan to Watch</TabsTrigger>
          <TabsTrigger value="dropped">Dropped</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnimeList.map((anime) => (
              <Card key={anime.id} className="overflow-hidden">
                <div className="flex h-[140px]">
                  <div className="w-24 h-[140px] relative flex-shrink-0">
                    <Image
                      src={anime.image_url || '/placeholder-anime.jpg'}
                      alt={anime.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="flex-1 p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">{anime.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {anime.studio}
                          {anime.year && ` • ${anime.year}`}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="-mt-1 -mr-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setAnimeToEdit(anime)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Status/Score
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setAnimeToDelete(anime)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {anime.type}
                      </Badge>
                      {anime.episodes > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {anime.episodes} ep{anime.episodes !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <Badge className="bg-primary/20 hover:bg-primary/20 text-primary border-none">
                        {STATUS_LABELS[anime.status as keyof typeof STATUS_LABELS]}
                      </Badge>
                      
                      <div className="flex items-center">
                        {anime.score > 0 ? (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{anime.score}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Not rated</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredAnimeList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <p className="text-muted-foreground mb-2">
                {activeTab === "all" 
                  ? "Your collection is empty." 
                  : `You don't have any anime with ${STATUS_LABELS[activeTab as keyof typeof STATUS_LABELS]} status.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={!!animeToDelete} onOpenChange={(open) => !open && setAnimeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{animeToDelete?.title}" from your collection?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAnime} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditAnimeDialog 
        anime={animeToEdit} 
        open={!!animeToEdit} 
        onOpenChange={(open) => !open && setAnimeToEdit(null)}
        onUpdate={handleUpdateAnime}
        isUpdating={isEditing}
      />
    </div>
  );
} 