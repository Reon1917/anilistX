# Backend Implementation

## Tech Stack
- Supabase for authentication and database
- Next.js API routes for middleware
- Jikan API for anime data
- jikan-ts and jikanjs for API integration

## Current Implementation Status

### Jikan API Integration
We've implemented a dual-approach system for accessing the Jikan API:

1. **Primary Implementation (jikan-ts):**
   - Fully typed TypeScript wrapper for Jikan API
   - Built-in HTTP request caching using axios-cache-interceptor
   - Resilient implementation with fallback mechanisms
   - Organized into specialized clients (AnimeClient, TopClient, etc.)
   - Clean error handling and logging capabilities

2. **Secondary Implementation (jikanjs):**
   - Using @mateoaranda/jikanjs as a fallback
   - Direct raw API access through the raw() method
   - Customized to match our data types and service structure

### Service Layer
Our service layer is structured around these components:

1. **JikanTsService:**
   - Singleton service instance using jikan-ts
   - Methods for fetching anime, genres, recommendations, etc.
   - Type-safe responses with proper error handling
   - Automatically handles pagination and filtering

2. **SWR Integration:**
   - Custom hooks built on top of SWR for data fetching
   - Automatic caching and revalidation
   - Optimistic UI updates
   - Loading and error states

### Current API Issues

The application is currently facing several critical issues with the API integration:

1. **jikanjs "listener" Error:**
   ```
   Error: The "listener" argument must be of type Function. Received type object
   ```
   This occurs in the `getSeasonalAnime` function when using `jikanjs.raw(['seasons', 'now'], {...})`. The error suggests that jikanjs is expecting a function as a parameter, but is receiving an object.

2. **Method Signature Mismatches:**
   - The jikan-ts library has inconsistent method signatures that don't match our tests
   - Primary affected methods:
     - `seasons.getSeasonsList` vs `seasons.getSeason`
     - `seasons.getCurrentSeason` vs `seasons.getNow`

3. **Partial Implementation:**
   - The primary implementation (jikan-ts) is working on the homepage
   - Secondary pages (seasonal, top, search, details) are still using the jikanjs implementation which is failing

4. **Next.js Config Warning:**
   - "Unrecognized key(s) in object: 'remote' at images" in next.config.ts

### Data Flow Architecture
```
UI Components → SWR Hooks → JikanTsService → jikan-ts Client → Jikan API
                                  ↓
                          Fallback mechanisms
                                  ↓
                          JikanJS raw() calls
```

### Error Handling Strategy
- Primary try/catch blocks in service methods
- Fallback mechanisms when API methods don't match expectations
- Detailed console logging for API errors
- SWR error states exposed to UI components

### Testing Implementation
- Vitest for unit testing
- Mock implementation of jikan-ts API
- Tests for all core service methods
- Isolates API testing from UI components

## Database Schema (Planned)

### Users Table
Extends Supabase Auth with user-specific data:
```sql
-- Extended user profile data
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Anime Lists Table
```sql
-- Main user anime lists table
CREATE TABLE anime_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  anime_id INTEGER NOT NULL, -- MAL ID from Jikan API
  status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch')),
  score INTEGER CHECK (score >= 0 AND score <= 10),
  episodes_watched INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, anime_id)
);
```

### User Preferences
```sql
-- User preferences for UI and functionality
CREATE TABLE user_preferences (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  list_view_type TEXT DEFAULT 'grid',
  items_per_page INTEGER DEFAULT 24,
  default_list TEXT DEFAULT 'watching',
  privacy_setting TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Next Steps
1. Implement database tables and Row-Level Security
2. Build middleware API routes for list management
3. Create user preference system
4. Optimize API caching strategies
5. Build authentication flow and protected routes

## API Structure

### External API Integration
- Jikan API Client
  - Anime search
  - Anime details
  - Seasonal anime
  - Top anime
  - Genre listings

### Internal API Routes
- `/api/lists` - User anime list management
- `/api/user` - User profile management
- `/api/preferences` - User preferences

## Data Flow
1. Frontend requests data via internal API routes
2. API routes fetch from Jikan API if anime data needed
3. API routes interact with Supabase for user data
4. Results are returned to frontend

## Caching Strategy
- Server-side caching for Jikan API responses
- Client-side caching for static data
- Real-time subscriptions for user data changes

## Security Considerations
- Rate limiting for API routes
- Input validation
- Row-level security in Supabase
- Authentication checks on all private routes
