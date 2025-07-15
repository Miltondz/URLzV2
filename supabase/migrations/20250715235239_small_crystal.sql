/*
  # Add public access policy for URL redirects

  1. Security Changes
    - Add policy to allow anonymous users to read URLs for redirects
    - This enables public access to shortened URLs without authentication
    - Only allows SELECT operations for redirect functionality

  2. RPC Function Access
    - Ensure increment_clicks function can be called by service role
    - This allows click tracking for public redirects
*/

-- Allow anonymous users to read URLs for redirect purposes
CREATE POLICY "Allow public redirect access"
  ON urls
  FOR SELECT
  TO anon
  USING (true);

-- Ensure the increment_clicks function exists and can be called
-- This function should already exist, but let's make sure it's accessible
DO $$
BEGIN
  -- Check if the function exists, if not create it
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'increment_clicks'
  ) THEN
    -- Create the increment_clicks function
    EXECUTE '
    CREATE OR REPLACE FUNCTION increment_clicks(url_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    BEGIN
      UPDATE urls 
      SET clicks = clicks + 1 
      WHERE id = url_id;
    END;
    $func$;
    ';
  END IF;
END $$;

-- Grant execute permission on the function to anon role
GRANT EXECUTE ON FUNCTION increment_clicks(uuid) TO anon;