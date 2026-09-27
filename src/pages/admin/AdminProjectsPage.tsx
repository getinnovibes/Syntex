import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects, saveProject, deleteProject } from '../../lib/supabase';
import { Project } from '../../types';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';
import { formatDate } from '../../lib/utils';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      const data = await fetchProjects(true); // include unpublished
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTogglePublish = async (project: Project) => {
    try {
      const updated = await saveProject({
        id: project.id,
        published: !project.published,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
      );
      setToastMessage(
        `Project "${project.title}" is now ${!project.published ? 'published' : 'draft'}.`
      );
    } catch (err: any) {
      setToastMessage(`Error updating status: ${err.message}`);
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await saveProject({
        id: project.id,
        featured: !project.featured,
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, featured: !p.featured } : p))
      );
      setToastMessage(
        `Project "${project.title}" ${!project.featured ? 'marked as featured' : 'unfeatured'}.`
      );
    } catch (err: any) {
      setToastMessage(`Error updating featured state: ${err.message}`);
    }
  };

  const confirmDelete = async () => {
    if (!deletingProject) return;
    try {
      await deleteProject(deletingProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      setToastMessage(`Project "${deletingProject.title}" has been deleted.`);
    } catch (err: any) {
      setToastMessage(`Failed to delete project: ${err.message}`);
    } finally {
      setDeletingProject(null);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        search.trim() === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.client?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && p.published) ||
        (statusFilter === 'draft' && !p.published);

      return matchSearch && matchStatus;
    });
  }, [projects, search, statusFilter]);

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingProject)}
        title="Delete this project?"
        description={`Are you sure you want to permanently delete "${deletingProject?.title}"? This action cannot be undone and will remove all associated database records.`}
        confirmText="Delete Project"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeletingProject(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline-xl text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
            Portfolio Works Manager
          </h1>
          <p className="font-body-md text-sm md:text-base text-secondary mt-1">
            Create, update, reorder, and publish your design projects.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-label-md text-label-md font-semibold hover:bg-primary/90 shadow-[0_8px_20px_-4px_rgba(108,59,255,0.35)] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Project</span>
        </Link>
      </div>

      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-full">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              statusFilter === 'all'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              statusFilter === 'published'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Live ({projects.filter((p) => p.published).length})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              statusFilter === 'draft'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Drafts ({projects.filter((p) => !p.published).length})
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search by title, client, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest pl-10 pr-4 py-2.5 rounded-full font-body-sm text-body-sm text-on-surface placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:border-primary shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-outline text-[18px]">
            search
          </span>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/40 text-outline font-label-sm text-label-sm">
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Project</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Category</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Client & Year</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider text-center">
                  Featured
                </th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider text-center">Status</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Last Updated</th>
                <th className="py-4 px-4 text-right font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary">
                    Loading portfolio projects from Supabase...
                  </td>
                </tr>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    {/* Project Title & Thumbnail */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant/30 shadow-sm">
                          <img
                            src={project.cover_image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col min-w-0 max-w-[220px]">
                          <span className="font-semibold text-on-surface truncate">
                            {project.title}
                          </span>
                          <span className="font-label-sm text-[11px] text-outline truncate font-mono">
                            /{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-secondary-container text-primary font-label-sm text-[11px] font-medium">
                        {project.category}
                      </span>
                    </td>

                    {/* Client & Year */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-on-surface font-medium truncate max-w-[160px]">
                          {project.client || 'Studio Project'}
                        </span>
                        <span className="font-label-sm text-[11px] text-secondary">
                          {project.year || '2024'}
                        </span>
                      </div>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        title={project.featured ? 'Unmark Featured' : 'Mark Featured'}
                        className={`p-1.5 rounded-full transition-colors ${
                          project.featured
                            ? 'text-amber-500 hover:text-amber-600 bg-amber-50'
                            : 'text-outline/40 hover:text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {project.featured ? 'star' : 'star_border'}
                        </span>
                      </button>
                    </td>

                    {/* Published State Badge & Toggle */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-[11px] font-semibold transition-all ${
                          project.published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-surface-container text-secondary hover:bg-surface-container-high'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.published ? 'bg-emerald-500' : 'bg-outline'
                          }`}
                        />
                        <span>{project.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 whitespace-nowrap font-label-sm text-[11px] text-outline">
                      {formatDate(project.updated_at || project.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/projects/${project.slug}`}
                          target="_blank"
                          title="Preview Public Page"
                          className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </Link>
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          title="Edit Project"
                          className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button
                          onClick={() => setDeletingProject(project)}
                          title="Delete Project"
                          className="p-1.5 rounded-full text-outline hover:text-error hover:bg-error-container/20 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary">
                    No projects found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-surface-container-low/30 border-t border-outline-variant/20 flex items-center justify-between text-secondary font-label-sm text-label-sm">
          <span>Total projects in CMS: {projects.length}</span>
          <span>Live published: {projects.filter((p) => p.published).length}</span>
        </div>
      </div>
    </div>
  );
};
