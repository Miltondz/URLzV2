/*
  # Create clicks_log table for detailed analytics

  1. New Tables
    - `clicks_log`
      - `id` (uuid, primary key)
      - `url_id` (uuid, foreign key to urls table)
      - `ip_address` (text)
      - `country` (text)
      - `city` (text)
      - `browser_name` (text)
      - `os_name` (text)
      - `device_type` (text)
      - `user_agent` (text)
      - `clicked_at` (timestamp)

  2. Security
    - Enable RLS on `clicks_log` table
    - Add policy for users to read analytics for their own URLs
*/

CREATE TABLE IF NOT EXISTS clicks_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id uuid NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  ip_address text,
  country text,
  city text,
  browser_name text,
  os_name text,
  device_type text,
  user_agent text,
  clicked_at timestamptz DEFAULT now()
);

ALTER TABLE clicks_log ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read analytics for their own URLs
CREATE POLICY "Users can read analytics for their own URLs"
  ON clicks_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM urls 
      WHERE urls.id = clicks_log.url_id 
      AND urls.user_id = auth.uid()
    )
  );

-- Policy to allow the service role to insert analytics data
CREATE POLICY "Service role can insert analytics data"
  ON clicks_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS clicks_log_url_id_idx ON clicks_log(url_id);
CREATE INDEX IF NOT EXISTS clicks_log_clicked_at_idx ON clicks_log(clicked_at);