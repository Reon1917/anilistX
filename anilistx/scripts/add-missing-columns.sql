-- Add missing columns to anime_lists table
ALTER TABLE anime_lists
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS type TEXT,
ADD COLUMN IF NOT EXISTS episodes INTEGER,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS studio TEXT,
ADD COLUMN IF NOT EXISTS mal_score NUMERIC(3,2);

-- Make title NOT NULL with a default value for existing rows
UPDATE anime_lists
SET title = 'Unknown Anime'
WHERE title IS NULL;

ALTER TABLE anime_lists
ALTER COLUMN title SET NOT NULL;

-- Enable RLS if not already enabled (should be from your original script)
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Drop potentially conflicting policies if they exist
DROP POLICY IF EXISTS "Users can insert their own analytics record" ON user_analytics;
DROP POLICY IF EXISTS "Users can update their own analytics record" ON user_analytics;
DROP POLICY IF EXISTS "System can update analytics" ON user_analytics; -- Drop the old less secure update policy
DROP POLICY IF EXISTS "Users can delete their own analytics record" ON user_analytics;

-- Add INSERT policy
CREATE POLICY "Users can insert their own analytics record"
  ON user_analytics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add secure UPDATE policy
CREATE POLICY "Users can update their own analytics record"
  ON user_analytics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add DELETE policy
CREATE POLICY "Users can delete their own analytics record"
  ON user_analytics FOR DELETE
  USING (auth.uid() = user_id);

-- Policy for SELECT remains the same (ensure it exists)
-- CREATE POLICY "Users can view their own analytics or public analytics"
--   ON user_analytics FOR SELECT
--   USING (
--     auth.uid() = user_id OR
--     EXISTS (
--       SELECT 1 FROM user_preferences
--       WHERE user_preferences.user_id = user_analytics.user_id
--       AND user_preferences.analytics_public = true
--     )
--   );
