import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { MobileNav } from '../components/common/MobileNav';
import { fetchProjectBySlug, fetchProjects } from '../lib/supabase';
import { Project } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [currentProj, projList] = await Promise.all([
          fetchProjectBySlug(slug),
          fetchProjects(false),
        ]);
        setProject(currentProj);
        setAllProjects(projList);
      } catch (err) {
        console.error('Error fetching project detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pt-24">
          <span className="material-symbols-outlined text-[64px] text-outline mb-4">
            search_off
          </span>
          <h1 className="font-headline-md text-3xl font-bold text-on-surface">
            Project Not Found
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-2 max-w-md">
            The requested project could not be found or has not yet been published.
          </p>
          <a
            href="/#portfolio-section"
            className="mt-6 px-6 py-2.5 rounded-full bg-primary-container text-white font-label-md text-label-md"
          >
            Explore Portfolio
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  // Find next project for navigation loop
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject =
    currentIndex >= 0 && allProjects.length > 1
      ? allProjects[(currentIndex + 1) % allProjects.length]
      : null;

  return (
    <div className="bg-background min-h-screen flex flex-col antialiased">
      <Header />

      <main className="flex-1 pt-24 pb-24 px-6 md:px-margin-lg max-w-[1440px] mx-auto w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 font-label-md text-label-sm text-outline mb-6">
          <Link to="/" className="hover:text-on-surface transition-colors">
            Home
          </Link>
          <span>/</span>
          <a href="/#portfolio-section" className="hover:text-on-surface transition-colors">
            Portfolio
          </a>
          <span>/</span>
          <span className="text-primary font-medium truncate max-w-[200px]">
            {project.title}
          </span>
        </div>

        {/* Project Header */}
        <div className="max-w-4xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/60 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <h1 className="font-headline-xl text-3xl sm:text-5xl md:text-headline-xl text-on-surface font-semibold tracking-tight leading-[1.1]">
            {project.title}
          </h1>

          <p className="font-body-lg text-lg md:text-body-lg text-on-surface-variant mt-4 leading-relaxed">
            {project.short_description}
          </p>
        </div>

        {/* Hero Cover Image Preview */}
        <div className="w-full rounded-3xl overflow-hidden bg-surface-container mb-12 shadow-[0_24px_50px_-12px_rgba(8,8,8,0.1)] border border-outline-variant/40">
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-auto max-h-[720px] object-cover"
          />
        </div>

        {/* Project Details Grid (Metadata + Narrative) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Metadata Sidebar (4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/40 shadow-sm space-y-6">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Client
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {project.client || 'Confidential Client'}
                </p>
              </div>

              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Timeline / Year
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {project.year || '2024'}
                </p>
              </div>

              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Role & Discipline
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface mt-1">
                  {project.role || 'Visual Director & Designer'}
                </p>
              </div>

              {project.services && (
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                    Deliverables & Scope
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {project.services}
                  </p>
                </div>
              )}

              {project.tags && project.tags.length > 0 && (
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary mb-2 block">
                    Tags & Index
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-surface-container font-label-sm text-[11px] text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Contact Box */}
            <div className="bg-secondary-container/40 p-6 rounded-3xl border border-primary/20 flex flex-col gap-3">
              <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                Need similar design craft?
              </span>
              <p className="font-body-sm text-body-sm text-secondary">
                Let's discuss how to bring this level of visual precision to your brand or project.
              </p>
              <a
                href="#contact-section"
                onClick={() => {
                  navigate('/#contact-section');
                }}
                className="mt-2 inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary-container text-white font-label-md text-label-md font-semibold hover:bg-primary transition-all shadow-md shadow-primary-container/20"
              >
                Inquire About Project
              </a>
            </div>
          </div>

          {/* Narrative / Case Study Breakdown (8 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/40 shadow-sm space-y-6">
              <h2 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-semibold tracking-tight">
                Case Study Overview
              </h2>
              <div className="font-body-lg text-base md:text-body-lg text-on-surface-variant leading-relaxed space-y-4">
                <p>
                  {project.full_description || project.short_description}
                </p>
              </div>
            </div>

            {/* Additional Gallery Images if present */}
            {project.gallery_images && project.gallery_images.length > 1 && (
              <div className="space-y-6">
                <h3 className="font-headline-md text-xl font-semibold text-on-surface">
                  Visual Documentation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.gallery_images.slice(1).map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/30 shadow-sm"
                    >
                      <img
                        src={img.storage_path}
                        alt={img.alt_text || `${project.title} detail`}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Project Footer Bar */}
        {nextProject && (
          <div className="pt-12 border-t border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <a
              href="/#portfolio-section"
              className="inline-flex items-center gap-2 font-label-md text-label-md text-secondary hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Portfolio</span>
            </a>

            <Link
              to={`/projects/${nextProject.slug}`}
              className="group flex items-center gap-4 text-right"
            >
              <div className="flex flex-col">
                <span className="font-label-sm text-[11px] text-secondary uppercase tracking-widest">
                  Next Project
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                  {nextProject.title}
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </Link>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};
