import { TopAnimeSection } from "@/components/anime/top-anime-section";
import { SeasonalAnimeSection } from "@/components/anime/seasonal-anime-section";
import { HeroSection } from "@/components/anime/hero-section";
import { SearchBar } from '@/components/search/search-bar';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="container py-8 space-y-12">
        <div className="mb-8">
          <SearchBar />
        </div>
        <HeroSection />
        
        {/* Top Anime Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Anime</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/top" className="flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <TopAnimeSection />
        </section>
        
        {/* Seasonal Anime Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Seasonal Anime</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/seasonal" className="flex items-center gap-1">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <SeasonalAnimeSection />
        </section>
      </div>
    </PageTransition>
  );
}
