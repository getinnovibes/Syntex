-- Syntax Studio & Abdullah Portfolio CMS Schema
-- Production Database Migration with RLS and Storage Policies

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Authorization)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  full_description TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  client TEXT,
  year TEXT,
  role TEXT,
  services TEXT,
  cover_image TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. PROJECT IMAGES TABLE (Gallery)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. CLIENT INQUIRIES / CONTACT REQUESTS
CREATE TABLE IF NOT EXISTS public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  budget TEXT,
  reference_url TEXT,
  brief TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Syntax',
  designer_name TEXT NOT NULL DEFAULT 'Abdullah',
  designer_title TEXT NOT NULL DEFAULT 'Graphics Designer & Visual Director',
  headline TEXT NOT NULL DEFAULT 'Visual Design & High-Impact Digital Craft',
  bio TEXT NOT NULL DEFAULT 'A creative designer focused on brand identity, digital visuals and high-impact design experiences.',
  years_experience TEXT NOT NULL DEFAULT '5+',
  completed_works TEXT NOT NULL DEFAULT '120+',
  satisfaction_rate TEXT NOT NULL DEFAULT '99%',
  availability_status TEXT NOT NULL DEFAULT 'Independent Practice • Available for Q2/Q3 Projects',
  contact_email TEXT NOT NULL DEFAULT 'abdullah.graphics@syntax.design',
  location TEXT NOT NULL DEFAULT 'Dhaka / Remote',
  social_links JSONB NOT NULL DEFAULT '[
    {"platform": "Behance", "url": "https://www.behance.net/happycrust"},
    {"platform": "Dribbble", "url": "https://dribbble.com"},
    {"platform": "LinkedIn", "url": "https://linkedin.com"},
    {"platform": "Instagram", "url": "https://instagram.com"},
    {"platform": "Facebook", "url": "https://facebook.com"},
    {"platform": "X / Twitter", "url": "https://x.com"}
  ]'::jsonb,
  services_list JSONB NOT NULL DEFAULT '[
    {
      "id": "1",
      "number": "01 / Foundation",
      "title": "Brand Identity",
      "description": "Complete visual identity systems that create a consistent and memorable brand presence across physical and digital mediums.",
      "tags": "Logos • Typography • Styleguides",
      "icon": "corporate_fare"
    },
    {
      "id": "2",
      "number": "02 / Engagement",
      "title": "Social Media Poster Design",
      "description": "Eye-catching social media visuals designed to communicate clearly, command scroll attention, and engage modern audiences.",
      "tags": "Instagram • Events • Carousel Sets",
      "icon": "art_track"
    },
    {
      "id": "3",
      "number": "03 / Promotion",
      "title": "Banner Design",
      "description": "Professional digital and promotional banners designed for marketing campaigns, high-traffic websites and social platforms.",
      "tags": "Web Hero • Google Ads • Billboard Kits",
      "icon": "ad_units"
    },
    {
      "id": "4",
      "number": "04 / Conversion",
      "title": "Thumbnail Design",
      "description": "High-impact thumbnails designed to improve attention, click appeal, and audience retention for creators and media platforms.",
      "tags": "YouTube • Podcasts • Stream Covers",
      "icon": "play_circle"
    }
  ]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES: PROFILES
CREATE POLICY "Public profiles can be viewed by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 11. POLICIES: PROJECTS
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (published = true OR public.is_admin());

CREATE POLICY "Admin can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 12. POLICIES: PROJECT IMAGES
CREATE POLICY "Public can view published project images"
  ON public.project_images FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_images.project_id
        AND (projects.published = true OR public.is_admin())
    )
  );

CREATE POLICY "Admin can insert project images"
  ON public.project_images FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update project images"
  ON public.project_images FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete project images"
  ON public.project_images FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 13. POLICIES: INQUIRIES
CREATE POLICY "Public can insert inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can update inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete inquiries"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 14. POLICIES: SITE SETTINGS
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15. STORAGE BUCKET CONFIGURATION
-- Insert bucket if storage schema exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- STORAGE POLICIES
CREATE POLICY "Public Read Access on portfolio-assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin Upload Access on portfolio-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin Update Access on portfolio-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());

CREATE POLICY "Admin Delete Access on portfolio-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets' AND public.is_admin());
