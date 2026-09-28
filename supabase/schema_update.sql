-- =========================================================================
-- SYNTAX STUDIO: SCHEMA & STORAGE FIX FOR SUPABASE
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. ADD MISSING COLUMNS TO SITE_SETTINGS TABLE
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS toolkit JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_card_left JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_card_right JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS hero_specimen JSONB DEFAULT '{}'::jsonb;

-- 2. CREATE PORTFOLIO-ASSETS STORAGE BUCKET FOR PHOTO UPLOADS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. PERMISSIONS FOR STORAGE (Allows photo uploads from admin panel)
DROP POLICY IF EXISTS "Public Access to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Update to portfolio-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete to portfolio-assets" ON storage.objects;

CREATE POLICY "Public Access to portfolio-assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Public Upload to portfolio-assets"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Public Update to portfolio-assets"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Public Delete to portfolio-assets"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'portfolio-assets');
