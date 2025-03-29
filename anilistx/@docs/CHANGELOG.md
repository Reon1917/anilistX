# Changelog

## [Unreleased]

### Added
- New Collection feature to allow users to manage their anime collection
  - Added ability to search for anime using Jikan API
  - Users can add anime to their collection with status and score
  - Collection page with filtering by status (watching, completed, etc.)
  - Remove anime from collection functionality

### Changed
- Updated navigation to replace Search and Anime links with My Collection
- Improved mobile navigation to match main navigation changes
- Updated hero section links to point to collection instead of search

### Removed
- Search page (/search)
- Anime detail pages (/anime/[id])

## Database Schema Updates
- Added `anime_lists` table with the following fields:
  - id (Primary Key)
  - user_id (Foreign Key to auth.users)
  - anime_id (Anime identifier from external API)
  - title
  - image_url
  - type
  - episodes
  - status (watching, completed, on_hold, dropped, plan_to_watch)
  - score (0-10)
  - year
  - studio
  - mal_score (score from MyAnimeList)
  - created_at
  - updated_at
- Added Row-Level Security policies to ensure users can only access their own anime lists
- Added trigger to automatically update the `updated_at` timestamp 