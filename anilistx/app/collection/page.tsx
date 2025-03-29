import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AnimeCollection } from "@/components/collection/anime-collection";
import { AddAnimeToCollectionButton } from "@/components/collection/add-anime-to-collection-button";
import { CollectionEmptyState } from "@/components/collection/collection-empty-state";

export const metadata: Metadata = {
  title: "My Collection | AnilistX",
  description: "Manage your anime collection and track your watch progress",
};

export default async function CollectionPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login?callbackUrl=/collection");
  }
  
  const { data: animeList, error } = await supabase
    .from("anime_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  
  if (error) {
    console.error("Error fetching anime lists:", error);
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-2">Failed to load your collection</p>
        <p className="text-muted-foreground text-sm">Please try again later</p>
      </div>
    );
  }
  
  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Collection</h1>
          <p className="text-muted-foreground mt-1">
            Track your anime watch progress and keep your collection organized
          </p>
        </div>
        {animeList && animeList.length > 0 && (
          <AddAnimeToCollectionButton />
        )}
      </div>
      
      {animeList && animeList.length > 0 ? (
        <AnimeCollection animeList={animeList} />
      ) : (
        <CollectionEmptyState />
      )}
    </div>
  );
} 