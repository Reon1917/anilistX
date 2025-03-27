import { describe, it, expect, vi, beforeEach } from 'vitest';
import jikanTsService from '../lib/jikan-axios';

// Mock the JikanClient and AnimeClient
vi.mock('@tutkli/jikan-ts', () => {
  return {
    JikanClient: vi.fn().mockImplementation(() => ({
      anime: {
        getAnimeSearch: vi.fn().mockResolvedValue({
          data: [{ title: 'Anime 1' }, { title: 'Anime 2' }],
          pagination: { has_next_page: true, current_page: 1 }
        }),
        getAnimeById: vi.fn().mockResolvedValue({
          data: { title: 'Anime 1', synopsis: 'Test synopsis' }
        }),
        getAnimeRecommendations: vi.fn().mockResolvedValue({
          data: [{ title: 'Recommended Anime' }]
        })
      },
      top: {
        getTopAnime: vi.fn().mockResolvedValue({
          data: [{ title: 'Top Anime 1' }, { title: 'Top Anime 2' }],
          pagination: { has_next_page: true, current_page: 1 }
        })
      },
      seasons: {
        getSeason: vi.fn().mockResolvedValue({
          data: [{ title: 'Seasonal Anime 1' }, { title: 'Seasonal Anime 2' }],
          pagination: { has_next_page: true, current_page: 1 }
        }),
        getNow: vi.fn().mockResolvedValue({
          data: [{ title: 'Current Season Anime' }],
          pagination: { has_next_page: false, current_page: 1 }
        })
      },
      genres: {
        getAnimeGenres: vi.fn().mockResolvedValue({
          data: [{ name: 'Action' }, { name: 'Comedy' }]
        })
      }
    }))
  };
});

describe('JikanTsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search anime', async () => {
    const result = await jikanTsService.searchAnime({ q: 'Naruto' });
    expect(result.data).toHaveLength(2);
    expect(result.data[0].title).toBe('Anime 1');
  });

  it('should get anime by id', async () => {
    const result = await jikanTsService.getAnimeById(1);
    expect(result.title).toBe('Anime 1');
    expect(result.synopsis).toBe('Test synopsis');
  });

  it('should get top anime', async () => {
    const result = await jikanTsService.getTopAnime();
    expect(result.data).toHaveLength(2);
    expect(result.data[0].title).toBe('Top Anime 1');
  });

  it('should get seasonal anime with year and season', async () => {
    const result = await jikanTsService.getSeasonalAnime(2023, 'winter');
    expect(result.data).toHaveLength(2);
    expect(result.data[0].title).toBe('Seasonal Anime 1');
  });

  it('should get current seasonal anime without parameters', async () => {
    const result = await jikanTsService.getSeasonalAnime();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Current Season Anime');
  });

  it('should get anime recommendations', async () => {
    const result = await jikanTsService.getAnimeRecommendations(1);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].title).toBe('Recommended Anime');
  });

  it('should get anime genres', async () => {
    const result = await jikanTsService.getGenres();
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('Action');
  });
}); 