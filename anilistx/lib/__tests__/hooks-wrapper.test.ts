import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSeasonalAnime } from '../hooks-wrapper';
import jikanTsService from '../jikan-axios';

// Mock the jikan-axios service
vi.mock('../jikan-axios', () => ({
  default: {
    getSeasonalAnime: vi.fn()
  }
}));

describe('useSeasonalAnime', () => {
  const mockResponse = {
    data: [{ mal_id: 1, title: 'Test Anime' }],
    pagination: { has_next_page: false, current_page: 1, last_visible_page: 1 }
  };
  
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
    
    // Default mock implementation
    (jikanTsService.getSeasonalAnime as any).mockResolvedValue(mockResponse);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should fetch seasonal anime', async () => {
    const { result } = renderHook(() => useSeasonalAnime(2023, 'winter', 1, 25));
    
    // Initial state should be loading
    expect(result.current.isLoading).toBeTruthy();
    
    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    
    // Should have called the service
    expect(jikanTsService.getSeasonalAnime).toHaveBeenCalledWith(2023, 'winter', 1, 25);
    
    // Should have the correct data
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.isError).toBeFalsy();
  });
  
  it('should handle changing year and season', async () => {
    // Initial render with winter 2023
    const { result, rerender } = renderHook(
      (props) => useSeasonalAnime(props.year, props.season, 1, 25),
      { initialProps: { year: 2023, season: 'winter' } }
    );
    
    // Wait for initial fetch
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    expect(jikanTsService.getSeasonalAnime).toHaveBeenCalledWith(2023, 'winter', 1, 25);
    
    // Change to spring 2023
    (jikanTsService.getSeasonalAnime as any).mockResolvedValue({
      ...mockResponse,
      data: [{ mal_id: 2, title: 'Spring Anime' }]
    });
    
    // Rerender with new props
    rerender({ year: 2023, season: 'spring' });
    
    // Should be loading again
    expect(result.current.isLoading).toBeTruthy();
    
    // Wait for the second fetch
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    
    // Should have called with new parameters
    expect(jikanTsService.getSeasonalAnime).toHaveBeenCalledWith(2023, 'spring', 1, 25);
    
    // Should have updated data
    expect(result.current.data?.data[0].title).toBe('Spring Anime');
  });
  
  it('should handle errors gracefully', async () => {
    // Make the fetch fail
    const error = new Error('Failed to fetch');
    (jikanTsService.getSeasonalAnime as any).mockRejectedValue(error);
    
    const { result } = renderHook(() => useSeasonalAnime(2023, 'winter', 1, 25));
    
    // Wait for the fetch to complete
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    
    // Should have error state
    expect(result.current.isError).toBeTruthy();
    expect(result.current.data).toBeUndefined();
  });
  
  it('should handle race conditions properly', async () => {
    // Set up slow response for first request
    const slowResponse = new Promise(resolve => {
      setTimeout(() => resolve({
        ...mockResponse,
        data: [{ mal_id: 1, title: 'Slow Response' }]
      }), 100);
    });
    
    // Set up fast response for second request
    const fastResponse = Promise.resolve({
      ...mockResponse,
      data: [{ mal_id: 2, title: 'Fast Response' }]
    });
    
    // First call will return slow response
    (jikanTsService.getSeasonalAnime as any).mockImplementationOnce(() => slowResponse);
    
    // Second call will return fast response
    (jikanTsService.getSeasonalAnime as any).mockImplementationOnce(() => fastResponse);
    
    // Initial render
    const { result, rerender } = renderHook(
      (props) => useSeasonalAnime(props.year, props.season, 1, 25, props.version),
      { initialProps: { year: 2023, season: 'winter', version: 1 } }
    );
    
    // Immediately change parameters to trigger second request
    rerender({ year: 2023, season: 'spring', version: 2 });
    
    // Wait for fetch to complete
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    
    // Should have the data from the fast (second) request, not the slow (first) request
    expect(result.current.data?.data[0].title).toBe('Fast Response');
  });
}); 