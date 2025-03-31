-- Alternative simpler version of the user anime stats function
-- This uses direct queries without WITH clauses or temporary tables
-- Use this if the more complex function has compatibility issues

CREATE OR REPLACE FUNCTION get_user_anime_stats_simple(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
  total_anime INTEGER;
  watching INTEGER;
  completed INTEGER;
  on_hold INTEGER;
  dropped INTEGER;
  plan_to_watch INTEGER;
  total_episodes INTEGER;
  average_score DECIMAL(4,2);
  highest_score INTEGER;
  result JSONB;
BEGIN
  -- Get total anime count
  SELECT COUNT(*) INTO total_anime
  FROM anime_lists
  WHERE user_id = user_id_param;
  
  -- Get watching count
  SELECT COUNT(*) INTO watching
  FROM anime_lists
  WHERE user_id = user_id_param AND status = 'watching';
  
  -- Get completed count
  SELECT COUNT(*) INTO completed
  FROM anime_lists
  WHERE user_id = user_id_param AND status = 'completed';
  
  -- Get on_hold count
  SELECT COUNT(*) INTO on_hold
  FROM anime_lists
  WHERE user_id = user_id_param AND status = 'on_hold';
  
  -- Get dropped count
  SELECT COUNT(*) INTO dropped
  FROM anime_lists
  WHERE user_id = user_id_param AND status = 'dropped';
  
  -- Get plan_to_watch count
  SELECT COUNT(*) INTO plan_to_watch
  FROM anime_lists
  WHERE user_id = user_id_param AND status = 'plan_to_watch';
  
  -- Get total episodes watched
  SELECT COALESCE(SUM(episodes_watched), 0) INTO total_episodes
  FROM anime_lists
  WHERE user_id = user_id_param;
  
  -- Get average score
  SELECT COALESCE(AVG(score), 0) INTO average_score
  FROM anime_lists
  WHERE user_id = user_id_param AND score > 0;
  
  -- Get highest score
  SELECT COALESCE(MAX(score), 0) INTO highest_score
  FROM anime_lists
  WHERE user_id = user_id_param AND score > 0;
  
  -- Create result JSONB object
  result := jsonb_build_object(
    'total_anime', total_anime,
    'watching', watching,
    'completed', completed,
    'on_hold', on_hold,
    'dropped', dropped,
    'plan_to_watch', plan_to_watch,
    'total_episodes', total_episodes,
    'average_score', average_score,
    'highest_score', highest_score
  );
  
  -- Try to update the analytics table for future use
  BEGIN
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
      user_id_param,
      total_anime,
      watching,
      completed,
      on_hold,
      dropped,
      plan_to_watch,
      total_episodes,
      average_score,
      NOW()
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_anime_count = EXCLUDED.total_anime_count,
      watching_count = EXCLUDED.watching_count,
      completed_count = EXCLUDED.completed_count,
      on_hold_count = EXCLUDED.on_hold_count,
      dropped_count = EXCLUDED.dropped_count,
      plan_to_watch_count = EXCLUDED.plan_to_watch_count,
      total_episodes_watched = EXCLUDED.total_episodes_watched,
      average_score = EXCLUDED.average_score,
      last_calculated = EXCLUDED.last_calculated;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log error but continue
      RAISE NOTICE 'Error updating user_analytics: %', SQLERRM;
  END;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 