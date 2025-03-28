import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import jikanTsService from './jikan-axios';
import { SearchParams, AnimeBasic, JikanResponse } from './jikan';

// Fetcher function for SWR
const fetcher = async (url: string, params: any) => {
  const [endpoint, method] = url.split(':');
  
  switch (endpoint) {
    case 'anime':
      switch (method) {
        case 'search':
          return jikanTsService.searchAnime(params);
        case 'id':
          return jikanTsService.getAnimeById(Number(params.id));
        case 'top':
          return jikanTsService.getTopAnime(params.filter, params.page, params.limit);
        case 'seasonal':
          return jikanTsService.getSeasonalAnime(params.year, params.season, params.page, params.limit);
        case 'recommendations':
          return jikanTsService.getAnimeRecommendations(Number(params.id), params.page, params.limit);
        default:
          throw new Error(`Unknown method: ${method}`);
      }
    case 'genres':
      return jikanTsService.getGenres();
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

/**
 * Hook for searching anime
 */
export function useAnimeSearch(params: SearchParams = {}, shouldFetch: boolean = true) {
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['anime:search', params] : null,
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    data: data as JikanResponse<AnimeBasic[]> | undefined,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook for getting anime by ID
 */
export function useAnimeById(id: number | null) {
  const { data, error, isLoading } = useSWR(
    id ? ['anime:id', { id }] : null,
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    anime: data as AnimeBasic | undefined,
    isLoading,
    isError: error,
  };
}

/**
 * Hook for getting top anime
 */
export function useTopAnime(filter: string = '', page: number = 1, limit: number = 25) {
  const { data, error, isLoading } = useSWR(
    ['anime:top', { filter, page, limit }],
    ([url, params]) => fetcher(url, params),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    data: data as JikanResponse<AnimeBasic[]> | undefined,
    isLoading,
    isError: error,
  };
}

/**
 * Hook for getting seasonal anime
 */
export function useSeasonalAnime(year?: number, season?: string, page: number = 1, limit: number = 25) {
  // Create a string key instead of an array to avoid type issues
  const cacheKey = `anime:seasonal:${year || 'current'}:${season || 'current'}:${page}:${limit}`;
  
  const { data, error, isLoading } = useSWR(
    cacheKey,
    () => {
      const params = { year, season, page, limit };
      return jikanTsService.getSeasonalAnime(params.year, params.season, params.page, params.limit);
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      // Always revalidate on mount
      revalidateOnMount: true,
      // Added to prevent stale data issues with changing year/season
      dedupingInterval: 0
    }
  );

  return {
    data: data as JikanResponse<AnimeBasic[]> | undefined,
    isLoading,
    isError: error
  };
}

/**
 * Hook for getting anime genres
 */
export function useAnimeGenres() {
  const { data, error, isLoading } = useSWR(
    'genres',
    (url) => fetcher(url, {}),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return {
    genres: data?.data || [],
    isLoading,
    isError: error,
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