import React from 'react';
import { SiteSettings } from '../../types';

interface ServicesSectionProps {
  services?: SiteSettings['services_list'];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const defaultServices = [
    {
      id: '1',
      number: '01 / Foundation',
      title: 'Brand Identity',
      description:
        'Complete visual identity systems that create a consistent and memorable brand presence across physical and digital mediums.',
      tags: 'Logos • Typography • Styleguides',
      icon: 'corporate_fare',
    },
    {
      id: '2',
      number: '02 / Engagement',
      title: 'Social Media Poster Design',
      description:
        'Eye-catching social media visuals designed to communicate clearly, command scroll attention, and engage modern audiences.',
      tags: 'Instagram • Events • Carousel Sets',
      icon: 'art_track',
    },
    {
      id: '3',
      number: '03 / Promotion',
      title: 'Banner Design',
      description:
        'Professional digital and promotional banners designed for marketing campaigns, high-traffic websites and social platforms.',
      tags: 'Web Hero • Google Ads • Billboard Kits',
      icon: 'ad_units',
    },
    {
      id: '4',
      number: '04 / Conversion',
      title: 'Thumbnail Design',
      description:
        'High-impact thumbnails designed to improve attention, click appeal, and audience retention for creators and media platforms.',
      tags: 'YouTube • Podcasts • Stream Covers',
      icon: 'play_circle',
    },
  ];

  const items = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="w-full bg-surface-container-low py-16 md:py-space-3xl px-6 md:px-margin-lg scroll-mt-20" id="services-section">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-space-2xl">
          <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container/60 mb-space-sm border border-outline-variant/30">
            <span className="font-label-sm text-label-sm text-primary font-semibold uppercase tracking-wider">
              Expertise • Specialized Delivery
            </span>
          </div>
          <h2 className="font-headline-xl text-3xl md:text-headline-xl text-on-surface font-semibold tracking-tight">
            Purpose-Built Design Solutions
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Disciplined aesthetic standards engineered to increase engagement and elevate market valuation.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-space-lg">
          {items.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-surface-container-lowest p-6 md:p-space-xl rounded-3xl shadow-[0_16px_36px_-10px_rgba(8,8,8,0.04)] border border-outline-variant/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-primary flex items-center justify-center mb-space-lg group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[30px]">
                    {service.icon || 'star'}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                  {service.number}
                </span>
                <h3 className="font-headline-md text-xl md:text-headline-md text-on-surface font-semibold mt-1">
                  {service.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="mt-8 pt-space-md border-t border-outline-variant/20 flex items-center gap-space-xs font-label-sm text-label-sm text-primary font-semibold">
                <span>{service.tags}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
