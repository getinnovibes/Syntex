import React from 'react';
import { Link } from 'react-router-dom';
import { ToolItem, Project, HeroCard, HeroSpecimen } from '../../types';

interface HeroSectionProps {
  headline?: string;
  bio?: string;
  availabilityStatus?: string;
  toolkit?: ToolItem[];
  featuredProjects?: Project[];
  heroCardLeft?: HeroCard;
  heroCardRight?: HeroCard;
  heroSpecimen?: HeroSpecimen;
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
  heroCardLeft,
  heroCardRight,
  heroSpecimen,
}) => {
  const activeTools = toolkit && toolkit.length > 0 ? toolkit : DEFAULT_TOOLKIT;
  const projectLeft = featuredProjects[0];
  const projectRight = featuredProjects[1] || featuredProjects[0];

  // Left card values with fallback to featured project or default asset
  const cardLeftImage = heroCardLeft?.image || projectLeft?.cover_image || '/assets/aura-stationery.png';
  const cardLeftTitle = heroCardLeft?.title || projectLeft?.title || 'Aura Creative';
  const cardLeftSubtitle =
    heroCardLeft?.subtitle || (projectLeft ? `${projectLeft.category} • ${projectLeft.year}` : 'Identity System • 2024');
  const cardLeftLink =
    heroCardLeft?.link || (projectLeft ? `/projects/${projectLeft.slug}` : '/projects/aura-creative-system');

  // Right card values with fallback to featured project or default asset
  const cardRightImage = heroCardRight?.image || projectRight?.cover_image || '/assets/synthesis-poster.png';
  const cardRightTitle = heroCardRight?.title || projectRight?.title || 'Synthesis Exhibition';
  const cardRightSubtitle =
    heroCardRight?.subtitle || (projectRight ? `${projectRight.category} • ${projectRight.year}` : 'Print & Motion • 2024');
  const cardRightLink =
    heroCardRight?.link || (projectRight ? `/projects/${projectRight.slug}` : '/projects/synthesis-exhibition');

  // Center Live Specimen Anchor values
  const specimenBadge = heroSpecimen?.badge || 'Live Specimen';
  const specimenCounter = heroSpecimen?.counter || '01 / 05 Curated';
  const specimenTitle = heroSpecimen?.title || 'Typographic Systems & Spatial Balance';
  const specimenSubtitle =
    heroSpecimen?.subtitle || 'Harmonizing brand narrative with architectural layout structures.';

  const renderCardWrapper = (
    link: string,
    children: React.ReactNode,
    className: string
  ) => {
    if (link.startsWith('http')) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className={className}>
          {children}
        </a>
      );
    }
    return (
      <Link to={link} className={className}>
        {children}
      </Link>
    );
  };

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
        {/* Floating Card Left (Editable Photo 1) */}
        {renderCardWrapper(
          cardLeftLink,
          <>
            <div className="w-full h-44 rounded-xl overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt={cardLeftTitle}
                src={cardLeftImage}
              />
            </div>
            <div className="pt-space-sm flex items-center justify-between">
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[190px]">
                  {cardLeftTitle}
                </p>
                <p className="font-label-sm text-label-sm text-secondary truncate max-w-[190px]">
                  {cardLeftSubtitle}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </span>
            </div>
          </>,
          'absolute left-4 top-4 w-72 rounded-2xl bg-surface-container-lowest p-space-sm shadow-[0_24px_50px_-12px_rgba(8,8,8,0.12)] border border-outline-variant/40 transform -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 text-left block'
        )}

        {/* Center Minimal Specimen Anchor (Editable Text & Badge) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-12 w-80 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl p-space-md shadow-[0_30px_60px_-15px_rgba(108,59,255,0.12)] border border-outline-variant/40 z-20 text-left">
          <div className="flex items-center justify-between pb-space-xs">
            <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
              {specimenBadge}
            </span>
            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> {specimenCounter}
            </span>
          </div>
          <p className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight mt-1">
            {specimenTitle}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
            {specimenSubtitle}
          </p>
          <div className="mt-space-md pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-secondary border-t border-outline-variant/20">
            <span>01 / 05 Curated</span>
            <a href="#portfolio-section" className="text-primary font-medium hover:underline">
              View Portfolio →
            </a>
          </div>
        </div>

        {/* Floating Card Right (Editable Photo 2) */}
        {renderCardWrapper(
          cardRightLink,
          <>
            <div className="w-full h-44 rounded-xl overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt={cardRightTitle}
                src={cardRightImage}
              />
            </div>
            <div className="pt-space-sm flex items-center justify-between">
              <div>
                <p className="font-headline-sm text-headline-sm text-on-surface truncate max-w-[190px]">
                  {cardRightTitle}
                </p>
                <p className="font-label-sm text-label-sm text-secondary truncate max-w-[190px]">
                  {cardRightSubtitle}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[16px]">north_east</span>
              </span>
            </div>
          </>,
          'absolute right-4 top-2 w-72 rounded-2xl bg-surface-container-lowest p-space-sm shadow-[0_24px_50px_-12px_rgba(8,8,8,0.12)] border border-outline-variant/40 transform rotate-4 hover:rotate-0 hover:scale-105 transition-all duration-500 z-10 text-left block'
        )}
      </div>

      {/* Mobile Stacked Preview Cards (Displays BOTH Photo 1 and Photo 2 + Specimen Badge) */}
      <div className="w-full flex flex-col gap-4 mt-8 md:hidden text-left">
        {/* Mobile Specimen Header Anchor */}
        <div className="w-full rounded-2xl bg-surface-container-lowest p-4 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between pb-1.5">
            <span className="font-label-sm text-[11px] text-primary font-bold uppercase tracking-wider">
              {specimenBadge}
            </span>
            <span className="font-label-sm text-[11px] text-secondary">
              {specimenCounter}
            </span>
          </div>
          <h3 className="font-headline-md text-base font-semibold text-on-surface">
            {specimenTitle}
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant mt-1">
            {specimenSubtitle}
          </p>
        </div>

        {/* Mobile Card Left (Photo 1) */}
        {renderCardWrapper(
          cardLeftLink,
          <>
            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt={cardLeftTitle}
                src={cardLeftImage}
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md">
                <span className="font-label-sm text-[10px] text-primary uppercase font-bold tracking-wider">
                  Showcase 01
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 pt-3">
              <div>
                <h3 className="font-headline-sm text-base font-semibold text-on-surface">
                  {cardLeftTitle}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {cardLeftSubtitle}
                </p>
              </div>
              <span className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </span>
            </div>
          </>,
          'w-full rounded-2xl bg-surface-container-lowest p-3 shadow-[0_16px_32px_-12px_rgba(8,8,8,0.06)] border border-outline-variant/30 overflow-hidden text-left block'
        )}

        {/* Mobile Card Right (Photo 2) */}
        {renderCardWrapper(
          cardRightLink,
          <>
            <div className="relative h-52 w-full rounded-xl overflow-hidden bg-surface-container">
              <img
                className="w-full h-full object-cover"
                alt={cardRightTitle}
                src={cardRightImage}
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md">
                <span className="font-label-sm text-[10px] text-primary uppercase font-bold tracking-wider">
                  Showcase 02
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 pt-3">
              <div>
                <h3 className="font-headline-sm text-base font-semibold text-on-surface">
                  {cardRightTitle}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {cardRightSubtitle}
                </p>
              </div>
              <span className="w-8 h-8 rounded-full bg-secondary-container/50 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">north_east</span>
              </span>
            </div>
          </>,
          'w-full rounded-2xl bg-surface-container-lowest p-3 shadow-[0_16px_32px_-12px_rgba(8,8,8,0.06)] border border-outline-variant/30 overflow-hidden text-left block'
        )}
      </div>
    </section>
  );
};
