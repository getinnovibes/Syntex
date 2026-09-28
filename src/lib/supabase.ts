import { createClient } from '@supabase/supabase-js';
import { Project, Inquiry, SiteSettings, UserProfile, ToolItem } from '../types';
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
// IMAGE OPTIMIZATION HELPER
// -------------------------------------------------------------

export async function compressImage(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<File | Blob> {
  if (typeof window === 'undefined') return file;
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Skip compression if already reasonably sized
        if (width <= maxDimension && height <= maxDimension && file.size < 350 * 1024) {
          resolve(file);
          return;
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, outType === 'image/png' ? '.png' : '.jpg'),
                { type: outType }
              );
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          outType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

// Valid PostgreSQL columns in the Supabase 'projects' table
const VALID_PROJECT_COLUMNS = [
  'id',
  'title',
  'slug',
  'short_description',
  'full_description',
  'category',
  'tags',
  'client',
  'year',
  'role',
  'services',
  'cover_image',
  'featured',
  'published',
  'sort_order',
  'created_at',
  'updated_at',
];

// Valid baseline PostgreSQL columns in the Supabase 'site_settings' table
const VALID_SITE_SETTINGS_COLUMNS = [
  'id',
  'site_name',
  'designer_name',
  'designer_title',
  'headline',
  'bio',
  'years_experience',
  'completed_works',
  'satisfaction_rate',
  'availability_status',
  'contact_email',
  'location',
  'social_links',
  'services_list',
  'updated_at',
];

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

  // Strip relational fields (project_images, gallery_images) so PostgREST never errors with PGRST204
  const dbPayload: any = {};
  for (const col of VALID_PROJECT_COLUMNS) {
    if (col in projectData) {
      dbPayload[col] = (projectData as any)[col];
    }
  }
  dbPayload.updated_at = now;

  let resultProject: any = null;

  if (isSupabaseConfigured) {
    try {
      if (isNew) {
        if (!dbPayload.id) dbPayload.id = crypto.randomUUID();
        if (!dbPayload.slug) {
          dbPayload.slug = (projectData.title || 'project')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-') + `-${Date.now().toString(36)}`;
        }
        if (!dbPayload.created_at) dbPayload.created_at = now;

        const { data, error } = await supabase
          .from('projects')
          .insert([dbPayload])
          .select()
          .single();
        if (error) throw error;
        resultProject = data;
      } else {
        const { data, error } = await supabase
          .from('projects')
          .update(dbPayload)
          .eq('id', projectData.id)
          .select()
          .single();
        if (error) throw error;
        resultProject = data;
      }

      // Handle gallery images if supplied
      if (projectData.gallery_images && projectData.gallery_images.length > 0 && resultProject?.id) {
        await supabase.from('project_images').delete().eq('project_id', resultProject.id);
        const imagesToInsert = projectData.gallery_images.map((img: any, idx: number) => ({
          project_id: resultProject.id,
          storage_path: img.storage_path,
          alt_text: img.alt_text || '',
          sort_order: idx + 1,
        }));
        await supabase.from('project_images').insert(imagesToInsert);
      }

      // Update local storage cache and broadcast live update
      const current = getLocalProjects();
      const idx = current.findIndex((p) => p.id === resultProject.id);
      const fullProject: Project = {
        ...(idx >= 0 ? current[idx] : {}),
        ...resultProject,
        gallery_images: projectData.gallery_images || (idx >= 0 ? current[idx].gallery_images : []),
      };
      if (idx >= 0) {
        current[idx] = fullProject;
      } else {
        current.push(fullProject);
      }
      setLocalProjects(current);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('syntax_data_updated', { detail: { type: 'project', project: fullProject } })
        );
      }
      return fullProject;
    } catch (err: any) {
      console.error('Supabase saveProject error:', err.message || err);
    }
  }

  // Resilient fallback persistence
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
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('syntax_data_updated', { detail: { type: 'project', project: saved } }));
  }
  return saved;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) console.warn('Supabase deleteProject notice:', error.message);
    } catch (err: any) {
      console.warn('Supabase deleteProject error:', err);
    }
  }

  const current = getLocalProjects().filter((p) => p.id !== id);
  setLocalProjects(current);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('syntax_data_updated', { detail: { type: 'delete_project', id } }));
  }
  return true;
}

export async function uploadAsset(file: File, maxDimension = 1600): Promise<string> {
  // 1. Client-side image compression
  let fileToUpload: File | Blob = file;
  try {
    fileToUpload = await compressImage(file, maxDimension);
  } catch (err) {
    console.warn('Compression warning, proceeding with original file:', err);
  }

  // 2. Upload to Supabase Storage if bucket exists
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      } else {
        console.warn('Supabase storage bucket notice, using instant optimized inline asset:', uploadError.message);
      }
    } catch (err: any) {
      console.warn('Supabase storage fallback:', err?.message || err);
    }
  }

  // 3. Fallback: Compact WebP/JPEG Data URL (persists directly in DB)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(fileToUpload);
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
  const local = getLocalSettings();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
      if (!error && data) {
        const rawSocial = Array.isArray(data.social_links) ? data.social_links : [];
        const metaAvatar = rawSocial.find((l: any) => l.platform === '__meta_avatar_url__')?.url;
        const metaToolkitRaw = rawSocial.find((l: any) => l.platform === '__meta_toolkit__')?.url;
        let metaToolkit: ToolItem[] | undefined;
        if (metaToolkitRaw) {
          try {
            metaToolkit = JSON.parse(metaToolkitRaw);
          } catch {}
        }

        const metaHeroLeftRaw = rawSocial.find((l: any) => l.platform === '__meta_hero_card_left__')?.url;
        let metaHeroLeft: any;
        if (metaHeroLeftRaw) {
          try { metaHeroLeft = JSON.parse(metaHeroLeftRaw); } catch {}
        }

        const metaHeroRightRaw = rawSocial.find((l: any) => l.platform === '__meta_hero_card_right__')?.url;
        let metaHeroRight: any;
        if (metaHeroRightRaw) {
          try { metaHeroRight = JSON.parse(metaHeroRightRaw); } catch {}
        }

        const metaHeroSpecimenRaw = rawSocial.find((l: any) => l.platform === '__meta_hero_specimen__')?.url;
        let metaHeroSpecimen: any;
        if (metaHeroSpecimenRaw) {
          try { metaHeroSpecimen = JSON.parse(metaHeroSpecimenRaw); } catch {}
        }

        const cleanSocialLinks = rawSocial.filter((l: any) => !l.platform.startsWith('__meta_'));

        const merged: SiteSettings = {
          ...local,
          ...data,
          social_links: cleanSocialLinks.length > 0 ? cleanSocialLinks : local.social_links,
          toolkit: (data.toolkit && Array.isArray(data.toolkit) && data.toolkit.length > 0)
            ? data.toolkit
            : (metaToolkit && metaToolkit.length > 0)
              ? metaToolkit
              : local.toolkit,
          avatar_url: data.avatar_url || metaAvatar || local.avatar_url || '/assets/portrait.png',
          hero_card_left: data.hero_card_left || metaHeroLeft || local.hero_card_left,
          hero_card_right: data.hero_card_right || metaHeroRight || local.hero_card_right,
          hero_specimen: data.hero_specimen || metaHeroSpecimen || local.hero_specimen,
        };
        setLocalSettings(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Supabase fetchSiteSettings failed, using cached store:', err);
    }
  }
  return local;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = getLocalSettings();
  const merged: SiteSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  };

  // Real social links (filter out internal metadata entries)
  const realSocialLinks = (merged.social_links || []).filter(
    (l) => !l.platform.startsWith('__meta_')
  );

  // Encode avatar_url, toolkit, and hero showcase cards into social_links metadata
  // so they always persist to Supabase even without DB migration
  const socialLinksWithMeta = [
    ...realSocialLinks,
    ...(merged.avatar_url ? [{ platform: '__meta_avatar_url__', url: merged.avatar_url }] : []),
    ...(merged.toolkit ? [{ platform: '__meta_toolkit__', url: JSON.stringify(merged.toolkit) }] : []),
    ...(merged.hero_card_left ? [{ platform: '__meta_hero_card_left__', url: JSON.stringify(merged.hero_card_left) }] : []),
    ...(merged.hero_card_right ? [{ platform: '__meta_hero_card_right__', url: JSON.stringify(merged.hero_card_right) }] : []),
    ...(merged.hero_specimen ? [{ platform: '__meta_hero_specimen__', url: JSON.stringify(merged.hero_specimen) }] : []),
  ];

  // 1. Immediately persist to resilient local cache
  setLocalSettings({
    ...merged,
    social_links: realSocialLinks,
  });

  // 2. Dispatch real-time live event so all views update instantaneously
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('syntax_data_updated', { detail: { type: 'settings', data: merged } }));
  }

  // 3. Sync to Supabase database
  if (isSupabaseConfigured) {
    try {
      // First attempt: try saving with native avatar_url & toolkit columns + embedded metadata
      const payloadWithAll: any = {
        ...merged,
        social_links: socialLinksWithMeta,
      };

      const { error: firstErr } = await supabase.from('site_settings').upsert([payloadWithAll]);
      if (firstErr) {
        // If Supabase complains about missing avatar_url or toolkit column (PGRST204)
        if (firstErr.code === 'PGRST204' || firstErr.message?.includes('schema cache')) {
          // Build safe payload with only baseline columns known to exist
          const safePayload: any = {};
          for (const col of VALID_SITE_SETTINGS_COLUMNS) {
            if (col in merged) {
              safePayload[col] = (merged as any)[col];
            }
          }
          // Include embedded metadata in social_links
          safePayload.social_links = socialLinksWithMeta;
          safePayload.updated_at = merged.updated_at;

          const { error: retryErr } = await supabase.from('site_settings').upsert([safePayload]);
          if (retryErr) {
            console.error('Supabase saveSiteSettings retry error:', retryErr);
          }
        } else {
          console.error('Supabase saveSiteSettings error:', firstErr);
        }
      }
    } catch (err) {
      console.warn('Supabase saveSiteSettings notice:', err);
    }
  }

  return merged;
}
