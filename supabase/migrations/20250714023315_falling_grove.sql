/*
  # Create increment_clicks function for atomic click counting

  1. New Functions
    - `increment_clicks(url_id uuid)` - Atomically increments the clicks counter for a URL
  
  2. Security
    - Function is accessible to authenticated users
    - Uses SECURITY DEFINER to ensure atomic operations
*/

CREATE OR REPLACE FUNCTION increment_clicks(url_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE urls 
  SET clicks = clicks + 1 
  WHERE id = url_id;
END;
$$;