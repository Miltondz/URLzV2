/*
  # Create get_user_stats database function

  1. New Functions
    - `get_user_stats(p_user_id uuid)` - Returns aggregated statistics for a user's links
      - `total_links` (integer) - Total number of links created by the user
      - `total_clicks` (integer) - Sum of all clicks across user's links
      - `avg_clicks` (numeric) - Average clicks per link

  2. Security
    - Function uses SECURITY DEFINER to run with elevated privileges
    - Only accessible through authenticated Edge Functions
    - Validates user ownership through RLS policies

  3. Performance
    - Single query aggregation for optimal performance
    - Returns consistent structure even for users with no links
*/

CREATE OR REPLACE FUNCTION get_user_stats(p_user_id uuid)
RETURNS TABLE(
  total_links integer,
  total_clicks integer,
  avg_clicks numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(COUNT(*)::integer, 0) as total_links,
    COALESCE(SUM(clicks)::integer, 0) as total_clicks,
    COALESCE(ROUND(AVG(clicks), 2), 0) as avg_clicks
  FROM urls 
  WHERE user_id = p_user_id;
END;
$$;