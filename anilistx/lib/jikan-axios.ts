import { JikanClient, AnimeClient } from '@tutkli/jikan-ts';
import { AnimeBasic, JikanResponse, SearchParams } from './jikan';

/**
 * Jikan API Service using @tutkli/jikan-ts
 * A utility to interact with the Jikan API (unofficial MyAnimeList API)
 */
class JikanTsService {
  private jikanClient: JikanClient;
  private animeClient: AnimeClient;

  constructor() {
    this.jikanClient = new JikanClient({
      enableLogging: false,
    });
    this.animeClient = new AnimeClient({
      enableLogging: false,
    });
  }

  /**
   * Search for anime by various parameters
   */
  async searchAnime(params: SearchParams): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      const response = await this.animeClient.getAnimeSearch({
        q: params.q,
        page: params.page,
        limit: params.limit,
        type: params.type as any,
        status: params.status as any,
        genres: params.genres,
        min_score: params.min_score,
        max_score: params.max_score,
        sfw: params.sfw,
        order_by: params.order_by as any,
        sort: params.sort as any,
        letter: params.letter,
        producers: params.producers,
        start_date: params.start_date,
        end_date: params.end_date,
      });
      
      return response as unknown as JikanResponse<AnimeBasic[]>;
    } catch (error) {
      console.error('Error searching anime:', error);
      throw error;
    }
  }

  /**
   * Get details of a specific anime by its MAL ID
   */
  async getAnimeById(id: number): Promise<AnimeBasic> {
    try {
      const response = await this.animeClient.getAnimeById(id);
      return response.data as unknown as AnimeBasic;
    } catch (error) {
      console.error(`Error fetching anime with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get top anime based on different ranking types
   */
  async getTopAnime(filter: string = '', page: number = 1, limit: number = 25): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      const response = await this.animeClient.getAnimeTop({
        page,
        limit,
        filter: filter as any,
      });
      
      return response as unknown as JikanResponse<AnimeBasic[]>;
    } catch (error) {
      console.error('Error fetching top anime:', error);
      throw error;
    }
  }

  /**
   * Get seasonal anime
   */
  async getSeasonalAnime(year?: number, season?: string, page: number = 1, limit: number = 25): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      let response;
      if (year && season) {
        response = await this.jikanClient.seasons.getSeasonsList(year, season as any, {
          page,
          limit,
        });
      } else {
        // Default to current season
        response = await this.jikanClient.seasons.getCurrentSeason({
          page,
          limit,
        });
      }
      
      return response as unknown as JikanResponse<AnimeBasic[]>;
    } catch (error) {
      console.error('Error fetching seasonal anime:', error);
      throw error;
    }
  }

  /**
   * Get anime recommendations
   */
  async getAnimeRecommendations(id: number, page: number = 1, limit: number = 25): Promise<any> {
    try {
      const response = await this.animeClient.getAnimeRecommendations(id, {
        page,
        limit,
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching recommendations for anime ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get anime genres
   */
  async getGenres(): Promise<any> {
    try {
      const response = await this.jikanClient.genres.getAnimeGenres();
      return response;
    } catch (error) {
      console.error('Error fetching anime genres:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const jikanTsService = new JikanTsService();
export default jikanTsService; 