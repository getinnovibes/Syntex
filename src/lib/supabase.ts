import { createClient } from '@supabase/supabase-js';
import { Project, Inquiry, SiteSettings, UserProfile } from '../types';
import { INITIAL_PROJECTS, INITIAL_INQUIRIES, INITIAL_SITE_SETTINGS } from './initialData';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://qxljhpxlhzociikxlxqs.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4bGpocHhsaHpvY2lpa3hseHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MjM0MDMsImV4cCI6MjEwNjA5OTQwM30.x6mc57NUQrcSmE9rnZ6g5sUHEyLlSBFSRtomt1RNQFU';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://placeholder.supabase.co' &&
  !supabaseUrl.includes('your-supabase-project')
);

// Real Supabase client instance with public anon key
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Local resilient storage keys for seamless persistence & demo/offline fallback
const STORAGE_PROJECTS_KEY = 'syntax_projects_cache';
const STORAGE_INQUIRIES_KEY = 'syntax_inquiries_cache';
const STORAGE_SETTINGS_KEY = 'syntax_settings_cache';

function getLocalProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading local projects cache:', err);
  }
  return INITIAL_PROJECTS;
}

function setLocalProjects(projects: Project[]): void {
  try {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('Error saving local projects cache:', err);
  }
}

function getLocalInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(STORAGE_INQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading local inquiries cache:', err);
  }
  return INITIAL_INQUIRIES;
}

function setLocalInquiries(inquiries: Inquiry[]): void {
  try {
    localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
  } catch (err) {
    console.warn('Error saving local inquiries cache:', err);
  }
}

function getLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Error reading local settings cache:', err);
  }
  return INITIAL_SITE_SETTINGS;
}

function setLocalSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Error saving local settings cache:', err);
  }
}

// -------------------------------------------------------------
// DATA SERVICE FUNCTIONS (End-to-End with Supabase + Resilience)
// -------------------------------------------------------------

export async function fetchProjects(includeUnpublished = false): Promise<Project[]> {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('projects').select('*, project_images(*)').order('sort_order', { ascending: true });
      if (!includeUnpublished) {
        query = query.eq('published', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Map to typed project structure
        const mapped: Project[] = data.map((item: any) => ({
          ...item,
          gallery_images: item.project_images || [],
        }));
        setLocalProjects(mapped);
        return mapped;
      }
      if (error) {
        console.warn('Supabase fetch projects notice:', error.message);
      }
    } catch (e) {
      console.warn('Supabase request failed, using cached store:', e);
    }
  }

  // Fallback to local persistent cache
  const local = getLocalProjects();
  if (includeUnpublished) return local;
  return local.filter((p) => p.published);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .eq('slug', slug)
        .single();
      if (!error && data) {
        return {
          ...data,
          gallery_images: data.project_images || [],
        };
      }
    } catch (e) {
      console.warn('Supabase fetchProjectBySlug failed:', e);
    }
  }
  const local = getLocalProjects();
  return local.find((p) => p.slug === slug) || null;
}

export async function saveProject(projectData: Partial<Project>): Promise<Project> {
  const isNew = !projectData.id;
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    try {
      const { gallery_images, ...dbFields } = projectData as any;
      dbFields.updated_at = now;

      let resultProject: any = null;

      if (isNew) {
        const { data, error } = await supabase
          .from('projects')
          .insert([dbFields])
          .select()
          .single();
        if (error) throw error;
        resultProject = data;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .update(dbFields)
          .eq('id', projectData.id)
          .select()
          .single();
        if (error) throw error;
        resultProject = data;
      }

      // Handle gallery images if supplied
      if (gallery_images && gallery_images.length > 0 && resultProject?.id) {
        // Replace or sync
        await supabase.from('project_images').delete().eq('project_id', resultProject.id);
        const imagesToInsert = gallery_images.map((img: any, idx: number) => ({
          project_id: resultProject.id,
          storage_path: img.storage_path,
          alt_text: img.alt_text || '',
          sort_order: idx + 1,
        }));
        await supabase.from('project_images').insert(imagesToInsert);
      }

      // Refresh local cache
      const updatedList = await fetchProjects(true);
      return resultProject;
    } catch (err: any) {
      console.error('Supabase saveProject error:', err.message || err);
      throw err;
    }
  }

  // Local fallback persistence
  const current = getLocalProjects();
  let saved: Project;

  if (isNew) {
    saved = {
      id: crypto.randomUUID(),
      title: projectData.title || 'Untitled Project',
      slug: projectData.slug || 'untitled-project',
      short_description: projectData.short_description || '',
      full_description: projectData.full_description || '',
      category: projectData.category || 'Brand Identity',
      tags: projectData.tags || [],
      client: projectData.client || '',
      year: projectData.year || '2026',
      role: projectData.role || '',
      services: projectData.services || '',
      cover_image: projectData.cover_image || '/assets/aura-stationery.png',
      featured: projectData.featured ?? false,
      published: projectData.published ?? true,
      sort_order: projectData.sort_order ?? (current.length + 1),
      created_at: now,
      updated_at: now,
      gallery_images: projectData.gallery_images || [],
    };
    current.push(saved);
  } else {
    const index = current.findIndex((p) => p.id === projectData.id);
    if (index === -1) throw new Error('Project not found');
    saved = {
      ...current[index],
      ...projectData,
      updated_at: now,
    } as Project;
    current[index] = saved;
  }

  setLocalProjects(current);
  return saved;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.error('Supabase deleteProject error:', err);
      throw err;
    }
  }

  const current = getLocalProjects().filter((p) => p.id !== id);
  setLocalProjects(current);
  return true;
}

export async function uploadAsset(file: File): Promise<string> {
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err: any) {
      console.error('Supabase storage upload error:', err);
      throw err;
    }
  }

  // Local fallback: create blob URL with persistence for demo session
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// INQUIRIES SERVICE
// -------------------------------------------------------------

export async function submitInquiry(
  inquiryData: Omit<Inquiry, 'id' | 'created_at' | 'status'> & { status?: Inquiry['status'] }
): Promise<Inquiry> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .insert([{ ...inquiryData, status: 'new' }])
        .select()
        .single();
      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase submitInquiry failed, falling back:', err);
    }
  }

  const current = getLocalInquiries();
  const created: Inquiry = {
    id: crypto.randomUUID(),
    ...inquiryData,
    status: 'new',
    created_at: now,
  };
  current.unshift(created);
  setLocalInquiries(current);
  return created;
}

export async function fetchInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setLocalInquiries(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetchInquiries failed:', err);
    }
  }
  return getLocalInquiries();
}

export async function updateInquiryStatus(id: string, status: Inquiry['status']): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    } catch (err) {
      console.error('Supabase updateInquiryStatus error:', err);
    }
  }
  const current = getLocalInquiries();
  const item = current.find((i) => i.id === id);
  if (item) {
    item.status = status;
    setLocalInquiries(current);
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from('inquiries').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase deleteInquiry error:', err);
    }
  }
  const current = getLocalInquiries().filter((i) => i.id !== id);
  setLocalInquiries(current);
}

// -------------------------------------------------------------
// SITE SETTINGS SERVICE
// -------------------------------------------------------------

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        setLocalSettings(data);
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetchSiteSettings failed:', err);
    }
  }
  return getLocalSettings();
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = getLocalSettings();
  const merged = { ...current, ...settings, updated_at: new Date().toISOString() };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('site_settings').upsert([merged]);
      if (error) console.error('Supabase saveSiteSettings error:', error);
    } catch (err) {
      console.error('Supabase saveSiteSettings exception:', err);
    }
  }

  setLocalSettings(merged);
  return merged;
}
