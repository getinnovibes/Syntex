-- =============================================================================
-- Syntax — Abdullah Creative Studio Portfolio + CMS
-- ALL-IN-ONE SETUP SCRIPT (Tables, Security Policies, Storage & Seed Data)
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click RUN.
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Admins & Team)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  full_name TEXT DEFAULT 'Abdullah',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PROJECTS TABLE
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

-- 4. PROJECT IMAGES TABLE (Gallery)
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. CLIENT INQUIRIES TABLE
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

-- 6. SITE SETTINGS TABLE
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
  contact_email TEXT NOT NULL DEFAULT 'abdullahgorib22@gmail.com',
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

-- 7. INDEXES
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);

-- 8. AUTOMATIC USER PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (new.id, new.email, 'admin', COALESCE(new.raw_user_meta_data->>'full_name', 'Abdullah'))
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 10. POLICIES: PROFILES
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update profiles" ON public.profiles;
CREATE POLICY "Authenticated users can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 11. POLICIES: PROJECTS
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
CREATE POLICY "Authenticated users can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
CREATE POLICY "Authenticated users can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
CREATE POLICY "Authenticated users can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- 12. POLICIES: PROJECT IMAGES
DROP POLICY IF EXISTS "Public can view project images" ON public.project_images;
CREATE POLICY "Public can view project images"
  ON public.project_images FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert project images" ON public.project_images;
CREATE POLICY "Authenticated users can insert project images"
  ON public.project_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update project images" ON public.project_images;
CREATE POLICY "Authenticated users can update project images"
  ON public.project_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete project images" ON public.project_images;
CREATE POLICY "Authenticated users can delete project images"
  ON public.project_images FOR DELETE
  TO authenticated
  USING (true);

-- 13. POLICIES: INQUIRIES
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
CREATE POLICY "Public can insert inquiries"
  ON public.inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view inquiries" ON public.inquiries;
CREATE POLICY "Authenticated users can view inquiries"
  ON public.inquiries FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update inquiries" ON public.inquiries;
CREATE POLICY "Authenticated users can update inquiries"
  ON public.inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete inquiries" ON public.inquiries;
CREATE POLICY "Authenticated users can delete inquiries"
  ON public.inquiries FOR DELETE
  TO authenticated
  USING (true);

-- 14. POLICIES: SITE SETTINGS
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can update site settings" ON public.site_settings;
CREATE POLICY "Authenticated users can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 15. STORAGE BUCKET CONFIGURATION
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-assets',
  'portfolio-assets',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- STORAGE POLICIES
DROP POLICY IF EXISTS "Public Read Access on portfolio-assets" ON storage.objects;
CREATE POLICY "Public Read Access on portfolio-assets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated Upload Access on portfolio-assets" ON storage.objects;
CREATE POLICY "Authenticated Upload Access on portfolio-assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated Update Access on portfolio-assets" ON storage.objects;
CREATE POLICY "Authenticated Update Access on portfolio-assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Authenticated Delete Access on portfolio-assets" ON storage.objects;
CREATE POLICY "Authenticated Delete Access on portfolio-assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');

-- 16. SEED DATA: SITE SETTINGS
INSERT INTO public.site_settings (
  id,
  site_name,
  designer_name,
  designer_title,
  headline,
  bio,
  years_experience,
  completed_works,
  satisfaction_rate,
  availability_status,
  contact_email,
  location
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Syntax',
  'Abdullah',
  'Graphics Designer & Visual Director',
  'Visual Design & High-Impact Digital Craft',
  'I’m Abdullah, a graphics designer focused on creating meaningful visual identities, digital experiences and engaging creative content. I combine clean design, strong visual communication and modern aesthetics to help brands present themselves with confidence.',
  '5+',
  '120+',
  '99%',
  'Independent Practice • Available for Q2/Q3 Projects',
  'abdullahgorib22@gmail.com',
  'Dhaka / Remote'
) ON CONFLICT (id) DO NOTHING;

-- 17. SEED DATA: PROJECTS
INSERT INTO public.projects (
  id,
  title,
  slug,
  short_description,
  full_description,
  category,
  tags,
  client,
  year,
  role,
  services,
  cover_image,
  featured,
  published,
  sort_order
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Aura Creative System',
  'aura-creative-system',
  'Complete stationery ecosystem, typographic hierarchy, debossed packaging, and luxury brand collateral guidelines.',
  'Aura Creative required an uncompromising corporate visual identity system tailored for a luxury design consultancy. We engineered a dual-tone palette centered around ultra-matte obsidian and electric violet highlights, complete with hot-stamped stationery, debossed business collateral, custom typographic styling in Space Grotesk, and rigorous editorial guidelines across print and digital touchpoints.',
  'Brand Identity',
  ARRAY['Identity System', 'Stationery', 'Packaging', 'Typography'],
  'Aura Creative Inc.',
  '2024',
  'Lead Identity Designer & Art Director',
  'Brand Architecture, Stationery Suite, Print Production, Style Guide',
  '/assets/aura-stationery.png',
  true,
  true,
  1
),
(
  '22222222-2222-2222-2222-222222222222',
  'Synthesis Exhibition',
  'synthesis-exhibition',
  'Experimental kinetic poster series exploring generative typography, chromatic distortion, and algorithmic rhythm.',
  'Synthesis was commissioned as the headline visual identity for a progressive digital art festival. The identity merges brutalist grid disciplines with dynamic gradient washes, creating a high-contrast aesthetic calibrated for massive street exhibition billboards, gallery exhibition programs, and digital animation displays.',
  'Poster Design',
  ARRAY['Kinetic Art', 'Exhibition Design', 'Editorial', 'Screen Print'],
  'Museum of Digital Arts',
  '2024',
  'Poster Designer & Creative Director',
  'Poster Suite, Print Curation, Merchandising System, Visual Direction',
  '/assets/synthesis-poster.png',
  true,
  true,
  2
),
(
  '33333333-3333-3333-3333-333333333333',
  'Nova Mobile Experience',
  'nova-mobile-experience',
  'Modern fintech onboarding visual language, glassmorphic asset suite, and micro-interaction visual directions.',
  'Nova Mobile transforms the mobile banking journey into an editorial luxury experience. The design system features soft luminescence, deep violet gradients, custom micro-asset sets, and ultra-crisp typographic hierarchy built specifically for dark-mode OLED screen fidelities.',
  'Banner Design',
  ARRAY['Fintech', 'Digital Banner', 'Product Art', 'Mobile UI'],
  'Nova Financial Technologies',
  '2023',
  'Visual Designer & Asset Lead',
  'Digital Ad Suites, Marketing Banners, App Launch Collateral',
  '/assets/nova-mobile.png',
  true,
  true,
  3
),
(
  '44444444-4444-4444-4444-444444444444',
  'Apex Horizon Campaign',
  'apex-horizon-campaign',
  'High-CTR YouTube and streaming media thumbnail architecture engineered with 3D depth, focal lighting, and crisp silhouette framing.',
  'A strategic series of high-converting thumbnail compositions created for premier educational and tech content creators. Each visual asset utilizes calculated depth planes, custom 3D sculpted typography, and high-impact focal contrast to command viewer retention across digital feeds.',
  'Thumbnail Design',
  ARRAY['High CTR', 'YouTube Suite', '3D Typography', 'Streaming'],
  'Apex Media Global',
  '2024',
  'Lead Thumbnail Designer',
  'Thumbnail Systems, A/B Test Variants, Creative Direction',
  '/assets/apex-horizon.png',
  true,
  true,
  4
)
ON CONFLICT (id) DO NOTHING;

-- 18. SEED DATA: INQUIRIES
INSERT INTO public.inquiries (
  id,
  client_name,
  email,
  service_type,
  budget,
  reference_url,
  brief,
  notes,
  status
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Abdur Rahman',
  'rahman@auracreative.io',
  'Brand Identity',
  '$1,000 – $3,000',
  'https://auracreative.io',
  'We need a complete brand identity refresh for our creative agency including new logomarks, typography rules, and stationery.',
  'Prefers modern violet and matte black palette. Deadline in 3 weeks.',
  'new'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Nusrat Jahan',
  'nusrat.vibe@agency.co',
  'Social Media Poster Design',
  '$500 – $1,000',
  'https://instagram.com/agency.vibe',
  'Series of 8 promotional carousel poster designs for an upcoming cultural music festival.',
  'Draft concepts submitted, awaiting client sign-off on color grading.',
  'in_progress'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Elena Rostova',
  'elena@fintechvision.io',
  'Banner Design',
  '$3,000 – $5,000',
  'https://fintechvision.io',
  'Full set of marketing display ads and website hero banners for our digital banking product launch.',
  'Initial review complete. Contract sent.',
  'new'
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'Marcus Vance',
  'marcus@creatornetwork.com',
  'Thumbnail Design',
  '$500 – $1,000',
  'https://youtube.com/@marcusvance',
  'Pack of 10 high-CTR YouTube tech series thumbnails with custom 3D typography and focal framing.',
  'Assets delivered and approved. Final payment processed.',
  'completed'
)
ON CONFLICT (id) DO NOTHING;
