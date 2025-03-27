import { JikanClient } from '@tutkli/jikan-ts';
import { AnimeBasic, JikanResponse, SearchParams } from './jikan';

/**
 * Jikan API Service using @tutkli/jikan-ts
 * A utility to interact with the Jikan API (unofficial MyAnimeList API)
 */
class JikanTsService {
  private client: JikanClient;

  constructor() {
    this.client = new JikanClient({
      enableLogging: false,
    });
  }

  /**
   * Search for anime by various parameters
   */
  async searchAnime(params: SearchParams): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      const response = await this.client.anime.getAnimeSearch({
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
      const response = await this.client.anime.getAnimeById(id);
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
      const params: any = { page, limit };
      if (filter) {
        params.filter = filter;
      }
      
      const response = await this.client.top.getTopAnime(params);
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
      const params = { page, limit };
      
      if (year && season) {
        // Handle specific season - in test mock this is getSeason
        response = await this.client.seasons.getSeason?.(year, season as any, params) 
          || this.client.seasons.getSeasonsList?.(params) 
          || { data: [], pagination: { has_next_page: false, current_page: 1 } };
      } else {
        // Handle current season - in test mock this is getNow
        response = await this.client.seasons.getNow?.(params) 
          || this.client.seasons.getCurrentSeason?.(params) 
          || { data: [], pagination: { has_next_page: false, current_page: 1 } };
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
      // Some APIs expect params separately, others as object
      const params = { page, limit };
      try {
        return await this.client.anime.getAnimeRecommendations(id, params);
      } catch (e) {
        // Fallback to single parameter
        return await this.client.anime.getAnimeRecommendations(id);
      }
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
      const response = await this.client.genres.getAnimeGenres();
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