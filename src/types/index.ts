export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: 'Brand Identity' | 'Poster Design' | 'Banner Design' | 'Thumbnail Design' | string;
  tags: string[];
  client: string;
  year: string;
  role: string;
  services: string;
  cover_image: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  gallery_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  storage_path: string;
  alt_text?: string;
  sort_order: number;
  created_at?: string;
}

export interface Inquiry {
  id: string;
  client_name: string;
  email?: string;
  service_type: string;
  budget?: string;
  reference_url?: string;
  brief: string;
  notes?: string;
  status: 'new' | 'in_progress' | 'completed';
  created_at: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  designer_name: string;
  designer_title: string;
  headline: string;
  bio: string;
  years_experience: string;
  completed_works: string;
  satisfaction_rate: string;
  availability_status: string;
  contact_email: string;
  location: string;
  social_links: { platform: string; url: string }[];
  services_list: {
    id: string;
    number: string;
    title: string;
    description: string;
    tags: string;
    icon: string;
  }[];
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'viewer';
  full_name?: string;
  avatar_url?: string;
}
