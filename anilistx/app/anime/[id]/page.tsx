import { createClient } from "@/utils/supabase/server";
import { AddToCollectionButton } from "@/components/collection/add-to-collection-button";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Tv, Film, Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Fetch function for Jikan API with timeout
async function getAnimeDetails(id: number) {
  try {
    // Add a timeout for the fetch request - 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`, {
      signal: controller.signal,
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      // Handle non-2xx responses (like 404)
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch anime details: ${res.statusText}`);
    }
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Jikan API Error:", error);
    
    // Special handling for timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error("Jikan API request timed out");
    }
    
    return null; // Indicate error or not found
  }
}

// Fetch function for user's collection status
async function getCollectionStatus(animeId: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Not logged in
  }

  try {
    const { data } = await supabase
      .from("anime_lists")
      .select("id, status, score, episodes_watched")
      .eq("user_id", user.id)
      .eq("anime_id", animeId)
      .single();
    return data;
  } catch (error) {
    console.error("Supabase Collection Status Error:", error);
    return null; // Error fetching or not in collection
  }
}

// Define the structure of the props for the page
type AnimeDetailPageProps = {
  params: { id: string };
};

export default async function AnimeDetailPage({ params }: AnimeDetailPageProps) {
  const animeId = parseInt(params.id);

  if (isNaN(animeId)) {
    notFound(); // Show 404 if ID is not a number
  }

  // Fetch data in parallel
  const [animeDetails, collectionStatus] = await Promise.all([
    getAnimeDetails(animeId),
    getCollectionStatus(animeId),
  ]);

  // If animeDetails are not found from Jikan, show 404
  if (!animeDetails) {
    notFound();
  }

  // Placeholder - Basic UI Structure
  return (
    <div className="container py-8 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={animeDetails.images?.jpg?.large_image_url || '/placeholder-anime.jpg'}
              alt={animeDetails.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{animeDetails.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{animeDetails.title_japanese}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {animeDetails.genres?.map((g: any) => (
              <Badge key={g.mal_id} variant="secondary">{g.name}</Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-6 text-sm mb-6">
            {animeDetails.score && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{animeDetails.score} (Score)</span>
              </div>
            )}
            {animeDetails.rank && (
              <span>Rank: #{animeDetails.rank}</span>
            )}
            {animeDetails.popularity && (
              <span>Popularity: #{animeDetails.popularity}</span>
            )}
          </div>

          {/* Add to Collection Button Here */}
          <div className="mb-6">
             {/* Pass necessary Jikan data to the button */}
            <AddToCollectionButton 
              animeData={animeDetails} 
              size="lg"
            /> 
          </div>

          <p className="text-sm leading-relaxed max-h-[150px] overflow-y-auto pr-2">
            {animeDetails.synopsis || "No synopsis available."} 
          </p>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: More Details */}
        <div className="md:col-span-2 space-y-6">
          {/* You can add more sections like Relations, Characters, Staff etc. here */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <DetailItem label="Type" value={animeDetails.type} />
              <DetailItem label="Episodes" value={animeDetails.episodes} />
              <DetailItem label="Status" value={animeDetails.status} />
              <DetailItem label="Aired" value={animeDetails.aired?.string} />
              <DetailItem label="Premiered" value={`${animeDetails.season} ${animeDetails.year}`} />
              <DetailItem label="Broadcast" value={animeDetails.broadcast?.string} />
              <DetailItem label="Producers" value={animeDetails.producers?.map((p:any) => p.name).join(", ")} />
              <DetailItem label="Licensors" value={animeDetails.licensors?.map((p:any) => p.name).join(", ")} />
              <DetailItem label="Studios" value={animeDetails.studios?.map((p:any) => p.name).join(", ")} />
              <DetailItem label="Source" value={animeDetails.source} />
              <DetailItem label="Duration" value={animeDetails.duration} />
              <DetailItem label="Rating" value={animeDetails.rating} />
            </CardContent>
          </Card>
           {/* Add other sections like Trailer, Characters, etc. */}
        </div>

        {/* Right Column: Stats & User Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
               <DetailItem label="Score" value={`${animeDetails.score} (by ${animeDetails.scored_by?.toLocaleString()} users)`} />
               <DetailItem label="Rank" value={`#${animeDetails.rank}`} />
               <DetailItem label="Popularity" value={`#${animeDetails.popularity}`} />
               <DetailItem label="Members" value={animeDetails.members?.toLocaleString()} />
               <DetailItem label="Favorites" value={animeDetails.favorites?.toLocaleString()} />
            </CardContent>
          </Card>

          {collectionStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Your Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <DetailItem label="Status" value={collectionStatus.status} />
                <DetailItem label="Your Score" value={collectionStatus.score || "Not Rated"} />
                <DetailItem label="Episodes Watched" value={collectionStatus.episodes_watched} />
                {/* Add Edit button/functionality here later */} 
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for displaying detail items
function DetailItem({ label, value }: { label: string; value: string | number | undefined | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
} 