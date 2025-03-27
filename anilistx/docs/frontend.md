# Frontend Implementation

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- SWR for data fetching
- Jikan API (Unofficial MyAnimeList API)

## Current Implementation

### Component Structure
- `components/` - Reusable UI components
  - `ui/` - Basic UI components from shadcn
  - `anime/` - Anime-specific components
    - `hero-section.tsx` - Featured anime display
    - `anime-card.tsx` - Individual anime display card
    - `anime-card-skeleton.tsx` - Loading state for cards
    - `top-anime-section.tsx` - Top anime display
    - `seasonal-anime-section.tsx` - Seasonal anime display
    - `search-filters.tsx` - Advanced search filters

### Pages Structure
- `app/page.tsx` - Homepage with hero, top anime, and seasonal sections
- `app/search/page.tsx` - Search with advanced filters
- `app/top/page.tsx` - Top anime rankings
- `app/seasonal/page.tsx` - Seasonal anime display
- `app/anime/[id]/page.tsx` - Detailed anime information page

### Current Issues

Currently, the frontend is experiencing several issues:

1. **Secondary Pages Not Working:**
   - Only the homepage is functioning correctly
   - Seasonal, Top, Search, and Anime Detail pages are failing due to API errors

2. **"listener" Error in Secondary Pages:**
   Error occurs in jikanjs implementation:
   ```
   Error: The "listener" argument must be of type Function. Received type object
   
   in lib/jikan.ts at getSeasonalAnime function when using:
   jikanjs.raw(['seasons', 'now'], { page: page, limit: limit })
   ```

3. **Next.js Configuration Warning:**
   - "Unrecognized key(s) in object: 'remote' at images" in next.config.ts
   - Need to correct the image domains configuration

4. **API Integration Inconsistency:**
   - Homepage successfully uses jikan-ts implementation
   - Other pages still rely on the problematic jikanjs implementation

### Data Fetching
We've implemented a robust data fetching strategy:

1. **SWR Integration:**
   - Custom hooks in `lib/hooks-axios.ts` and `lib/hooks.ts`
   - Automatic caching and revalidation
   - Loading and error states
   - Pagination support via `useSWRInfinite`

2. **API Service Layer:**
   - `lib/jikan-axios.ts` - Primary jikan-ts implementation
   - `lib/jikan.ts` - Secondary jikanjs implementation
   - Type definitions for API responses
   - Error handling and logging

### UI Features
- **Responsive Design:**
  - Mobile-first approach
  - Flexible layouts
  - Responsive image handling

- **Image Optimization:**
  - Next.js Image component
  - CDN domain configuration
  - Lazy loading with priority flags
  - Proper sizing and quality control

- **Theme Support:**
  - Dark/light mode toggle
  - System preference detection
  - Consistent theming with Tailwind

### Performance Optimizations
- Component-level code splitting
- Image optimization through Next.js
- Efficient data fetching with SWR
- Skeleton loaders for loading states

## Current Functionality
- Browse top anime
- Explore seasonal anime
- View detailed anime information
- Search with advanced filters
- Responsive design across devices

## Next Steps
1. Fix jikanjs "listener" error affecting secondary pages
2. Complete migration from jikanjs to jikan-ts for all pages
3. Fix Next.js config warning by removing 'remote' key
4. Implement user authentication UI
5. Create profile page and list management
6. Build settings page
7. Add user preference controls
8. Enhance accessibility features

## Design Guidelines
- Modern, clean interface
- Responsive design
- Optimized for both light and dark modes
- Focus on readability and usability
- Smooth animations and transitions

## Performance Considerations
- Image optimization
- Code splitting
- Server-side rendering where appropriate
- Efficient data fetching and caching
