import { atom } from 'jotai';

// User preferences
export const themeAtom = atom<'light' | 'dark' | 'system'>('system');
export const listViewAtom = atom<'grid' | 'list'>('grid');
export const gridSizeAtom = atom<'small' | 'medium' | 'large'>('medium');
export const itemsPerPageAtom = atom<number>(24);

// Search state
export interface SearchFilters {
  query: string;
  type: string;
  status: string;
  genres: number[];
  minScore: number;
  maxScore: number;
  year: number | null;
  season: string | null;
  orderBy: string;
  sort: 'desc' | 'asc';
}

export const defaultSearchFilters: SearchFilters = {
  query: '',
  type: '',
  status: '',
  genres: [],
  minScore: 0,
  maxScore: 10,
  year: null,
  season: null,
  orderBy: 'score',
  sort: 'desc',
};

export const searchFiltersAtom = atom<SearchFilters>(defaultSearchFilters);

// User anime list state
export interface AnimeListItem {
  animeId: number;
  status: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  score: number;
  episodesWatched: number;
  notes: string;
}

export const userAnimeListAtom = atom<Map<number, AnimeListItem>>(new Map());

// Loading states
export const isLoadingAtom = atom<boolean>(false);

// Sidebar state
export const isSidebarOpenAtom = atom<boolean>(false);

// Mobile menu state
export const isMobileMenuOpenAtom = atom<boolean>(false);

// Auth state
export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export const userAtom = atom<User | null>(null);
export const isAuthLoadingAtom = atom<boolean>(true); 