import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tv } from "lucide-react";

export default function AnimeNotFound() {
  return (
    <div className="container py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <div className="bg-muted/30 rounded-full p-6 mb-6">
        <Tv className="h-16 w-16 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-bold mb-3">Anime Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The anime you're looking for doesn't exist or couldn't be found. It may have been removed from the database or had its ID changed.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/top">Browse Top Anime</Link>
        </Button>
      </div>
    </div>
  );
} 