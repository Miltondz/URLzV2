/*
  # Create user statistics function

  1. New Functions
    - `get_user_stats(p_user_id uuid)` - Returns aggregated statistics for a user's URLs
      - total_links: Count of all URLs created by the user
      - total_clicks: Sum of all clicks across user's URLs
      - avg_clicks: Average clicks per URL for the user
  
  2. Security
    - Function is accessible to authenticated users
    - Uses SECURITY DEFINER for consistent execution context
*/

CREATE OR REPLACE FUNCTION get_user_stats(p_user_id uuid)
RETURNS TABLE(total_links BIGINT, total_clicks BIGINT, avg_clicks NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS total_links,
    COALESCE(SUM(clicks), 0) AS total_clicks,
    COALESCE(AVG(clicks), 0) AS avg_clicks
  FROM
    public.urls
  WHERE
    user_id = p_user_id;
END;
$$;