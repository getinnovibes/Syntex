-- Syntax Studio Initial Seed Data

-- 1. SITE SETTINGS
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

-- 2. PROJECTS
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
  'Brand Guidelines, Stationery Design, Foil Stamping, Print Production',
  '/assets/aura-stationery.png',
  true,
  true,
  1
),
(
  '22222222-2222-2222-2222-222222222222',
  'Synthesis Exhibition',
  'synthesis-exhibition',
  'Editorial event identity, large-format museum screenprints, and dynamic motion sequences for Instagram campaigns.',
  'An exploratory graphic series for the SYNTHESIS international digital art exhibition. The project juxtaposes strict Swiss typographic grids against iridescent 3D chrome ribbons, evoking tactile weightlessness and luminescent tension. Included high-impact exhibition posters, museum wayfinding signage, social teaser carousels, and kinetic typography sequences.',
  'Poster Design',
  ARRAY['Exhibition', 'Swiss Typo', '3D Motion', 'Print Design'],
  'Synthesis Arts Foundation',
  '2024',
  'Visual Director',
  'Screenprints, Exhibition Posters, Motion Design, Social Campaign',
  '/assets/synthesis-poster.png',
  true,
  true,
  2
),
(
  '33333333-3333-3333-3333-333333333333',
  'Lumina Digital Campaign',
  'lumina-digital-campaign',
  'Multichannel promotional display banners, high-converting digital billboards, and refined beauty ecommerce aesthetics.',
  'Comprehensive omnichannel visual campaign designed for Lumina skincare launch. Engineered 40+ variations across Google Display, social billboards, and web hero placements with lavender frosted glass aesthetic, micro-animations, and clean typography maximizing click-through conversion rates.',
  'Banner Design',
  ARRAY['Digital Ads', 'Display Banners', 'Ecommerce', 'Motion'],
  'Lumina Skincare Zurich',
  '2024',
  'Senior Digital Designer',
  'Hero Banners, Google Display Ads, Social Media Visuals',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop',
  false,
  true,
  3
),
(
  '44444444-4444-4444-4444-444444444444',
  'Visual Velocity',
  'visual-velocity',
  'Editorial creator thumbnail engineering, high-contrast typography, and CTR-maximizing spatial compositions.',
  'Curated suite of editorial thumbnails and promotional art for Visual Velocity technology series. Engineered high dynamic contrast, custom 3D typography, volumetric lighting effects, and focal points tailored for rapid audience comprehension in dense YouTube feeds, resulting in over 4 million impressions.',
  'Thumbnail Design',
  ARRAY['Thumbnails', 'High CTR', 'Creator Media', 'YouTube'],
  'Velocity Media Group',
  '2023',
  'Thumbnail Architect',
  'YouTube Thumbnails, Video Packaging, Social Billboards',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  false,
  true,
  4
),
(
  '55555555-5555-5555-5555-555555555555',
  'Kroma Spatial Architecture',
  'kroma-spatial-architecture',
  'Exploratory spatial environments, immersive 3D art direction, and dimensional branding for next-generation platforms.',
  'Experimental spatial design project exploring virtual architectural pavilions and monolithic brand identities. Leveraging procedural geometric rendering, deep purple ambient lighting, and subtle atmospheric grain to create futuristic agency experiences.',
  'Brand Identity',
  ARRAY['3D Craft', 'Spatial', 'Architectural', 'Editorial'],
  'Kroma Spatial Labs',
  '2024',
  '3D Art Director',
  '3D Concept Art, Spatial Branding, Editorial Lookbook',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  false,
  true,
  5
)
ON CONFLICT (id) DO NOTHING;

-- 3. INQUIRIES
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
