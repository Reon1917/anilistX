import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import jikanTsService from './jikan-axios';
import { AnimeBasic, JikanResponse, SearchParams } from './jikan';

// This is the fetcher function that will be used by SWR
const fetcher = async (key: string, ...args: any[]) => {
  // Extract the method name from the key
  const [method, ...params] = key.split(':');
  
  try {
    // Call the corresponding method on jikanTsService
    switch (method) {
      case 'searchAnime':
        return await jikanTsService.searchAnime(args[0] as SearchParams);
      case 'getAnimeById':
        return await jikanTsService.getAnimeById(Number(params[0]));
      case 'getTopAnime':
        return await jikanTsService.getTopAnime(params[0], args[0], args[1]);
      case 'getSeasonalAnime':
        if (params.length === 2) {
          return await jikanTsService.getSeasonalAnime(Number(params[0]), params[1], args[0], args[1]);
        } else {
          return await jikanTsService.getSeasonalAnime(undefined, undefined, args[0], args[1]);
        }
      case 'getAnimeRecommendations':
        return await jikanTsService.getAnimeRecommendations(Number(params[0]), args[0], args[1]);
      case 'getGenres':
        return await jikanTsService.getGenres();
      case 'getAnimeByGenre':
        return await jikanTsService.getAnimeByGenre(Number(params[0]), args[0], args[1]);
      case 'searchAnimeByText':
        return await jikanTsService.searchAnimeByText(params[0], args[0], args[1]);
      default:
        throw new Error(`Unknown method: ${method}`);
    }
  } catch (error) {
    console.error(`Error in fetcher for method ${method}:`, error);
    throw error;
  }
};

/**
 * Search for anime with various parameters
 */
export function useSearchAnime(params: SearchParams) {
  const { data, error, isLoading } = useSWR(
    ['searchAnime', params],
    () => fetcher('searchAnime', params)
  );
  
  return {
    anime: data?.data as AnimeBasic[] | undefined,
    pagination: data?.pagination,
    isLoading,
    isError: error
  };
}

/**
 * Get details about a specific anime by ID
 */
export function useAnime(id: number) {
  const { data, error, isLoading } = useSWR(
    id ? `getAnimeById:${id}` : null,
    (key) => fetcher(key as string)
  );
  
  return {
    anime: data as AnimeBasic | undefined,
    isLoading,
    isError: error
  };
}

/**
 * Get top anime with optional filtering
 */
export function useTopAnime(filter: string = '', page: number = 1, limit: number = 25) {
  const key = `getTopAnime:${filter}`;
  const { data, error, isLoading } = useSWR(
    key,
    (key) => fetcher(key as string, page, limit)
  );
  
  return {
    anime: data?.data as AnimeBasic[] | undefined,
    pagination: data?.pagination,
    isLoading,
    isError: error
  };
}

/**
 * Get seasonal anime
 */
export function useSeasonalAnime(
  year?: number,
  season?: string,
  page: number = 1,
  limit: number = 25
) {
  const key = year && season
    ? `getSeasonalAnime:${year}:${season}`
    : 'getSeasonalAnime';
    
  const { data, error, isLoading } = useSWR(
    key,
    (key) => fetcher(key as string, page, limit)
  );
  
  return {
    anime: data?.data as AnimeBasic[] | undefined,
    pagination: data?.pagination,
    isLoading,
    isError: error
  };
}

/**
 * Get anime recommendations for a specific anime
 */
export function useAnimeRecommendations(id: number, page: number = 1, limit: number = 25) {
  const key = id ? `getAnimeRecommendations:${id}` : null;
  const { data, error, isLoading } = useSWR(
    key,
    (key) => key ? fetcher(key as string, page, limit) : null
  );
  
  return {
    recommendations: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: error
  };
}

/**
 * Get anime genres
 */
export function useGenres() {
  const { data, error, isLoading } = useSWR(
    'getGenres',
    (key) => fetcher(key as string)
  );
  
  return {
    genres: data?.data || [],
    isLoading,
    isError: error
  };
}

/**
 * Get anime by genre id
 */
export function useAnimeByGenre(genreId: number, page: number = 1, limit: number = 25) {
  const key = genreId ? `getAnimeByGenre:${genreId}` : null;
  const { data, error, isLoading } = useSWR(
    key,
    (key) => key ? fetcher(key as string, page, limit) : null
  );
  
  return {
    anime: data?.data as AnimeBasic[] | undefined,
    pagination: data?.pagination,
    isLoading,
    isError: error
  };
}

/**
 * Search anime by text query
 */
export function useAnimeSearch(query: string, page: number = 1, limit: number = 25) {
  // Only start searching when the query has at least 3 characters
  const shouldFetch = query && query.length >= 3;
  const key = shouldFetch ? `searchAnimeByText:${query}` : null;
  
  const { data, error, isLoading } = useSWR(
    key,
    (key) => key ? fetcher(key as string, page, limit) : null
  );
  
  return {
    anime: data?.data as AnimeBasic[] | undefined,
    pagination: data?.pagination,
    isLoading: shouldFetch && isLoading,
    isError: error
  };
}

/**
 * Hook for infinite loading anime
 */
export function useInfiniteAnime(params: SearchParams = {}) {
  const getKey = (pageIndex: number, previousPageData: JikanResponse<AnimeBasic[]>) => {
    // Reached the end
    if (previousPageData && !previousPageData.pagination.has_next_page) return null;
    
    // First page, we don't have previousPageData
    if (pageIndex === 0) return ['anime:search', { ...params, page: 1 }];
    
    // Add the page parameter to the params
    return ['anime:search', { ...params, page: pageIndex + 1 }];
  };

  const { data, error, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.data?.length === 0;
  const isReachingEnd = isEmpty || (data && !data[data.length - 1]?.pagination.has_next_page);
  
  // Flatten the data array
  const animeList = data ? data.flatMap(page => page.data) : [];

  return {
    animeList,
    error,
    isLoadingMore,
    isReachingEnd,
    size,
    setSize,
    isValidating,
  };
} 