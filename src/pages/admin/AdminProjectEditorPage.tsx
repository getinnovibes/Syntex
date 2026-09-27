import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProjects, saveProject, deleteProject, fetchProjectBySlug } from '../../lib/supabase';
import { Project } from '../../types';
import { ImageUploader } from '../../components/admin/ImageUploader';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { slugify } from '../../lib/utils';

export const AdminProjectEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    category: 'Brand Identity',
    tags: [],
    client: '',
    year: '2026',
    role: 'Lead Visual Designer',
    services: '',
    cover_image: '',
    featured: false,
    published: true,
    sort_order: 1,
  });

  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function loadProject() {
      if (!isEditing || !id) return;
      setLoading(true);
      try {
        const all = await fetchProjects(true);
        const target = all.find((p) => p.id === id);
        if (target) {
          setFormData(target);
          setTagInput(target.tags?.join(', ') || '');
        } else {
          setToastMessage('Project not found.');
        }
      } catch (err: any) {
        setToastMessage(`Error loading project: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id, isEditing]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      // Auto-generate slug if not manually customized or creating new
      slug: !isEditing ? slugify(val) : prev.slug,
    }));
  };

  const handleSave = async (publishState?: boolean) => {
    if (!formData.title?.trim()) {
      setToastMessage('Project Title is required.');
      return;
    }
    if (!formData.slug?.trim()) {
      setToastMessage('Project Slug is required.');
      return;
    }
    if (!formData.cover_image?.trim()) {
      setToastMessage('Please upload or provide a Cover Image.');
      return;
    }

    setSaving(true);
    try {
      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const toSave = {
        ...formData,
        tags: parsedTags,
        published: publishState !== undefined ? publishState : formData.published,
      };

      const result = await saveProject(toSave);
      setToastMessage(`Project "${result.title}" saved successfully!`);
      setTimeout(() => {
        navigate('/admin/projects');
      }, 1000);
    } catch (err: any) {
      setToastMessage(`Failed to save project: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteProject(id);
      setToastMessage('Project deleted successfully.');
      setTimeout(() => navigate('/admin/projects'), 800);
    } catch (err: any) {
      setToastMessage(`Failed to delete: ${err.message}`);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete this project?"
        description="Are you sure you want to permanently delete this project? This cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Top Breadcrumb & Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 font-label-md text-label-sm text-outline mb-1">
            <Link to="/admin/projects" className="hover:text-on-surface">
              Projects
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">
              {isEditing ? 'Edit Project' : 'New Project'}
            </span>
          </div>
          <h1 className="font-headline-xl text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
            {formData.title || 'Untitled Casefile'}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isEditing && formData.slug && (
            <Link
              to={`/projects/${formData.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-full border border-outline-variant text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-sm inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Preview</span>
            </Link>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="p-2 rounded-full text-outline hover:text-error hover:bg-error-container/20 transition-colors"
              title="Delete Project"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-secondary-container transition-all font-label-md text-label-md font-medium disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="px-6 py-2.5 rounded-full bg-primary-container text-white hover:bg-primary transition-all font-label-md text-label-md font-semibold shadow-md shadow-primary-container/20 disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish Project'}
          </button>
        </div>
      </div>

      {/* Editor Form Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Left Column (8 cols): Metadata & Descriptions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Section 1: Basic Info */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
            <h2 className="font-headline-sm text-lg font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
              Project Fundamentals
            </h2>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Synthesis Exhibition 2024"
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
              />
            </div>

            {/* Slug & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  URL Slug *
                </label>
                <input
                  type="text"
                  placeholder="synthesis-exhibition"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-mono text-sm text-on-surface placeholder:text-outline border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Category *
                </label>
                <select
                  value={formData.category || 'Brand Identity'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none cursor-pointer"
                >
                  <option value="Brand Identity">Brand Identity</option>
                  <option value="Poster Design">Poster Design</option>
                  <option value="Banner Design">Banner Design</option>
                  <option value="Thumbnail Design">Thumbnail Design</option>
                  <option value="Digital Campaign">Digital Campaign</option>
                  <option value="3D Craft & Spatial">3D Craft & Spatial</option>
                </select>
              </div>
            </div>

            {/* Client, Year, Role */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aura Creative"
                  value={formData.client || ''}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Year
                </label>
                <input
                  type="text"
                  placeholder="2024"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Role / Discipline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Visual Director"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
                />
              </div>
            </div>

            {/* Services scope */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Services & Deliverables Scope
              </label>
              <input
                type="text"
                placeholder="e.g. Brand Guidelines, Stationery Design, Foil Stamping, Print Production"
                value={formData.services || ''}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Identity System, Typography, Print, 3D"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
              />
            </div>
          </div>

          {/* Section 2: Narrative Descriptions */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
            <h2 className="font-headline-sm text-lg font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
              Editorial Narrative
            </h2>

            {/* Short Description */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Short Teaser Description (for Cards & Carousel)
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary displayed on cards and carousel..."
                value={formData.short_description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, short_description: e.target.value })
                }
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none resize-none"
              />
            </div>

            {/* Full Case Study Breakdown */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Full Case Study Breakdown
              </label>
              <textarea
                rows={6}
                placeholder="Deep case study description explaining artistic choices, client background, methodology, and outcome..."
                value={formData.full_description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, full_description: e.target.value })
                }
                className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary focus:bg-surface-container-lowest transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Media Asset & Publishing State */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Cover Media Uploader */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-4">
            <h3 className="font-headline-sm text-base font-semibold text-on-surface">
              Project Cover Asset
            </h3>

            <ImageUploader
              value={formData.cover_image || ''}
              onChange={(url) => setFormData({ ...formData, cover_image: url })}
            />

            <div className="pt-2">
              <label className="font-label-sm text-[11px] uppercase tracking-wider text-secondary block mb-1">
                Or Direct Image URL
              </label>
              <input
                type="url"
                placeholder="https://... or /assets/..."
                value={formData.cover_image || ''}
                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-mono text-xs text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Publishing Controls Card */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
            <h3 className="font-headline-sm text-base font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
              Publishing Status
            </h3>

            {/* Published Toggle */}
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm font-medium text-on-surface">
                  Publish to Public Site
                </span>
                <span className="font-label-sm text-[11px] text-secondary">
                  Visible to all portfolio visitors
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(formData.published)}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </label>

            {/* Featured Toggle */}
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
              <div className="flex flex-col">
                <span className="font-headline-sm text-sm font-medium text-on-surface">
                  Featured Presentation
                </span>
                <span className="font-label-sm text-[11px] text-secondary">
                  Pinned in 3D carousel showcase
                </span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(formData.featured)}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 accent-primary rounded cursor-pointer"
              />
            </label>

            {/* Sort Order */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                Sort Order
              </span>
              <input
                type="number"
                min={0}
                value={formData.sort_order ?? 1}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                }
                className="w-20 bg-surface-container-low px-3 py-1.5 rounded-lg font-mono text-sm text-right outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
