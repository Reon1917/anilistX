# Backend Implementation

## Tech Stack
- Supabase for authentication and database
- Next.js API routes for middleware
- Jikan API for anime data

## Database Schema

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
