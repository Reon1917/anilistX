// This file provides a compatibility layer to ensure consistent hook usage
import { 
  useTopAnime as useTopAnimeAxios,
  useSeasonalAnime as useSeasonalAnimeAxios
} from './hooks-axios';
import { useState, useEffect, useRef, useCallback } from 'react';
import jikanTsService from './jikan-axios';
import { JikanResponse, AnimeBasic } from './jikan';
import useSWR from 'swr';

// Re-export the hooks from hooks-axios but transform the return structure to match
// what's expected in the components

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
      loadingTimeout: 8000, // Set timeout for isLoading state
      shouldRetryOnError: (err) => {
        // Don't retry on null returns (canceled requests)
        return err !== null;
      },
      // Add fallback data to prevent UI errors when there's no data
      fallbackData,
      suspense: false, // Ensure we're not using suspense which can cause issues
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

// A more robust implementation with memoization and handling stale requests
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
  // Include all parameters in the cache key to ensure proper invalidation
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
      loadingTimeout: 8000, // Set timeout for isLoading state
      shouldRetryOnError: (err) => {
        // Don't retry on null returns (canceled requests)
        return err !== null;
      },
      // Add fallback data to prevent UI errors when there's no data
      fallbackData,
      suspense: false, // Ensure we're not using suspense which can cause issues
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