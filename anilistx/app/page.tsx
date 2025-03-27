import { TopAnimeSection } from "@/components/anime/top-anime-section";
import { SeasonalAnimeSection } from "@/components/anime/seasonal-anime-section";
import { HeroSection } from "@/components/anime/hero-section";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <HeroSection />
      
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Top Anime</h2>
          <a 
            href="/top" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </a>
        </div>
        <TopAnimeSection />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Seasonal Anime</h2>
          <a 
            href="/seasonal" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all →
          </a>
        </div>
        <SeasonalAnimeSection />
      </section>
    </div>
  );
}
