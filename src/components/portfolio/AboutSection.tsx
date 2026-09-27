import React from 'react';
import { SiteSettings } from '../../types';

interface AboutSectionProps {
  settings?: SiteSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  const designerName = settings?.designer_name || 'Abdullah';
  const designerTitle = settings?.designer_title || 'Graphics Designer & Visual Director';
  const bio =
    settings?.bio ||
    'I’m Abdullah, a graphics designer focused on creating meaningful visual identities, digital experiences and engaging creative content. I combine clean design, strong visual communication and modern aesthetics to help brands present themselves with confidence.';
  const yearsExp = settings?.years_experience || '5+';
  const completedWorks = settings?.completed_works || '120+';
  const satisfactionRate = settings?.satisfaction_rate || '99%';
  const location = settings?.location || 'Dhaka / Remote';

  return (
    <section className="w-full bg-surface-container-low py-16 md:py-space-3xl px-6 md:px-margin-lg scroll-mt-20" id="about">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-space-2xl items-center">
        {/* Left Column: Biography & Numerical Milestones */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-space-lg">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm text-primary font-bold tracking-widest uppercase">
              Colophon & Persona
            </span>
            <span className="w-12 h-[1px] bg-outline-variant" />
          </div>

          <div>
            <h2 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface font-semibold tracking-tight">
              {designerName}
            </h2>
            <p className="font-label-md text-label-md text-primary-container font-medium mt-1 uppercase tracking-wide">
              {designerTitle}
            </p>
          </div>

          <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {bio}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-space-md pt-2 md:pt-space-md">
            <div className="bg-surface-container-lowest p-4 md:p-space-md rounded-2xl shadow-[0_4px_16px_rgba(8,8,8,0.03)] border border-outline-variant/30 flex flex-col">
              <span className="font-display-hero text-2xl md:text-headline-xl font-bold text-on-surface tracking-tight">
                {yearsExp}
              </span>
              <span className="font-label-sm text-[11px] md:text-label-sm text-secondary mt-1">
                Years Experience
              </span>
            </div>

            <div className="bg-surface-container-lowest p-4 md:p-space-md rounded-2xl shadow-[0_4px_16px_rgba(8,8,8,0.03)] border border-outline-variant/30 flex flex-col">
              <span className="font-display-hero text-2xl md:text-headline-xl font-bold text-on-surface tracking-tight">
                {completedWorks}
              </span>
              <span className="font-label-sm text-[11px] md:text-label-sm text-secondary mt-1">
                Completed Works
              </span>
            </div>

            <div className="bg-surface-container-lowest p-4 md:p-space-md rounded-2xl shadow-[0_4px_16px_rgba(8,8,8,0.03)] border border-outline-variant/30 flex flex-col">
              <span className="font-display-hero text-2xl md:text-headline-xl font-bold text-on-surface tracking-tight">
                {satisfactionRate}
              </span>
              <span className="font-label-sm text-[11px] md:text-label-sm text-secondary mt-1">
                Satisfaction Rate
              </span>
            </div>
          </div>

          {/* Capability Tickers */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              Art Direction
            </span>
            <span className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              Editorial Typesetting
            </span>
            <span className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              Packaging Systems
            </span>
            <span className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              Digital Campaign Kits
            </span>
            <span className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
              3D Spatial Craft
            </span>
          </div>
        </div>

        {/* Right Column: 3D Studio Portrait Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Ambient Glow Rim */}
            <div className="absolute inset-0 bg-primary-container/20 rounded-3xl blur-2xl transform scale-95 -z-10" />
            <div className="bg-surface-container-lowest p-4 md:p-space-md rounded-3xl shadow-[0_24px_48px_-10px_rgba(8,8,8,0.08)] border border-outline-variant/40 flex flex-col">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-container">
                <img
                  alt={designerName ? `${designerName} - Creative Studio Portrait` : 'Creative Studio Portrait'}
                  className="w-full h-full object-cover"
                  src={settings?.avatar_url || '/assets/portrait.png'}
                />
                <div className="absolute bottom-3 right-3 bg-surface-container-lowest/85 backdrop-blur-md px-space-sm py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  <span className="font-label-sm text-[11px] md:text-label-sm text-on-surface font-medium">
                    HQ • {location}
                  </span>
                </div>
              </div>
              <div className="mt-space-md flex items-center justify-between">
                <div>
                  <p className="font-headline-sm text-headline-sm text-on-surface">Creative Studio</p>
                  <p className="font-label-sm text-label-sm text-secondary">Portrait • Visual Identity Index</p>
                </div>
                <span className="font-label-md text-label-md text-primary font-bold tracking-tight">
                  REF: ABD-26
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
