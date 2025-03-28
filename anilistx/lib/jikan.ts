import jikanjs from '@mateoaranda/jikanjs';

// Type definitions
export interface AnimeBasic {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved: boolean;
  titles: {
    type: string;
    title: string;
  }[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: any;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  studios: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
}

export interface JikanResponse<T> {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: T;
}

export interface SearchParams {
  q?: string;
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  genres?: string;
  min_score?: number;
  max_score?: number;
  sfw?: boolean;
  order_by?: string;
  sort?: 'desc' | 'asc';
  letter?: string;
  producers?: string;
  start_date?: string;
  end_date?: string;
  season?: string;
  year?: number;
}

/**
 * Jikan API Service
 * A utility to interact with the Jikan API (unofficial MyAnimeList API)
 */
class JikanService {
  /**
   * Search for anime by various parameters
   */
  async searchAnime(params: SearchParams): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      // Create the params object without including undefined values
      const queryParams: Record<string, any> = {};
      if (params.limit) queryParams.limit = params.limit;
      if (params.type) queryParams.type = params.type;
      if (params.status) queryParams.status = params.status;
      if (params.genres) queryParams.genres = params.genres;
      if (params.min_score) queryParams.min_score = params.min_score;
      if (params.max_score) queryParams.max_score = params.max_score;
      if (params.sfw !== undefined) queryParams.sfw = params.sfw;
      if (params.order_by) queryParams.order_by = params.order_by;
      if (params.sort) queryParams.sort = params.sort;
      if (params.letter) queryParams.letter = params.letter;
      if (params.producers) queryParams.producers = params.producers;
      if (params.start_date) queryParams.start_date = params.start_date;
      if (params.end_date) queryParams.end_date = params.end_date;
      
      // Use raw method to directly call the API
      const response = await jikanjs.raw(['anime'], function() {
        return { 
          q: params.q || "", 
          page: params.page || 1,
          ...queryParams
        };
      });
      
      return response;
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
      const response = await jikanjs.raw(['anime', id]);
      return response.data;
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
      let response;
      if (filter) {
        response = await jikanjs.raw(['top', 'anime'], function() {
          return { 
            page: page,
            filter: filter,
            limit: limit
          };
        });
      } else {
        response = await jikanjs.raw(['top', 'anime'], function() {
          return { 
            page: page,
            limit: limit
          };
        });
      }
      return response;
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
        response = await jikanjs.raw(['seasons', year, season], function() {
          return {
            page: page,
            limit: limit
          };
        });
      } else {
        response = await jikanjs.raw(['seasons', 'now'], function() {
          return {
            page: page,
            limit: limit
          };
        });
      }
      return response;
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
      const response = await jikanjs.raw(['anime', id, 'recommendations'], function() {
        return {
          page: page,
          limit: limit
        };
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
      const response = await jikanjs.raw(['genres', 'anime']);
      return response;
    } catch (error) {
      console.error('Error fetching anime genres:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const jikanService = new JikanService();
export default jikanService; 