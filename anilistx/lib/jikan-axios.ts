import { JikanClient } from '@tutkli/jikan-ts';
import { AnimeBasic, JikanResponse, SearchParams } from './jikan';

interface JikanTsConfig {
  enableLogging?: boolean;
  cacheOptions?: any;
  axiosInstance?: any;
}

/**
 * Jikan API Service using @tutkli/jikan-ts
 * A utility to interact with the Jikan API (unofficial MyAnimeList API)
 */
class JikanTsService {
  private client: JikanClient;
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<any>> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute cache TTL
  
  constructor(config?: JikanTsConfig) {
    this.client = new JikanClient({
      enableLogging: process.env.NODE_ENV === 'development',
      ...config
    });
  }
  
  // Clear the cache, useful for debugging
  clearCache(pattern?: string) {
    if (pattern) {
      // Clear entries matching a pattern
      const regex = new RegExp(pattern);
      Array.from(this.cache.keys())
        .filter(key => regex.test(key))
        .forEach(key => this.cache.delete(key));
      console.log(`Cleared cache entries matching: ${pattern}`);
    } else {
      // Clear entire cache
      this.cache.clear();
      console.log('Cleared entire cache');
    }
  }
  
  /**
   * Helper method to deduplicate requests and cache results
   */
  private async dedupRequest<T>(cacheKey: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if we have a fresh cached result
    const cachedItem = this.cache.get(cacheKey);
    if (cachedItem && Date.now() - cachedItem.timestamp < this.CACHE_TTL) {
      return cachedItem.data as T;
    }
    
    // Check if we already have a pending request for this key
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }
    
    // Otherwise, make a new request
    const requestPromise = requestFn().then(result => {
      // Cache the result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
      return result;
    }).catch(error => {
      // Remove from pending requests on error
      this.pendingRequests.delete(cacheKey);
      throw error;
    });
    
    // Store the pending request
    this.pendingRequests.set(cacheKey, requestPromise);
    
    return requestPromise;
  }

  /**
   * Search for anime by various parameters
   */
  async searchAnime(params: SearchParams): Promise<JikanResponse<AnimeBasic[]>> {
    const cacheKey = `search:${JSON.stringify(params)}`;
    
    try {
      return await this.dedupRequest(cacheKey, async () => {
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
      });
    } catch (error) {
      console.error('Error searching anime:', error);
      throw error;
    }
  }

  /**
   * Get details of a specific anime by its MAL ID
   */
  async getAnimeById(id: number): Promise<AnimeBasic> {
    const cacheKey = `anime:${id}`;
    
    try {
      return await this.dedupRequest(cacheKey, async () => {
        const response = await this.client.anime.getAnimeById(id);
        return response.data as unknown as AnimeBasic;
      });
    } catch (error) {
      console.error(`Error fetching anime with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get top anime based on different ranking types
   */
  async getTopAnime(filter: string = '', page: number = 1, limit: number = 25): Promise<JikanResponse<AnimeBasic[]>> {
    const cacheKey = `top:${filter}:${page}:${limit}`;
    
    try {
      return await this.dedupRequest(cacheKey, async () => {
        const params: any = { page, limit };
        
        // Different parameter handling based on filter type
        if (['airing', 'upcoming', 'bypopularity', 'favorite'].includes(filter)) {
          // These are valid filter values for the Jikan API
          params.filter = filter;
        } else if (['tv', 'movie', 'ova', 'special'].includes(filter)) {
          // Type filters should use the type parameter, not filter
          params.type = filter;
        }
        
        console.log(`Making API request to getTopAnime with params:`, params);
        
        // Add retry logic to handle temporary API failures
        const maxRetries = 3;
        let retryCount = 0;
        let response;
        
        // Add timeout handling
        const fetchWithTimeout = async (timeoutMs = 5000) => {
          return Promise.race([
            executeRequest(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
            )
          ]);
        };
        
        const executeRequest = async () => {
          try {
            const response = await this.client.top.getTopAnime(params);
            console.log(`API response for ${filter || 'all'}: ${response?.data?.length || 0} results`);
            return response;
          } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed for getTopAnime with filter ${filter}:`, error);
            throw error;
          }
        };
        
        while (retryCount < maxRetries) {
          try {
            response = await fetchWithTimeout();
            break; // Success, exit the retry loop
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
              console.error(`All ${maxRetries} attempts failed for getTopAnime`);
              
              // Clear the cache for this filter to prevent reusing bad data
              this.clearCache(`top:${filter}`);
              
              // Return empty data instead of throwing to prevent UI issues
              return { 
                data: [], 
                pagination: { 
                  has_next_page: false, 
                  current_page: page,
                  last_visible_page: 1,
                  items: { count: 0, total: 0, per_page: limit }
                } 
              };
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
          }
        }
        
        return response as unknown as JikanResponse<AnimeBasic[]>;
      });
    } catch (error) {
      console.error('Error fetching top anime:', error);
      // Return empty data instead of throwing
      return { 
        data: [], 
        pagination: { 
          has_next_page: false, 
          current_page: page,
          last_visible_page: 1,
          items: { count: 0, total: 0, per_page: limit }
        } 
      };
    }
  }

  /**
   * Get seasonal anime
   */
  async getSeasonalAnime(year?: number, season?: string, page: number = 1, limit: number = 25): Promise<JikanResponse<AnimeBasic[]>> {
    const cacheKey = `seasonal:${year || 'current'}:${season || 'current'}:${page}:${limit}`;
    
    try {
      return await this.dedupRequest(cacheKey, async () => {
        let response;
        const params = { page, limit };
        
        // Add retry logic to handle temporary API failures
        const maxRetries = 3;
        let retryCount = 0;
        
        // Add timeout handling
        const fetchWithTimeout = async (timeoutMs = 5000) => {
          return Promise.race([
            executeRequest(),
            new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
            )
          ]);
        };
        
        const executeRequest = async () => {
          try {
            if (year && season) {
              // Get specific season
              return await this.client.seasons.getSeason(year, season as any, params);
            } else {
              // Get current season
              return await this.client.seasons.getSeasonNow(params);
            }
          } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);
            throw error;
          }
        };
        
        while (retryCount < maxRetries) {
          try {
            response = await fetchWithTimeout();
            break; // Success, exit the retry loop
          } catch (error) {
            retryCount++;
            if (retryCount >= maxRetries) {
              console.error(`All ${maxRetries} attempts failed for getSeasonalAnime`);
              // Return empty data instead of throwing to prevent UI issues
              return { 
                data: [], 
                pagination: { 
                  has_next_page: false, 
                  current_page: page,
                  last_visible_page: 1,
                  items: { count: 0, total: 0, per_page: limit }
                } 
              };
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 100));
          }
        }
        
        // Type assertion for response
        return response as unknown as JikanResponse<AnimeBasic[]>;
      });
    } catch (error) {
      console.error('Error fetching seasonal anime:', error);
      // Return empty data instead of throwing
      return { 
        data: [], 
        pagination: { 
          has_next_page: false, 
          current_page: page,
          last_visible_page: 1,
          items: { count: 0, total: 0, per_page: limit }
        } 
      };
    }
  }

  /**
   * Get anime recommendations
   */
  async getAnimeRecommendations(id: number, page: number = 1, limit: number = 25): Promise<any> {
    try {
      try {
        return await this.client.anime.getAnimeRecommendations(id);
      } catch (e) {
        console.error('Failed to get recommendations:', e);
        // Fallback to empty response
        return { data: [] };
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
      return await this.client.genres.getAnimeGenres();
    } catch (error) {
      console.error('Error fetching anime genres:', error);
      throw error;
    }
  }

  /**
   * Get anime by genre
   */
  async getAnimeByGenre(genreId: number, page: number = 1, limit: number = 25): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      const response = await this.searchAnime({
        genres: String(genreId),
        page,
        limit
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching anime by genre ${genreId}:`, error);
      throw error;
    }
  }

  /**
   * Search anime by free text
   */
  async searchAnimeByText(text: string, page: number = 1, limit: number = 25): Promise<JikanResponse<AnimeBasic[]>> {
    try {
      const response = await this.searchAnime({
        q: text,
        page,
        limit
      });
      
      return response;
    } catch (error) {
      console.error(`Error searching anime with text "${text}":`, error);
      throw error;
    }
  }
}

// Export a singleton instance
const jikanTsService = new JikanTsService();
export default jikanTsService; 