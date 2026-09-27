-- =========================================================================
-- SYNTAX STUDIO: UNRESTRICTED REAL-TIME LIVE UPDATE PERMISSIONS
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- 1. Site Settings (Availability, Toolkit, Bio, Headlines, Photos)
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public full access to site settings" ON public.site_settings;
CREATE POLICY "Public full access to site settings"
  ON public.site_settings
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 2. Projects (Create, Edit, Delete, Toggle Featured/Published)
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Public full access to projects" ON public.projects;
CREATE POLICY "Public full access to projects"
  ON public.projects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 3. Project Images (Gallery photos)
DROP POLICY IF EXISTS "Public can view project images" ON public.project_images;
DROP POLICY IF EXISTS "Authenticated users can manage project images" ON public.project_images;
DROP POLICY IF EXISTS "Public full access to project images" ON public.project_images;
CREATE POLICY "Public full access to project images"
  ON public.project_images
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. Inquiries (Client Messages)
DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Public full access to inquiries" ON public.inquiries;
CREATE POLICY "Public full access to inquiries"
  ON public.inquiries
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 5. Storage Bucket (Photo Uploads & Covers)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET public = true;

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
