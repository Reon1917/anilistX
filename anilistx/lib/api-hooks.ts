// Consolidated API Hooks file that combines functionality from previous hook files
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { useState, useEffect, useRef, useCallback } from 'react';
import jikanTsService from './jikan-axios';
import { SearchParams, AnimeBasic, JikanResponse } from './jikan';

// Fetcher function for SWR
const fetcher = async (url: string, params: Record<string, unknown>) => {
  const [endpoint, method] = url.split(':');
  
  switch (endpoint) {
    case 'anime':
      switch (method) {
        case 'search':
          return jikanTsService.searchAnime(params as SearchParams);
        case 'id':
          return jikanTsService.getAnimeById(Number(params.id));
        case 'top':
          return jikanTsService.getTopAnime(
            params.filter as string, 
            params.page as number, 
            params.limit as number
          );
        case 'seasonal':
          return jikanTsService.getSeasonalAnime(
            params.year as number | undefined, 
            params.season as string | undefined, 
            params.page as number, 
            params.limit as number
          );
        case 'recommendations':
          return jikanTsService.getAnimeRecommendations(
            Number(params.id), 
            params.page as number, 
            params.limit as number
          );
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
 * Enhanced hook for getting top anime with better error handling and race condition prevention
 */
export function useTopAnime(filter: string = '', page: number = 1, limit: number = 25, version: number = 0) {
  // Track the latest request to avoid race conditions
  const latestRequestRef = useRef<string>('');
  // Track active requests to cancel outdated ones
  const requestsInFlightRef = useRef<Map<string, boolean>>(new Map());
  
  // Add fallback data for when API fails
  const fallbackData: JikanResponse<AnimeBasic[]> = {
    data: [],
    pagination: {
      has_next_page: false,
      current_page: page,
      last_visible_page: 1,
      items: { count: 0, total: 0, per_page: limit }
    }
  };
  
  // Create a memoized fetch function that handles race conditions
  const fetchTopAnime = useCallback(async () => {
    // Create a unique key for this specific request inside the callback
    const requestId = `${filter || 'all'}_${page}_${limit}_${version}`;
    
    // Set this as the latest request
    latestRequestRef.current = requestId;
    // Mark this request as in-flight
    requestsInFlightRef.current.set(requestId, true);
    
    try {
      // Check if this is still the latest request before even making the API call
      if (latestRequestRef.current !== requestId) {
        // Rather than throwing, just silently return null to be handled by SWR
        return null;
      }
      
      const result = await jikanTsService.getTopAnime(filter, page, limit);
      
      // Only return the result if this is still the latest request
      if (latestRequestRef.current === requestId) {
        // Remove this request from in-flight tracking
        requestsInFlightRef.current.delete(requestId);
        
        // Validate that the result has the expected structure
        if (result && Array.isArray(result.data) && result.pagination) {
          return result;
        }
        
        // If data structure is invalid, return fallback
        console.warn('Invalid data structure received from API:', result);
        return fallbackData;
      }
      
      // Otherwise silently cancel this request's update
      requestsInFlightRef.current.delete(requestId);
      return null;
    } catch (error) {
      // Remove this request from in-flight tracking
      requestsInFlightRef.current.delete(requestId);
      
      console.error('Error fetching top anime:', error);
      
      // Return fallback data for all errors
      return fallbackData;
    }
  }, [filter, page, limit, version, fallbackData]);
  
  // Use SWR with a custom key to ensure different parameters trigger refetches
  const cacheKey = `top:${filter || 'all'}:${page}:${limit}:${version}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    fetchTopAnime,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      dedupingInterval: 0,
      errorRetryCount: 3,
      // Add fallback data to prevent UI errors when there's no data
      fallbackData,
    }
  );
  
  // Clean up stale requests when unmounting
  useEffect(() => {
    return () => {
      requestsInFlightRef.current.clear();
    };
  }, []);
  
  // Add a useEffect hook to force a refresh when the cache key changes
  useEffect(() => {
    // Immediately refresh data when the key changes
    mutate();
  }, [cacheKey, mutate]);
  
  return {
    // Always ensure we return data with the expected structure
    data: data || fallbackData,
    isLoading,
    isError: error,
    refresh: () => mutate() // Expose refresh function to manually trigger refetching
  };
}

/**
 * Enhanced hook for getting seasonal anime with better error handling
 */
export function useSeasonalAnime(year?: number, season?: string, page: number = 1, limit: number = 25, version: number = 0) {
  // Track the latest request to avoid race conditions
  const latestRequestRef = useRef<string>('');
  // Track active requests to cancel outdated ones
  const requestsInFlightRef = useRef<Map<string, boolean>>(new Map());
  
  // Add fallback data for when API fails
  const fallbackData: JikanResponse<AnimeBasic[]> = {
    data: [],
    pagination: {
      has_next_page: false,
      current_page: page,
      last_visible_page: 1,
      items: { count: 0, total: 0, per_page: limit }
    }
  };
  
  // Create a memoized fetch function that handles race conditions
  const fetchSeasonalAnime = useCallback(async () => {
    // Create a unique key for this specific request inside the callback
    const requestId = `${year || 'current'}_${season || 'current'}_${page}_${limit}_${version}`;
    
    // Set this as the latest request
    latestRequestRef.current = requestId;
    // Mark this request as in-flight
    requestsInFlightRef.current.set(requestId, true);
    
    try {
      // Check if this is still the latest request before even making the API call
      if (latestRequestRef.current !== requestId) {
        // Rather than throwing, just silently return null to be handled by SWR
        return null;
      }
      
      const result = await jikanTsService.getSeasonalAnime(year, season, page, limit);
      
      // Only return the result if this is still the latest request
      if (latestRequestRef.current === requestId) {
        // Remove this request from in-flight tracking
        requestsInFlightRef.current.delete(requestId);
        
        // If we got empty data and there was no explicit error, still return it
        if (result && Array.isArray(result.data) && result.data.length === 0) {
          return result;
        }
        
        // Validate that the result has the expected structure
        if (result && Array.isArray(result.data) && result.pagination) {
          return result;
        }
        
        // If data structure is invalid, return fallback
        console.warn('Invalid data structure received from API:', result);
        return fallbackData;
      }
      
      // Otherwise silently cancel this request's update
      requestsInFlightRef.current.delete(requestId);
      return null;
    } catch (error) {
      // Remove this request from in-flight tracking
      requestsInFlightRef.current.delete(requestId);
      
      console.error('Error fetching seasonal anime:', error);
      
      // Return fallback data for all errors
      return fallbackData;
    }
  }, [year, season, page, limit, version, fallbackData]);
  
  // Use SWR with a custom key to ensure different parameters trigger refetches
  const cacheKey = `seasonal:${year || 'current'}:${season || 'current'}:${page}:${limit}:${version}`;
  
  const { data, error, isLoading, mutate } = useSWR(
    cacheKey,
    fetchSeasonalAnime,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnMount: true,
      dedupingInterval: 0,
      errorRetryCount: 3,
      // Add fallback data to prevent UI errors when there's no data
      fallbackData,
    }
  );
  
  // Clean up stale requests when unmounting
  useEffect(() => {
    return () => {
      requestsInFlightRef.current.clear();
    };
  }, []);
  
  // Add a useEffect hook to force a refresh when the cache key changes
  useEffect(() => {
    // Immediately refresh data when the key changes
    mutate();
  }, [cacheKey, mutate]);
  
  return {
    // Always ensure we return data with the expected structure
    data: data || fallbackData,
    isLoading,
    isError: error,
    refresh: () => mutate() // Expose refresh function to manually trigger refetching
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