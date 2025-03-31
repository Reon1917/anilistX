-- Debug script for testing get_user_anime_stats function
-- Run this in Supabase SQL Editor to debug the function

-- 1. Check if the function exists
SELECT proname, proargtypes, pronargs, prorettype 
FROM pg_proc 
WHERE proname = 'get_user_anime_stats';

-- 2. Check if user_analytics table exists and has proper structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_analytics'
ORDER BY ordinal_position;

-- 3. Check permissions on tables
SELECT grantee, table_name, privilege_type
FROM information_schema.role_table_grants
WHERE table_name IN ('user_analytics', 'anime_lists')
ORDER BY table_name, grantee;

-- 4. Run a count query directly to compare results
SELECT 
  COUNT(*) as total_anime,
  COUNT(*) FILTER (WHERE status = 'watching') as watching,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'on_hold') as on_hold,
  COUNT(*) FILTER (WHERE status = 'dropped') as dropped,
  COUNT(*) FILTER (WHERE status = 'plan_to_watch') as plan_to_watch,
  COALESCE(SUM(episodes_watched), 0) as total_episodes,
  COALESCE(AVG(score) FILTER (WHERE score > 0), 0) as average_score,
  COALESCE(MAX(score) FILTER (WHERE score > 0), 0) as highest_score
FROM anime_lists
WHERE user_id = 'YOUR_TEST_USER_ID';

-- 5. Try running the function directly with a user ID
-- Replace YOUR_TEST_USER_ID with an actual UUID
SELECT * FROM get_user_anime_stats('YOUR_TEST_USER_ID');

-- 6. Check if any analytics data exists in the cache table
SELECT * FROM user_analytics LIMIT 10;

-- 7. Manually insert a test record into user_analytics to test the caching logic
INSERT INTO user_analytics (
  user_id,
  total_anime_count,
  watching_count,
  completed_count,
  on_hold_count,
  dropped_count,
  plan_to_watch_count,
  total_episodes_watched,
  average_score,
  last_calculated
)
VALUES (
  'YOUR_TEST_USER_ID',
  100, -- test value
  10,  -- test value
  50,  -- test value
  5,   -- test value
  5,   -- test value
  30,  -- test value
  500, -- test value
  7.5, -- test value
  NOW() -- current timestamp
)
ON CONFLICT (user_id)
DO UPDATE SET
  last_calculated = NOW();

-- 8. Run the function again to test the caching path
SELECT * FROM get_user_anime_stats('YOUR_TEST_USER_ID');

-- 9. Check RLS policies on the relevant tables
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('user_analytics', 'anime_lists');

-- 10. Optional cleanup: Delete test data from user_analytics
-- DELETE FROM user_analytics WHERE user_id = 'YOUR_TEST_USER_ID'; 