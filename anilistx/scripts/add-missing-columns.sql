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
