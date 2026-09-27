import React, { useEffect, useState } from 'react';
import { fetchSiteSettings, saveSiteSettings } from '../../lib/supabase';
import { SiteSettings } from '../../types';
import { Toast } from '../../components/common/Toast';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSiteSettings();
        setSettings(data);
      } catch (err: any) {
        setToastMessage(`Error loading settings: ${err.message}`);
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
      setToastMessage('Site settings updated and synced with live portfolio!');
    } catch (err: any) {
      setToastMessage(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1000px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline-xl text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
            Site Settings & Bio
          </h1>
          <p className="font-body-md text-sm md:text-base text-secondary mt-1">
            Control the public headline, colophon, metrics, and contact channels.
          </p>
        </div>

        <button
          form="settings-form"
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-primary-container text-white font-label-md text-label-md font-semibold hover:bg-primary transition-all shadow-md shadow-primary-container/20 disabled:opacity-50"
        >
          {saving ? 'Syncing...' : 'Save & Publish Changes'}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Brand & Designer Info */}
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

          {/* Availability Status */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Availability Status Badge
            </label>
            <input
              type="text"
              value={settings.availability_status}
              onChange={(e) =>
                setSettings({ ...settings, availability_status: e.target.value })
              }
              className="w-full bg-surface-container-low px-4 py-3 rounded-xl font-body-md text-on-surface border border-transparent focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Hero & Colophon Narrative */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/30 shadow-sm space-y-5">
          <h2 className="font-headline-sm text-lg font-semibold text-on-surface border-b border-outline-variant/20 pb-3">
            Hero & About Colophon
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

        {/* Contact Email & Networks */}
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
