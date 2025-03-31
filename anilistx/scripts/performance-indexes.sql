-- Performance indexes for user statistics function
-- These indexes significantly improve the performance of user anime stat calculations

-- Index on anime_lists user_id for faster filtering by user
CREATE INDEX IF NOT EXISTS idx_anime_lists_user_id 
ON anime_lists(user_id);

-- Index on anime_lists status for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_anime_lists_status 
ON anime_lists(status);

-- Composite index on anime_lists for both user_id and status filtering
-- This is the most important one for the user stats function
CREATE INDEX IF NOT EXISTS idx_anime_lists_user_status 
ON anime_lists(user_id, status);

-- Index on anime_lists for episode count calculations
CREATE INDEX IF NOT EXISTS idx_anime_lists_episodes_watched 
ON anime_lists(user_id, episodes_watched);

-- Index on anime_lists for score calculations
CREATE INDEX IF NOT EXISTS idx_anime_lists_score 
ON anime_lists(user_id, score);

-- Index on user_analytics last_calculated to optimize cache check
CREATE INDEX IF NOT EXISTS idx_user_analytics_last_calc 
ON user_analytics(user_id, last_calculated);

-- Add partial index for score > 0 to optimize average score calculations
CREATE INDEX IF NOT EXISTS idx_anime_lists_score_positive
ON anime_lists(user_id, score) 
WHERE score > 0;

-- ANALYZE to update statistics for query planner
ANALYZE anime_lists;
ANALYZE user_analytics; 