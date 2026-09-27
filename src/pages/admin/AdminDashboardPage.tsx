import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/admin/StatCard';
import { fetchProjects, fetchInquiries, updateInquiryStatus, fetchSiteSettings } from '../../lib/supabase';
import { Project, Inquiry, SiteSettings } from '../../types';
import { formatDate } from '../../lib/utils';
import { Toast } from '../../components/common/Toast';

export const AdminDashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      const [projList, inqList, siteData] = await Promise.all([
        fetchProjects(true), // load all including drafts
        fetchInquiries(),
        fetchSiteSettings(),
      ]);
      setProjects(projList);
      setInquiries(inqList);
      setSettings(siteData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusChange = async (inquiryId: string, newStatus: Inquiry['status']) => {
    await updateInquiryStatus(inquiryId, newStatus);
    setInquiries((prev) =>
      prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
    );
    setToastMessage(`Inquiry marked as ${newStatus.replace('_', ' ')}.`);
  };

  // Live KPI Calculations
  const totalProjects = projects.length;
  const activeServices = settings?.services_list?.length || 4;
  const totalInquiries = inquiries.length;
  const needsReviewCount = inquiries.filter((i) => i.status === 'new').length;

  const filteredInquiries = useMemo(() => {
    if (inquiryFilter === 'all') return inquiries;
    return inquiries.filter((i) => i.status === inquiryFilter);
  }, [inquiries, inquiryFilter]);

  const featuredProjects = useMemo(() => {
    return projects.filter((p) => p.featured || p.published).slice(0, 3);
  }, [projects]);

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Top Welcome Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-outline-variant/30">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              STUDIO OVERVIEW
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              v2.4.0 • Realtime Database
            </span>
          </div>
          <h1 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface tracking-tight font-semibold">
            Welcome back, {settings?.designer_name || 'Abdullah'}
          </h1>
          <p className="font-body-lg text-base md:text-body-lg text-secondary">
            Manage your portfolio, services, and incoming client requests from one tactile creative hub.
          </p>
        </div>

        {/* Quick Actions Top Level */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/settings"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface hover:bg-secondary-container hover:text-primary transition-all duration-200 shadow-sm border border-outline-variant/40 font-label-md text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Settings</span>
          </Link>
          <Link
            to="/admin/projects/new"
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary/90 transition-all duration-200 shadow-[0_12px_28px_-6px_rgba(108,59,255,0.35)] font-label-md text-label-md font-semibold active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110">
              add_circle
            </span>
            <span>Add Project</span>
          </Link>
        </div>
      </div>

      {/* KPI Metagrid (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-8">
        <StatCard
          label="Portfolio Works"
          value={loading ? '...' : totalProjects}
          subtext="Curated visual casefiles"
          icon="folder_special"
          progressPercent={80}
        />
        <StatCard
          label="Active Services"
          value={loading ? '...' : activeServices}
          subtext="Standard Studio Packages"
          icon="layers"
          progressPercent={100}
        />
        <StatCard
          label="Total Inquiries"
          value={loading ? '...' : totalInquiries}
          subtext="Direct commission requests"
          icon="inbox"
          progressPercent={65}
        />
        <StatCard
          label="Needs Review"
          value={loading ? '...' : needsReviewCount}
          subtext="Awaiting response"
          badge="Priority"
          icon="notifications_active"
          isPriority={needsReviewCount > 0}
          progressPercent={needsReviewCount > 0 ? 90 : 20}
        />
      </div>

      {/* Main Content Split (8 / 4 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
        {/* Left Column (8 Columns): Recent Requests & Filters */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col">
            {/* Card Header & Navigation Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
              <div>
                <h2 className="font-headline-md text-xl md:text-headline-md text-on-surface font-semibold">
                  Recent Project Requests
                </h2>
                <p className="font-body-sm text-body-sm text-secondary">
                  Review, triage, and accept client briefs.
                </p>
              </div>

              {/* Segmented Filter Control */}
              <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-full overflow-x-auto">
                <button
                  onClick={() => setInquiryFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
                    inquiryFilter === 'all'
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  All ({inquiries.length})
                </button>
                <button
                  onClick={() => setInquiryFilter('new')}
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
                    inquiryFilter === 'new'
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  New ({needsReviewCount})
                </button>
                <button
                  onClick={() => setInquiryFilter('in_progress')}
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
                    inquiryFilter === 'in_progress'
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setInquiryFilter('completed')}
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
                    inquiryFilter === 'completed'
                      ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 text-outline font-label-sm text-label-sm">
                    <th className="py-4 px-3 font-medium uppercase tracking-wider">Client</th>
                    <th className="py-4 px-3 font-medium uppercase tracking-wider">Service</th>
                    <th className="py-4 px-3 font-medium uppercase tracking-wider">Budget</th>
                    <th className="py-4 px-3 font-medium uppercase tracking-wider">Status</th>
                    <th className="py-4 px-3 font-medium uppercase tracking-wider">Date</th>
                    <th className="py-4 px-3 text-right font-medium uppercase tracking-wider">
                      Status Change
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
                  {filteredInquiries.length > 0 ? (
                    filteredInquiries.slice(0, 6).map((inq) => {
                      const initials = inq.client_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase();

                      return (
                        <tr key={inq.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-4 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary-container text-primary font-label-sm text-[12px] flex items-center justify-center font-bold">
                                {initials || 'CL'}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-on-surface leading-snug">
                                  {inq.client_name}
                                </span>
                                <span className="font-label-sm text-[11px] text-outline">
                                  {inq.email || 'No email provided'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
                              {inq.service_type}
                            </span>
                          </td>
                          <td className="py-4 px-3 whitespace-nowrap font-label-md text-label-md font-medium text-on-surface">
                            {inq.budget || 'Custom'}
                          </td>
                          <td className="py-4 px-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full font-label-sm text-[11px] font-semibold ${
                                inq.status === 'new'
                                  ? 'bg-secondary-container text-primary'
                                  : inq.status === 'in_progress'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  inq.status === 'new'
                                    ? 'bg-primary'
                                    : inq.status === 'in_progress'
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                              />
                              <span className="capitalize">{inq.status.replace('_', ' ')}</span>
                            </span>
                          </td>
                          <td className="py-4 px-3 whitespace-nowrap font-label-sm text-[11px] text-outline">
                            {formatDate(inq.created_at)}
                          </td>
                          <td className="py-4 px-3 text-right whitespace-nowrap">
                            <select
                              value={inq.status}
                              onChange={(e) =>
                                handleStatusChange(inq.id, e.target.value as Inquiry['status'])
                              }
                              className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-[11px] border border-outline-variant/40 focus:outline-none cursor-pointer"
                            >
                              <option value="new">Mark New</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-secondary font-label-sm">
                        No client inquiries found for this status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Action */}
            <div className="pt-6 mt-2 border-t border-outline-variant/30 flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline">
                Showing {Math.min(filteredInquiries.length, 6)} of {inquiries.length} inquiries
              </span>
              <Link
                to="/admin/inquiries"
                className="inline-flex items-center gap-1.5 font-label-sm text-label-sm font-semibold text-primary hover:underline"
              >
                <span>View All Inquiries</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Sparkline Conversion Velocity Ribbon */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">query_stats</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Client Conversion Velocity
                </span>
                <span className="font-body-sm text-body-sm text-secondary">
                  Average inquiry-to-commission turnaround: 2.8 business hours
                </span>
              </div>
            </div>

            {/* SVG Mini Sparkline Representation */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="h-10 w-36 flex items-end gap-1.5">
                <div className="w-3 bg-secondary-container rounded-t h-[40%]" />
                <div className="w-3 bg-secondary-container rounded-t h-[60%]" />
                <div className="w-3 bg-secondary-container rounded-t h-[30%]" />
                <div className="w-3 bg-secondary-container rounded-t h-[75%]" />
                <div className="w-3 bg-secondary-container rounded-t h-[50%]" />
                <div className="w-3 bg-primary rounded-t h-[95%]" />
                <div className="w-3 bg-primary/40 rounded-t h-[70%]" />
              </div>
              <div className="flex flex-col text-right">
                <span className="font-label-md text-label-md font-bold text-primary">+28%</span>
                <span className="font-label-sm text-label-sm text-outline">vs last cycle</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 Columns): Stacked Studio Control Modules */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Module 1: Website Status Card */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Live & Public
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-outline">
                Edge CDN
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-secondary mt-4 leading-relaxed">
              Your creative portfolio is live and synced with Supabase Database and Storage.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-surface-container-low flex items-center justify-between text-outline font-label-sm text-label-sm">
              <span>
                Uptime: <strong className="text-on-surface font-semibold">99.98%</strong>
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span>
                Latency: <strong className="text-on-surface font-semibold">18ms</strong>
              </span>
            </div>

            <div className="mt-5">
              <Link
                to="/"
                target="_blank"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-secondary-container text-on-surface hover:text-primary transition-all font-label-md text-label-md font-medium"
              >
                <span>Open Public Portfolio</span>
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </Link>
            </div>
          </div>

          {/* Module 2: Quick Studio Actions */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Quick Studio Actions
              </h3>
              <span className="material-symbols-outlined text-outline text-[18px]">bolt</span>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Link
                to="/admin/projects/new"
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-secondary-container text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                  </span>
                  <span className="font-body-sm text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    Add New Portfolio Project
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px] group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/projects"
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">post_add</span>
                  </span>
                  <span className="font-body-sm text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    Manage Portfolio Works
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px] group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                to="/admin/settings"
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container-low transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">edit_note</span>
                  </span>
                  <span className="font-body-sm text-body-sm font-medium text-on-surface group-hover:text-primary transition-colors">
                    Edit Bio & Site Settings
                  </span>
                </div>
                <span className="material-symbols-outlined text-outline text-[16px] group-hover:translate-x-0.5 transition-transform">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          {/* Module 3: Compact Portfolio Highlights */}
          <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Featured Works
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-primary font-label-sm text-[11px] font-semibold">
                  {featuredProjects.length} Active
                </span>
              </div>
              <Link
                to="/admin/projects"
                className="font-label-sm text-label-sm text-primary font-medium hover:underline"
              >
                Manage ({projects.length})
              </Link>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              {featuredProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/admin/projects/${p.id}/edit`}
                  className="group flex items-center gap-3.5 p-2 rounded-2xl hover:bg-surface-container-low transition-all"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-container shrink-0 shadow-sm border border-outline-variant/30">
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline truncate">
                        {p.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-label-sm text-[10px] font-semibold">
                        {p.published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <h4 className="font-headline-sm text-sm text-on-surface truncate group-hover:text-primary transition-colors font-medium">
                      {p.title}
                    </h4>
                    <span className="font-label-sm text-[11px] text-secondary truncate">
                      {p.client || 'Creative Project'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
