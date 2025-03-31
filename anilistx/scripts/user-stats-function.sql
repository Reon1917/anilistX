-- Function to calculate user anime statistics efficiently
-- This can be used as a database function or stored procedure in Supabase

CREATE OR REPLACE FUNCTION get_user_anime_stats(user_id_param UUID)
RETURNS TABLE (
  total_anime INTEGER,
  watching INTEGER,
  completed INTEGER,
  on_hold INTEGER,
  dropped INTEGER,
  plan_to_watch INTEGER,
  total_episodes INTEGER,
  average_score DECIMAL(4,2),
  highest_score INTEGER
) AS $$
DECLARE
  stats_record RECORD;
BEGIN
  -- Check if the user has an analytics record
  IF EXISTS (SELECT 1 FROM user_analytics WHERE user_id = user_id_param AND last_calculated > NOW() - INTERVAL '15 minutes') THEN
    -- Use the pre-calculated analytics if available and recent (within 15 minutes)
    RETURN QUERY
    SELECT 
      ua.total_anime_count,
      ua.watching_count,
      ua.completed_count,
      ua.on_hold_count,
      ua.dropped_count,
      ua.plan_to_watch_count,
      ua.total_episodes_watched,
      ua.average_score,
      (SELECT COALESCE(MAX(score), 0) FROM anime_lists WHERE user_id = user_id_param AND score > 0)
    FROM user_analytics ua
    WHERE ua.user_id = user_id_param;
  ELSE
    -- Calculate stats directly from anime_lists (more expensive but always up-to-date)
    -- Get the statistics into a variable first
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
    INTO stats_record
    FROM anime_lists
    WHERE user_id = user_id_param;
    
    -- Update the analytics table
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
      stats_record.total_anime,
      stats_record.watching,
      stats_record.completed,
      stats_record.on_hold,
      stats_record.dropped,
      stats_record.plan_to_watch,
      stats_record.total_episodes,
      stats_record.average_score,
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
    
    -- Return the calculated statistics
    RETURN QUERY
    SELECT
      stats_record.total_anime,
      stats_record.watching,
      stats_record.completed,
      stats_record.on_hold,
      stats_record.dropped,
      stats_record.plan_to_watch,
      stats_record.total_episodes,
      stats_record.average_score,
      stats_record.highest_score;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 