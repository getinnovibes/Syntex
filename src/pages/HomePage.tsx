import React, { useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileNav } from '../components/common/MobileNav';
import { HeroSection } from '../components/portfolio/HeroSection';
import { PerspectiveCarousel } from '../components/portfolio/PerspectiveCarousel';
import { AboutSection } from '../components/portfolio/AboutSection';
import { ServicesSection } from '../components/portfolio/ServicesSection';
import { ContactSection } from '../components/portfolio/ContactSection';
import { fetchProjects, fetchSiteSettings, supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project, SiteSettings } from '../types';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projData, settingsData] = await Promise.all([
          fetchProjects(false), // only published projects for public
          fetchSiteSettings(),
        ]);
        setProjects(projData);
        setSettings(settingsData);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Listen to real-time custom updates & cross-tab storage changes
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('syntax_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Supabase Realtime multi-device subscription
    let realtimeChannel: any = null;
    if (isSupabaseConfigured) {
      realtimeChannel = supabase
        .channel('homepage_live_sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
          loadData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
          loadData();
        })
        .subscribe();
    }

    return () => {
      window.removeEventListener('syntax_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  return (
    <div className="bg-background min-h-screen flex flex-col antialiased">
      <Header />
      <main className="flex-1 pt-20">
        <HeroSection
          headline={settings?.headline}
          bio={settings?.bio}
          availabilityStatus={settings?.availability_status}
          toolkit={settings?.toolkit}
          featuredProjects={projects.filter((p) => p.featured)}
          heroCardLeft={settings?.hero_card_left}
          heroCardRight={settings?.hero_card_right}
          heroSpecimen={settings?.hero_specimen}
        />

        <AboutSection settings={settings || undefined} />

        <ServicesSection services={settings?.services_list} />

        <PerspectiveCarousel projects={projects} />

        <ContactSection contactEmail={settings?.contact_email} />
      </main>

      <Footer
        designerName={settings?.designer_name}
        designerTitle={settings?.designer_title}
        socialLinks={settings?.social_links}
      />

      <MobileNav />
    </div>
  );
};
