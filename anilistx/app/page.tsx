import { TopAnimeSection } from "@/components/anime/top-anime-section";
import { SeasonalAnimeSection } from "@/components/anime/seasonal-anime-section";
import { HeroSection } from "@/components/anime/hero-section";
import { SearchBar } from '@/components/search/search-bar';

export default function HomePage() {
  return (
    <main>
      <div className="container py-8">
        <div className="mb-8">
          <SearchBar />
        </div>
        <HeroSection />
        <TopAnimeSection />
        <SeasonalAnimeSection />
      </div>
    </main>
  );
}
