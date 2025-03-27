import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import jikanService from "@/lib/jikan";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Play, Clock, Users, ExternalLink } from "lucide-react";

interface AnimePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: AnimePageProps): Promise<Metadata> {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) return { title: 'Anime Not Found' };

    const anime = await jikanService.getAnimeById(id);
    
    return {
      title: `${anime.title} | AnilistX`,
      description: anime.synopsis?.substring(0, 160),
      openGraph: {
        title: anime.title,
        description: anime.synopsis?.substring(0, 160),
        images: [anime.images.jpg.large_image_url],
      },
    };
  } catch (error) {
    return {
      title: 'Anime Not Found',
    };
  }
}

export default async function AnimePage({ params }: AnimePageProps) {
  const id = parseInt(params.id);
  
  if (isNaN(id)) {
    notFound();
  }

  try {
    const anime = await jikanService.getAnimeById(id);
    
    return (
      <div className="flex flex-col gap-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 z-0">
            <Image
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 p-6 md:p-10">
            <div className="shrink-0 w-48 md:w-64 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                width={256}
                height={384}
                className="w-full h-auto"
                priority
              />
            </div>

            <div className="flex flex-col gap-4 text-white max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold">{anime.title}</h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-xl text-gray-300">{anime.title_english}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {anime.score > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{anime.score} ({anime.scored_by.toLocaleString()} votes)</span>
                  </div>
                )}
                {anime.episodes && (
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    <span>{anime.episodes} episodes</span>
                  </div>
                )}
                {anime.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{anime.duration}</span>
                  </div>
                )}
                {anime.season && anime.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{anime.members.toLocaleString()} members</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <Link
                    key={genre.mal_id}
                    href={`/search?genres=${genre.mal_id}`}
                    className="inline-flex rounded-full bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-medium transition"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              <p className="text-sm md:text-base text-gray-300">
                {anime.synopsis}
              </p>

              <div className="flex flex-wrap gap-4 mt-2">
                <Button asChild>
                  <Link href={`/anime/${anime.mal_id}/add`}>
                    Add to List
                  </Link>
                </Button>
                {anime.trailer?.youtube_id && (
                  <Button variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                    <a 
                      href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" /> Watch Trailer
                    </a>
                  </Button>
                )}
                <Button variant="outline" className="text-white border-white hover:bg-white/10" asChild>
                  <a 
                    href={anime.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" /> MAL Page
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Information */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{anime.type || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Episodes:</span>
                    <span>{anime.episodes || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span>{anime.status || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Aired:</span>
                    <span>
                      {anime.aired?.from ? new Date(anime.aired.from).toLocaleDateString() : 'Unknown'} 
                      {anime.aired?.to ? ` to ${new Date(anime.aired.to).toLocaleDateString()}` : ''}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span>{anime.rating || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{anime.duration || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source:</span>
                    <span>{anime.source || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Favorites:</span>
                    <span>{anime.favorites?.toLocaleString() || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background */}
            {anime.background && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Background</h2>
                <p className="text-muted-foreground">{anime.background}</p>
              </div>
            )}

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Studios</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map((studio) => (
                    <span
                      key={studio.mal_id}
                      className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Statistics</h2>
              <div className="space-y-4 bg-muted rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span>Score:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{anime.score || 'N/A'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ranked:</span>
                  <span className="font-bold">#{anime.rank || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Popularity:</span>
                  <span className="font-bold">#{anime.popularity || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Members:</span>
                  <span className="font-bold">{anime.members?.toLocaleString() || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Favorites:</span>
                  <span className="font-bold">{anime.favorites?.toLocaleString() || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {/* Add to List Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">My List</h2>
              <div className="space-y-4 bg-card rounded-lg border p-4">
                <Button className="w-full" asChild>
                  <Link href={`/anime/${anime.mal_id}/add`}>
                    Add to My List
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h1 className="text-2xl font-bold mb-4">Anime Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the anime you're looking for.
        </p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }
} 