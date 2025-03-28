// This file provides a compatibility layer to ensure consistent hook usage
import { 
  useTopAnime as useTopAnimeAxios,
  useSeasonalAnime as useSeasonalAnimeAxios
} from './hooks-axios';

// Re-export the hooks from hooks-axios but transform the return structure to match
// what's expected in the components

export function useTopAnime(filter: string = '', page: number = 1, limit: number = 25) {
  const result = useTopAnimeAxios(filter, page, limit);
  
  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError
  };
}

export function useSeasonalAnime(year?: number, season?: string, page: number = 1, limit: number = 25) {
  const result = useSeasonalAnimeAxios(year, season, page, limit);
  
  return {
    data: result.data,
    isLoading: result.isLoading,
    isError: result.isError
  };
} 