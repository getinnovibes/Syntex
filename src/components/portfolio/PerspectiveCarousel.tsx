import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../../types';

interface PerspectiveCarouselProps {
  projects: Project[];
}

export const PerspectiveCarousel: React.FC<PerspectiveCarouselProps> = ({ projects }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Synthesis Exhibition default
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const total = projects.length || 1;

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [total]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const threshold = 40;
    if (touchEndX.current < touchStartX.current - threshold) {
      goNext();
    } else if (touchEndX.current > touchStartX.current + threshold) {
      goPrev();
    }
  };

  // Mathematical 3D Transform profiles from Stitch specification
  const getCardStyle = (index: number) => {
    let diff = (index - activeIndex) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    if (diff === 0) {
      return {
        transform: 'translateX(0) scale(1.06) rotateY(0deg) translateZ(0px)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto' as const,
        boxShadow: '0 28px 60px -12px rgba(108, 59, 255, 0.28), 0 0 1px rgba(0,0,0,0.1)',
        filter: 'blur(0px)',
      };
    } else if (diff === -1) {
      return {
        transform: 'translateX(-65%) scale(0.86) rotateY(26deg) translateZ(-60px)',
        opacity: 0.78,
        zIndex: 20,
        pointerEvents: 'auto' as const,
        boxShadow: '0 20px 40px -15px rgba(8, 8, 8, 0.08)',
        filter: 'blur(0.5px)',
      };
    } else if (diff === 1) {
      return {
        transform: 'translateX(65%) scale(0.86) rotateY(-26deg) translateZ(-60px)',
        opacity: 0.78,
        zIndex: 20,
        pointerEvents: 'auto' as const,
        boxShadow: '0 20px 40px -15px rgba(8, 8, 8, 0.08)',
        filter: 'blur(0.5px)',
      };
    } else if (diff === -2 || diff === total - 2) {
      return {
        transform: 'translateX(-110%) scale(0.72) rotateY(38deg) translateZ(-140px)',
        opacity: 0.35,
        zIndex: 10,
        pointerEvents: 'auto' as const,
        boxShadow: '0 10px 25px -10px rgba(8, 8, 8, 0.05)',
        filter: 'blur(1.5px)',
      };
    } else if (diff === 2 || diff === -(total - 2)) {
      return {
        transform: 'translateX(110%) scale(0.72) rotateY(-38deg) translateZ(-140px)',
        opacity: 0.35,
        zIndex: 10,
        pointerEvents: 'auto' as const,
        boxShadow: '0 10px 25px -10px rgba(8, 8, 8, 0.05)',
        filter: 'blur(1.5px)',
      };
    } else {
      return {
        transform: 'translateX(0) scale(0.5) translateZ(-200px)',
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none' as const,
        filter: 'blur(4px)',
      };
    }
  };

  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const scrollMobile = (dir: 'left' | 'right') => {
    if (mobileScrollRef.current) {
      const scrollAmount = dir === 'left' ? -296 : 296;
      mobileScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      className="w-full py-12 md:py-space-3xl px-6 md:px-margin-lg overflow-hidden select-none scroll-mt-20"
      id="portfolio-section"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-space-2xl gap-space-md">
          <div>
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="font-label-sm text-label-sm text-primary font-bold tracking-widest uppercase">
                Portfolio • Curated Works
              </span>
              <span className="w-8 h-[1px] bg-outline-variant" />
            </div>
            <h2 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface font-semibold tracking-tight">
              Featured Works
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Curated design systems, digital posters, and visual narratives.
            </p>
          </div>

          {/* Header Link */}
          <div className="flex items-center gap-space-md">
            <a
              href="https://www.behance.net/happycrust"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary hover:text-on-surface font-semibold transition-colors"
            >
              <span>Behance Profile</span>
              <span className="material-symbols-outlined text-[16px]">launch</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP 3D PERSPECTIVE STAGE CONTAINER (Hidden on small mobile)           */}
        {/* ========================================================================= */}
        <div
          className="relative w-full py-space-lg hidden md:flex justify-center items-center overflow-visible"
          style={{ perspective: '1200px' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full max-w-[500px] h-[550px] flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {projects.map((project, idx) => {
              const cardStyle = getCardStyle(idx);
              const isCenter = idx === activeIndex;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isCenter) {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`absolute top-0 left-0 w-full rounded-3xl p-space-md bg-surface-container-lowest border border-white/80 transition-all cursor-pointer flex flex-col justify-between ${
                    isCenter ? 'ring-2 ring-primary-container/40' : ''
                  }`}
                  style={{
                    ...cardStyle,
                    transition:
                      'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease, box-shadow 0.6s ease, filter 0.6s ease',
                  }}
                >
                  <div>
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-container mb-space-md shadow-inner">
                      <img
                        className="w-full h-full object-cover"
                        alt={project.title}
                        src={project.cover_image}
                      />
                      <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-full shadow-sm">
                        <span className="font-label-sm text-label-sm text-primary font-semibold">
                          {project.category}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-0.5 rounded-full font-label-sm text-secondary">
                        {project.year || '2024'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold truncate">
                        {project.title}
                      </h3>
                      <span className="w-8 h-8 rounded-full bg-secondary-container/80 flex items-center justify-center text-primary shrink-0 ml-2">
                        <span className="material-symbols-outlined text-[18px]">
                          {project.category.includes('Brand')
                            ? 'verified'
                            : project.category.includes('Poster')
                            ? 'brush'
                            : 'ad_units'}
                        </span>
                      </span>
                    </div>

                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                      {project.short_description}
                    </p>
                  </div>

                  <div className="mt-space-lg pt-space-sm border-t border-surface-container flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-secondary truncate max-w-[200px]">
                      {project.tags?.[0] || 'Design Craft'} • {project.year}
                    </span>
                    <a
                      href="https://www.behance.net/happycrust"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-label-md text-label-md text-primary font-semibold hover:underline inline-flex items-center gap-1 shrink-0"
                    >
                      <span>Learn More</span>
                      <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Controls (Prev / Next & Dots) */}
        <div className="hidden md:flex mt-space-xl flex-col items-center gap-space-md">
          <div className="inline-flex items-center gap-space-md bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-[0_10px_30px_-5px_rgba(8,8,8,0.06),0_0_1px_rgba(0,0,0,0.1)] border border-outline-variant/30">
            {/* Prev Pill Button */}
            <button
              onClick={goPrev}
              aria-label="Previous Project"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0d0f14] text-white hover:bg-primary-container hover:shadow-[0_8px_20px_-4px_rgba(108,59,255,0.4)] transition-all duration-300 font-label-md text-label-md font-semibold cursor-pointer group active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
              <span>Prev</span>
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2 px-space-sm">
              {projects.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setActiveIndex(dotIdx)}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dotIdx === activeIndex
                      ? 'w-8 bg-primary-container'
                      : 'w-2 bg-secondary-fixed-dim hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            {/* Next Pill Button */}
            <button
              onClick={goNext}
              aria-label="Next Project"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0d0f14] text-white hover:bg-primary-container hover:shadow-[0_8px_20px_-4px_rgba(108,59,255,0.4)] transition-all duration-300 font-label-md text-label-md font-semibold cursor-pointer group active:scale-95"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-label-sm text-label-sm text-secondary tracking-wider uppercase">
              Click side cards or drag to navigate portfolio
            </span>
            <span className="hidden sm:inline text-outline-variant">•</span>
            <a
              href="https://www.behance.net/happycrust"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-label-md text-label-md text-primary font-semibold hover:underline"
            >
              <span>Learn more on Behance</span>
              <span className="material-symbols-outlined text-[16px]">launch</span>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE HORIZONTAL CAROUSEL STRIP (Matching Stitch Mobile Spec)            */}
        {/* ========================================================================= */}
        <div className="flex flex-col space-y-4 md:hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary">
              Swipe or tap arrows to view
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollMobile('left')}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface active:bg-secondary-container transition-colors"
                aria-label="Previous"
              >
                <span className="material-symbols-outlined text-[18px]">west</span>
              </button>
              <button
                onClick={() => scrollMobile('right')}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface active:bg-secondary-container transition-colors"
                aria-label="Next"
              >
                <span className="material-symbols-outlined text-[18px]">east</span>
              </button>
            </div>
          </div>

          <div
            ref={mobileScrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {projects.map((project) => (
              <div
                key={project.id}
                className="min-w-[280px] w-[280px] rounded-3xl bg-surface-container-lowest p-3 shadow-[0_12px_28px_-8px_rgba(8,8,8,0.06)] border border-outline-variant/30 flex flex-col space-y-3 shrink-0 snap-start"
              >
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-surface-container">
                  <img
                    className="w-full h-full object-cover"
                    alt={project.title}
                    src={project.cover_image}
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 font-label-sm text-[10px] font-semibold text-primary">
                    {project.category}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/80 font-label-sm text-[10px] text-secondary">
                    {project.year || '2024'}
                  </span>
                </div>
                <div className="flex flex-col px-1 pb-1">
                  <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">
                    {project.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                    {project.short_description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/20 mt-2">
                    <span className="font-label-sm text-[11px] text-secondary">
                      {project.tags?.[0] || 'Design'}
                    </span>
                    <a
                      href="https://www.behance.net/happycrust"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-label-sm text-label-sm text-primary font-medium flex items-center gap-0.5 hover:underline"
                    >
                      <span>Learn More</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
