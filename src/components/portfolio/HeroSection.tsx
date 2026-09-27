import React from 'react';
import { Link } from 'react-router-dom';
import { ToolItem, Project } from '../../types';

interface HeroSectionProps {
  headline?: string;
  bio?: string;
  availabilityStatus?: string;
  toolkit?: ToolItem[];
  featuredProjects?: Project[];
}

const DEFAULT_TOOLKIT: ToolItem[] = [
  { name: 'Photoshop', icon: 'auto_fix_high' },
  { name: 'Illustrator', icon: 'draw' },
  { name: 'Figma', icon: 'dashboard_customize' },
  { name: 'After Effects', icon: 'animation' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  headline = 'Visual Design & High-Impact Digital Craft',
  bio = 'A creative designer focused on brand identity, digital visuals and high-impact design experiences.',
  availabilityStatus = 'Independent Practice • Available for Q2/Q3 Projects',
  toolkit = DEFAULT_TOOLKIT,
  featuredProjects = [],
}) => {
  const activeTools = toolkit && toolkit.length > 0 ? toolkit : DEFAULT_TOOLKIT;
  const projectLeft = featuredProjects[0];
  const projectRight = featuredProjects[1] || featuredProjects[0];

  return (
    <section className="relative w-full overflow-hidden px-6 md:px-margin-lg pt-8 md:pt-space-xl pb-16 md:pb-space-3xl flex flex-col items-center text-center">
      {/* Ambient Violet Glow Orbs */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-primary-fixed-dim/35 via-primary-fixed/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary-fixed-dim/20 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-secondary-container/40 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Designer Pill Badge */}
      <div className="inline-flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container-lowest shadow-[0_4px_16px_rgba(8,8,8,0.04)] border border-outline-variant/30 mb-6 md:mb-space-lg transition-all duration-300">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
        <span className="font-label-md text-label-sm md:text-label-md text-on-surface-variant font-medium tracking-wider uppercase">
          {availabilityStatus || 'Independent Practice • Available for Q2/Q3 Projects'}
        </span>
      </div>

      {/* Centered Editorial Headline */}
      <div className="max-w-5xl mx-auto space-y-space-md">
        <h1 className="font-display-hero text-3xl sm:text-5xl md:text-display-hero text-on-surface tracking-tight leading-[1.1] md:leading-[80px]">
          Visual Design &{' '}
          <span className="text-primary-container bg-gradient-to-r from-primary-container to-surface-tint bg-clip-text text-transparent">
            {headline && headline.includes('&') ? headline.split('&')[1].trim() : 'High-Impact Digital Craft'}
          </span>
        </h1>
        <p className="max-w-2xl mx-auto font-body-lg text-base md:text-body-lg text-on-surface-variant leading-relaxed">
          {bio}
        </p>
      </div>

      {/* Action Bar & Tool Badge Strip */}
      <div className="mt-8 md:mt-space-xl flex flex-col sm:flex-row items-center justify-center gap-space-md z-20 w-full sm:w-auto">
        <a
          href="#contact-section"
          className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-3.5 bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-full shadow-[0_12px_28px_-6px_rgba(108,59,255,0.32)] hover:bg-primary transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
        >
          <span>Start a Project</span>
          <span className="material-symbols-outlined ml-space-xs text-[20px]">arrow_forward</span>
        </a>
        <a
          href="#portfolio-section"
          className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-3.5 bg-surface-container-lowest text-on-surface font-headline-sm text-headline-sm rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.04)] border border-outline-variant/40 hover:bg-secondary-container/40 transition-all duration-200"
        >
          Explore Portfolio
        </a>
      </div>

      {/* Minimal Luxury Software Pill Badges */}
      <div className="mt-8 md:mt-space-xl inline-flex flex-wrap items-center justify-center gap-space-xs bg-surface-container-lowest/80 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-[0_6px_20px_-4px_rgba(8,8,8,0.04)] border border-outline-variant/30">
        <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mr-space-xs">
          Toolkit
        </span>
        {activeTools.map((tool, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface font-label-sm text-label-sm transition-transform hover:scale-105"
          >
            <span className="material-symbols-outlined text-primary text-[15px]">{tool.icon || 'star'}</span>
            <span>{tool.name}</span>
          </div>
        ))}
      </div>

      {/* Floating Perspective Project Previews (Desktop) */}
      <div className="relative w-full max-w-6xl mt-12 md:mt-space-2xl min-h-[380px] hidden md:block">
        {/* Floating Card Left */}
        <Link
          to={`/projects/${projectLeft?.slug || 'aura-creative-system'}`}
          className="absolute left-4 top-4 w-72 rounded-2xl bg-surface-container-lowest p-space-sm shadow-[0_24px_50px_-12px_rgba(8,8,8,0.12)] border border-outline-variant/40 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 text-left block"
        >
          <div className="w-full h-44 rounded-xl overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              alt={projectLeft?.title || 'Aura Creative luxury corporate stationery mockup'}
              src={projectLeft?.cover_image || '/assets/aura-stationery.png'}
            />
          </div>
          <div className="pt-space-sm flex items-center justify-between">
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[190px]">
                {projectLeft?.title || 'Aura Creative'}
              </p>
              <p className="font-label-sm text-label-sm text-secondary truncate max-w-[190px]">
                {projectLeft ? `${projectLeft.category} • ${projectLeft.year}` : 'Identity System • 2024'}
              </p>
            </div>
            <span className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </span>
          </div>
        </Link>

        {/* Center Minimal Specimen Anchor */}
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-80 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl p-space-md shadow-[0_30px_60px_-15px_rgba(108,59,255,0.12)] border border-outline-variant/40 z-20 text-left">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
              Live Specimen
            </span>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> Curated
            </span>
          </div>
          <p className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight mt-1">
            Typographic Systems & Spatial Balance
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
            Harmonizing brand narrative with architectural layout structures.
          </p>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-secondary border-t border-outline-variant/20">
            <span>01 / 05 Curated</span>
            <a href="#portfolio-section" className="text-primary font-medium hover:underline">
              View Portfolio →
            </a>
          </div>
        </div>

        {/* Floating Card Right */}
        <Link
          to={`/projects/${projectRight?.slug || 'synthesis-exhibition'}`}
          className="absolute right-4 top-2 w-72 rounded-2xl bg-surface-container-lowest p-space-sm shadow-[0_24px_50px_-12px_rgba(8,8,8,0.12)] border border-outline-variant/40 transform rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 text-left block"
        >
          <div className="w-full h-44 rounded-xl overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              alt={projectRight?.title || 'Synthesis digital art exhibition poster'}
              src={projectRight?.cover_image || '/assets/synthesis-poster.png'}
            />
          </div>
          <div className="pt-space-sm flex items-center justify-between">
            <div>
              <p className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[190px]">
                {projectRight?.title || 'Synthesis Exhibition'}
              </p>
              <p className="font-label-sm text-label-sm text-secondary truncate max-w-[190px]">
                {projectRight ? `${projectRight.category} • ${projectRight.year}` : 'Print & Motion • 2024'}
              </p>
            </div>
            <span className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[16px]">north_east</span>
            </span>
          </div>
        </Link>
      </div>

      {/* Mobile Stacked Preview Cards */}
      <div className="w-full flex flex-col gap-4 mt-8 md:hidden">
        <Link
          to={`/projects/${projectLeft?.slug || 'synthesis-exhibition'}`}
          className="w-full rounded-2xl bg-surface-container-lowest p-3 shadow-[0_20px_40px_-15px_rgba(8,8,8,0.06)] border border-outline-variant/30 overflow-hidden text-left"
        >
          <div className="relative h-56 w-full rounded-xl overflow-hidden bg-surface-container">
            <img
              className="w-full h-full object-cover"
              alt={projectLeft?.title || 'Featured project preview'}
              src={projectLeft?.cover_image || '/assets/synthesis-poster.png'}
            />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md">
              <span className="font-label-sm text-[10px] text-primary uppercase font-bold tracking-wider">
                Featured
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 pt-3">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {projectLeft?.title || 'Synthesis Exhibition'}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {projectLeft?.short_description || 'Kinetic Graphic Posters & Editorial'}
              </p>
            </div>
            <span className="w-9 h-9 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">north_east</span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
};
