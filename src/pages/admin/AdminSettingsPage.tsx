import React, { useEffect, useState } from 'react';
import { fetchSiteSettings, saveSiteSettings, fetchProjects, saveProject, deleteProject } from '../../lib/supabase';
import { SiteSettings, ToolItem, Project } from '../../types';
import { Toast } from '../../components/common/Toast';
import { ImageUploader } from '../../components/admin/ImageUploader';

const DEFAULT_TOOLKIT_PRESETS: ToolItem[] = [
  { name: 'Photoshop', icon: 'auto_fix_high' },
  { name: 'Illustrator', icon: 'draw' },
  { name: 'Figma', icon: 'dashboard_customize' },
  { name: 'After Effects', icon: 'animation' },
];

const COMMON_ICONS = [
  { icon: 'auto_fix_high', label: 'Photo / FX' },
  { icon: 'draw', label: 'Vector / Draw' },
  { icon: 'dashboard_customize', label: 'UI / Figma' },
  { icon: 'animation', label: 'Motion' },
  { icon: 'brush', label: 'Art' },
  { icon: 'view_in_ar', label: '3D / Render' },
  { icon: 'movie', label: 'Video' },
  { icon: 'palette', label: 'Color' },
  { icon: 'design_services', label: 'Design' },
  { icon: 'layers', label: 'Layers' },
];

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [settingsData, projectsData] = await Promise.all([
          fetchSiteSettings(),
          fetchProjects(true),
        ]);

        if (!settingsData.toolkit || settingsData.toolkit.length === 0) {
          settingsData.toolkit = DEFAULT_TOOLKIT_PRESETS;
        }

        setSettings(settingsData);
        setProjects(projectsData);
      } catch (err: any) {
        setToastMessage(`Error loading data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      setToastMessage('Changes saved & published live across the website!');
    } catch (err: any) {
      setToastMessage(`Save notice: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // Toolkit management handlers
  const handleAddTool = () => {
    if (!settings) return;
    const currentTools = settings.toolkit || [];
    const newTool: ToolItem = { name: 'New Software', icon: 'star' };
    setSettings({ ...settings, toolkit: [...currentTools, newTool] });
  };

  const handleUpdateTool = (index: number, field: keyof ToolItem, value: string) => {
    if (!settings) return;
    const currentTools = [...(settings.toolkit || [])];
    currentTools[index] = { ...currentTools[index], [field]: value };
    setSettings({ ...settings, toolkit: currentTools });
  };

  const handleRemoveTool = (index: number) => {
    if (!settings) return;
    const currentTools = (settings.toolkit || []).filter((_, i) => i !== index);
    setSettings({ ...settings, toolkit: currentTools });
  };

  // Carousel Project handlers
  const handleAddCarouselSlide = async () => {
    const newSlideData: Partial<Project> = {
      title: 'New Showcase Project',
      slug: `showcase-${Date.now().toString(36)}`,
      category: 'Brand Identity',
      short_description: 'Visual identity system and creative direction presentation.',
      full_description: 'Detailed showcase project created for the 3D perspective carousel.',
      cover_image: '/assets/aura-stationery.png',
      featured: true,
      published: true,
      year: new Date().getFullYear().toString(),
      role: 'Creative Director & Designer',
      client: 'Studio Client',
      tags: ['Design', 'Showcase', 'Creative'],
    };

    try {
      const saved = await saveProject(newSlideData);
      setProjects((prev) => [...prev, saved]);
      setToastMessage('New slide added to 3D carousel!');
    } catch (err: any) {
      setToastMessage(`Could not add slide: ${err.message}`);
    }
  };

  const handleDeleteCarouselSlide = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from the carousel?`)) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setToastMessage(`Slide "${title}" removed successfully.`);
    } catch (err: any) {
      setToastMessage(`Error deleting slide: ${err.message}`);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentToolkit = settings.toolkit && settings.toolkit.length > 0 ? settings.toolkit : DEFAULT_TOOLKIT_PRESETS;

  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline-xl text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
            Site Settings & Visual Content Studio
          </h1>
          <p className="font-body-md text-sm md:text-base text-secondary mt-1">
            Edit hero availability, software toolkit badges, 3D carousel photos, bio narrative, and photos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-surface-container hover:bg-secondary-container text-on-surface font-label-md text-label-md font-medium transition-all border border-outline-variant/40 flex items-center gap-1.5"
            title="Preview live site in new tab"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">visibility</span>
            <span>View Live Site</span>
          </a>

          <button
            form="settings-form"
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-full bg-primary-container text-white font-label-md text-label-md font-semibold hover:bg-primary transition-all shadow-md shadow-primary-container/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>Save & Publish Live</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* ========================================================================= */}
        {/* 1. HERO AVAILABILITY BADGE (Direct user request)                          */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-headline-sm text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                <span>Hero Availability Status Badge</span>
              </h2>
              <p className="font-body-sm text-xs text-secondary mt-0.5">
                Controls the pulsing pill badge at the very top of your homepage.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed/20 text-primary font-label-sm text-[11px] font-semibold uppercase">
              Live Interactive
            </span>
          </div>

          {/* Live Preview Box */}
          <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 flex flex-col gap-3">
            <span className="font-label-sm text-[11px] text-secondary uppercase font-semibold tracking-wider">
              Live Homepage Preview
            </span>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest border border-outline-variant/40 shadow-sm w-fit">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-md text-sm text-on-surface-variant font-medium uppercase tracking-wider">
                {settings.availability_status || 'Independent Practice • Available for Q2/Q3 Projects'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Availability Text
            </label>
            <input
              type="text"
              value={settings.availability_status}
              onChange={(e) =>
                setSettings({ ...settings, availability_status: e.target.value })
              }
              placeholder="e.g. Independent Practice • Available for Q2/Q3 Projects"
              className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Quick preset suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-secondary mr-1">Quick Presets:</span>
            {[
              'Independent Practice • Available for Q2/Q3 Projects',
              'Available for Freelance & Contract Projects',
              'Booking Q3/Q4 Client Projects',
              'Open to Full-Time Visual Direction Roles',
              'Currently Available • Fast Turnaround',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSettings({ ...settings, availability_status: preset })}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-secondary-container border border-outline-variant/40 text-on-surface-variant hover:text-primary transition-all cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SOFTWARE TOOLKIT & BADGES (Direct user request)                       */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
            <div>
              <h2 className="font-headline-sm text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">handyman</span>
                <span>Software Toolkit & Skills Badges</span>
              </h2>
              <p className="font-body-sm text-xs text-secondary mt-0.5">
                Add, remove, or customize software tools (Photoshop, Illustrator, Figma, After Effects, etc.).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTool}
              className="px-4 py-1.5 rounded-full bg-primary-container text-white font-label-sm text-label-sm font-semibold hover:bg-primary transition-colors flex items-center gap-1.5 w-fit cursor-pointer shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add New Tool Badge</span>
            </button>
          </div>

          {/* Live Toolkit Preview Strip */}
          <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 space-y-2">
            <span className="font-label-sm text-[11px] text-secondary uppercase font-semibold tracking-wider">
              Live Homepage Toolkit Preview
            </span>
            <div className="inline-flex flex-wrap items-center gap-2 bg-surface-container-lowest/90 px-4 py-2.5 rounded-full shadow-sm border border-outline-variant/40 w-fit">
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mr-1">
                Toolkit
              </span>
              {currentToolkit.map((tool, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-primary text-[15px]">
                    {tool.icon || 'star'}
                  </span>
                  <span>{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* List of Tools */}
          <div className="space-y-3">
            {currentToolkit.map((tool, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-2xl bg-surface-container-low/50 border border-outline-variant/30 hover:border-outline-variant transition-colors"
              >
                {/* Icon Preview & Selector */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-xs border border-outline-variant/30 shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {tool.icon || 'star'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-secondary uppercase font-medium">Icon Name</span>
                    <input
                      type="text"
                      value={tool.icon}
                      onChange={(e) => handleUpdateTool(index, 'icon', e.target.value)}
                      placeholder="e.g. draw"
                      className="w-32 bg-surface-container-lowest px-3 py-1.5 rounded-lg font-mono text-xs text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Tool Name Input */}
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-[10px] text-secondary uppercase font-medium">Tool Name / Title</span>
                  <input
                    type="text"
                    value={tool.name}
                    onChange={(e) => handleUpdateTool(index, 'name', e.target.value)}
                    placeholder="e.g. Photoshop"
                    className="w-full bg-surface-container-lowest px-3.5 py-1.5 rounded-lg font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                  />
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveTool(index)}
                  className="p-2 rounded-xl text-error hover:bg-error-container/20 transition-colors self-end sm:self-center cursor-pointer"
                  title="Remove this tool badge"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Common Icon Picker Chips */}
          <div className="pt-2 border-t border-outline-variant/20">
            <span className="text-xs text-secondary block mb-2 font-medium">
              Popular Google Material Icons (Click to copy name):
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMON_ICONS.map((item) => (
                <button
                  key={item.icon}
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(item.icon);
                    setToastMessage(`Icon code "${item.icon}" copied! Paste it in the icon box.`);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-secondary-container text-xs text-on-surface border border-outline-variant/30 cursor-pointer transition-colors"
                  title={`Click to copy: ${item.icon}`}
                >
                  <span className="material-symbols-outlined text-primary text-[14px]">{item.icon}</span>
                  <span>{item.icon}</span>
                  <span className="text-[10px] text-secondary">({item.label})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2.5 HERO "LIVE SPECIMEN" & 2 SHOWCASE PHOTOS (Direct user request)         */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
          <div className="border-b border-outline-variant/20 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">photo_library</span>
              <h2 className="font-headline-sm text-lg md:text-xl font-semibold text-on-surface">
                Hero "Live Specimen" & Floating Showcase Photos (2 Photos)
              </h2>
            </div>
            <p className="font-body-sm text-xs md:text-sm text-secondary mt-1">
              Directly change the 2 floating showcase photos (Left Photo & Right Photo) and customize the center "Live Specimen" badge card shown in your Hero section on desktop and mobile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Left Showcase Card (Photo 1) */}
            <div className="p-5 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="font-headline-sm text-sm font-semibold text-on-surface">
                    Left Floating Photo (Showcase 01)
                  </span>
                </div>
                <span className="text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded-full font-medium">
                  Hero Left Photo
                </span>
              </div>

              {/* Photo Uploader */}
              <ImageUploader
                value={settings.hero_card_left?.image || '/assets/aura-stationery.png'}
                onChange={async (url) => {
                  const updated = {
                    ...settings,
                    hero_card_left: {
                      ...(settings.hero_card_left || {}),
                      image: url,
                    },
                  };
                  setSettings(updated);
                  try {
                    await saveSiteSettings(updated);
                    setToastMessage('Left showcase photo updated and saved live!');
                  } catch (err: any) {
                    setToastMessage(`Error saving photo: ${err.message}`);
                  }
                }}
                label="Left Card Photo"
                helperText="Upload or change left floating photo (Recommended: 800×600px)"
                maxDimension={1600}
              />

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={settings.hero_card_left?.title ?? 'Aura Creative'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_card_left: {
                          ...(settings.hero_card_left || {}),
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Aura Creative"
                    className="bg-surface-container-lowest px-3 py-2 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                    Subtitle / Category
                  </label>
                  <input
                    type="text"
                    value={settings.hero_card_left?.subtitle ?? 'Identity System • 2024'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_card_left: {
                          ...(settings.hero_card_left || {}),
                          subtitle: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Identity System • 2024"
                    className="bg-surface-container-lowest px-3 py-2 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Target Project Link / Slug */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Link / Project URL
                </label>
                <input
                  type="text"
                  value={settings.hero_card_left?.link ?? '/projects/aura-creative-system'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_card_left: {
                        ...(settings.hero_card_left || {}),
                        link: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. /projects/aura-creative-system or https://..."
                  className="bg-surface-container-lowest px-3 py-2 rounded-xl text-xs text-on-surface border border-outline-variant/40 focus:border-primary outline-none font-mono"
                />
              </div>
            </div>

            {/* 2. Right Showcase Card (Photo 2) */}
            <div className="p-5 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30 space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="font-headline-sm text-sm font-semibold text-on-surface">
                    Right Floating Photo (Showcase 02)
                  </span>
                </div>
                <span className="text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded-full font-medium">
                  Hero Right Photo
                </span>
              </div>

              {/* Photo Uploader */}
              <ImageUploader
                value={settings.hero_card_right?.image || '/assets/synthesis-poster.png'}
                onChange={async (url) => {
                  const updated = {
                    ...settings,
                    hero_card_right: {
                      ...(settings.hero_card_right || {}),
                      image: url,
                    },
                  };
                  setSettings(updated);
                  try {
                    await saveSiteSettings(updated);
                    setToastMessage('Right showcase photo updated and saved live!');
                  } catch (err: any) {
                    setToastMessage(`Error saving photo: ${err.message}`);
                  }
                }}
                label="Right Card Photo"
                helperText="Upload or change right floating photo (Recommended: 800×600px)"
                maxDimension={1600}
              />

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={settings.hero_card_right?.title ?? 'Synthesis Exhibition'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_card_right: {
                          ...(settings.hero_card_right || {}),
                          title: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Synthesis Exhibition"
                    className="bg-surface-container-lowest px-3 py-2 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                    Subtitle / Category
                  </label>
                  <input
                    type="text"
                    value={settings.hero_card_right?.subtitle ?? 'Print & Motion • 2024'}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hero_card_right: {
                          ...(settings.hero_card_right || {}),
                          subtitle: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Print & Motion • 2024"
                    className="bg-surface-container-lowest px-3 py-2 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Target Project Link / Slug */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Link / Project URL
                </label>
                <input
                  type="text"
                  value={settings.hero_card_right?.link ?? '/projects/synthesis-exhibition'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_card_right: {
                        ...(settings.hero_card_right || {}),
                        link: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. /projects/synthesis-exhibition or https://..."
                  className="bg-surface-container-lowest px-3 py-2 rounded-xl text-xs text-on-surface border border-outline-variant/40 focus:border-primary outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* 3. Center "Live Specimen" Anchor Text Editor */}
          <div className="p-5 rounded-2xl bg-surface-container-low/40 border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
                <span className="font-headline-sm text-sm font-semibold text-on-surface">
                  Center "Live Specimen" Badge & Text
                </span>
              </div>
              <span className="text-[11px] text-secondary bg-surface-container px-2 py-0.5 rounded-full font-medium">
                Center Anchor Card
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={settings.hero_specimen?.badge ?? 'Live Specimen'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_specimen: {
                        ...(settings.hero_specimen || {}),
                        badge: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Live Specimen"
                  className="bg-surface-container-lowest px-3.5 py-2 rounded-xl font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Status / Counter
                </label>
                <input
                  type="text"
                  value={settings.hero_specimen?.counter ?? '01 / 05 Curated'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_specimen: {
                        ...(settings.hero_specimen || {}),
                        counter: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. 01 / 05 Curated"
                  className="bg-surface-container-lowest px-3.5 py-2 rounded-xl font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Headline Title
                </label>
                <input
                  type="text"
                  value={settings.hero_specimen?.title ?? 'Typographic Systems & Spatial Balance'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_specimen: {
                        ...(settings.hero_specimen || {}),
                        title: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Typographic Systems & Spatial Balance"
                  className="bg-surface-container-lowest px-3.5 py-2 rounded-xl font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Description / Tagline
                </label>
                <textarea
                  rows={2}
                  value={settings.hero_specimen?.subtitle ?? 'Harmonizing brand narrative with architectural layout structures.'}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      hero_specimen: {
                        ...(settings.hero_specimen || {}),
                        subtitle: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Harmonizing brand narrative with architectural layout structures."
                  className="bg-surface-container-lowest px-3.5 py-2 rounded-xl font-body-md text-sm text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. 3D PERSPECTIVE CAROUSEL PHOTOS & SLIDES (Direct user request)          */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-4">
            <div>
              <h2 className="font-headline-sm text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">view_carousel</span>
                <span>3D Perspective Carousel Photos & Slides</span>
              </h2>
              <p className="font-body-sm text-xs text-secondary mt-0.5">
                Upload photos, change titles, and manage each slide shown in the 3D Perspective Carousel on your homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCarouselSlide}
              className="px-4 py-2 rounded-full bg-primary-container text-white font-label-sm text-label-sm font-semibold hover:bg-primary transition-colors flex items-center gap-1.5 w-fit cursor-pointer shadow-sm shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
              <span>+ Add New Carousel Slide</span>
            </button>
          </div>

          {/* Carousel Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-surface-container-low/60 border border-outline-variant/40 space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Header: Slide Number & Status */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-[11px] font-bold uppercase tracking-wider">
                      Slide 0{idx + 1}
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-secondary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={proj.published}
                          onChange={async (e) => {
                            const updated = { ...proj, published: e.target.checked };
                            setProjects((prev) => prev.map((p) => (p.id === proj.id ? updated : p)));
                            await saveProject(updated);
                            setToastMessage(`Slide "${proj.title}" published status updated!`);
                          }}
                          className="accent-primary rounded w-3.5 h-3.5 cursor-pointer"
                        />
                        <span>Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteCarouselSlide(proj.id, proj.title)}
                        className="text-error hover:text-error/80 p-1 transition-colors cursor-pointer"
                        title="Delete this slide"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Photo Uploader */}
                  <ImageUploader
                    value={proj.cover_image}
                    onChange={async (url) => {
                      const updated = { ...proj, cover_image: url };
                      setProjects((prev) => prev.map((p) => (p.id === proj.id ? updated : p)));
                      try {
                        await saveProject(updated);
                        setToastMessage(`Photo updated live for "${proj.title}"!`);
                      } catch (err: any) {
                        setToastMessage(`Error updating photo: ${err.message}`);
                      }
                    }}
                    label={`Slide 0${idx + 1} Photo`}
                    helperText="Upload or change this slide's photo. Recommended: 1600×1000px"
                    maxDimension={1600}
                  />

                  {/* Title & Category inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                        Slide Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjects((prev) =>
                            prev.map((p) => (p.id === proj.id ? { ...p, title: val } : p))
                          );
                        }}
                        onBlur={async () => {
                          const current = projects.find((p) => p.id === proj.id);
                          if (current) {
                            await saveProject(current);
                            setToastMessage(`Title saved for "${current.title}"!`);
                          }
                        }}
                        placeholder="e.g. Synthesis Exhibition"
                        className="bg-surface-container-lowest px-3 py-2 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                        Category
                      </label>
                      <input
                        type="text"
                        value={proj.category}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjects((prev) =>
                            prev.map((p) => (p.id === proj.id ? { ...p, category: val } : p))
                          );
                        }}
                        onBlur={async () => {
                          const current = projects.find((p) => p.id === proj.id);
                          if (current) {
                            await saveProject(current);
                            setToastMessage(`Category saved for "${current.title}"!`);
                          }
                        }}
                        placeholder="e.g. Brand Identity, Poster"
                        className="bg-surface-container-lowest px-3 py-2 rounded-xl text-sm font-medium text-on-surface border border-outline-variant/40 focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Description input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                      Short Subtitle / Description
                    </label>
                    <input
                      type="text"
                      value={proj.short_description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjects((prev) =>
                          prev.map((p) => (p.id === proj.id ? { ...p, short_description: val } : p))
                        );
                      }}
                      onBlur={async () => {
                        const current = projects.find((p) => p.id === proj.id);
                        if (current) {
                          await saveProject(current);
                        }
                      }}
                      placeholder="Brief tagline shown on the 3D card"
                      className="bg-surface-container-lowest px-3 py-2 rounded-xl text-xs text-on-surface-variant border border-outline-variant/40 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  <span className="text-[11px] text-secondary">Updates instantly on homepage carousel.</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await saveProject(proj);
                      setToastMessage(`Slide "${proj.title}" synced live!`);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-secondary-container text-xs font-semibold text-primary border border-outline-variant/30 transition-colors cursor-pointer"
                  >
                    Sync Slide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. STUDIO PORTRAIT / PHOTO UPLOADER (Direct user request)                */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <div className="border-b border-outline-variant/20 pb-3">
            <h2 className="font-headline-sm text-lg font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">account_circle</span>
              <span>About Section Studio Portrait Photo</span>
            </h2>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              Upload your personal or 3D character portrait photo displayed on the homepage About section.
            </p>
          </div>

          <div className="max-w-md">
            <ImageUploader
              value={settings.avatar_url || '/assets/portrait.png'}
              onChange={async (url) => {
                const updated = { ...settings, avatar_url: url };
                setSettings(updated);
                try {
                  await saveSiteSettings(updated);
                  setToastMessage('Studio portrait photo updated and published live!');
                } catch (err: any) {
                  setToastMessage(`Photo save notice: ${err.message}`);
                }
              }}
              label="Studio Portrait Photo"
              helperText="Recommended: 800×800px or 1000×1000px square (PNG, WEBP, or JPG)"
              maxDimension={1000}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. STUDIO IDENTITY & TITLE                                                */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <h2 className="font-headline-sm text-lg font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
            Studio Identity & Title
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Designer Name
              </label>
              <input
                type="text"
                value={settings.designer_name}
                onChange={(e) => setSettings({ ...settings, designer_name: e.target.value })}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Professional Title
              </label>
              <input
                type="text"
                value={settings.designer_title}
                onChange={(e) =>
                  setSettings({ ...settings, designer_title: e.target.value })
                }
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Studio Location
              </label>
              <input
                type="text"
                value={settings.location}
                onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. HERO & COLOPHON NARRATIVE                                              */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <h2 className="font-headline-sm text-lg font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
            Hero & About Colophon Narrative
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Hero Display Headline
            </label>
            <input
              type="text"
              value={settings.headline}
              onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
              className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              About Bio (Colophon & Persona)
            </label>
            <textarea
              rows={4}
              value={settings.bio}
              onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
              className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Metrics Bento Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Years Experience
              </label>
              <input
                type="text"
                value={settings.years_experience}
                onChange={(e) =>
                  setSettings({ ...settings, years_experience: e.target.value })
                }
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Completed Works
              </label>
              <input
                type="text"
                value={settings.completed_works}
                onChange={(e) =>
                  setSettings({ ...settings, completed_works: e.target.value })
                }
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Satisfaction Rate
              </label>
              <input
                type="text"
                value={settings.satisfaction_rate}
                onChange={(e) =>
                  setSettings({ ...settings, satisfaction_rate: e.target.value })
                }
                className="w-full bg-surface-container-low px-4 py-2.5 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 7. CONTACT & CHANNELS                                                     */}
        {/* ========================================================================= */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <h2 className="font-headline-sm text-lg font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
            Contact & Channels
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Direct Contact Email (Public Inbox)
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
