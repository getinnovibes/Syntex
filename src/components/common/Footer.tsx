import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  designerName?: string;
  designerTitle?: string;
  socialLinks?: { platform: string; url: string }[];
}

export const Footer: React.FC<FooterProps> = ({
  designerName = 'Abdullah',
  designerTitle = 'Graphics Designer',
  socialLinks = [
    { platform: 'Behance', url: 'https://www.behance.net/happycrust' },
    { platform: 'Dribbble', url: 'https://dribbble.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'Facebook', url: 'https://facebook.com' },
    { platform: 'X / Twitter', url: 'https://x.com' },
  ],
}) => {
  return (
    <footer className="w-full bg-surface-container-low py-space-2xl px-6 md:px-margin-lg border-t border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-space-xl">
        {/* Top Row: Designation & Social Links */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Syntax
              </span>
              <span className="text-secondary font-label-sm text-label-sm">|</span>
              <span className="font-headline-sm text-headline-sm text-primary font-medium">
                {designerName} — {designerTitle}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-xl">
              Editorial systems, modern brand identities, and high-impact visual direction.
            </p>
          </div>

          {/* Social Links Suite */}
          <div className="flex flex-wrap items-center gap-space-md">
            {socialLinks.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>{item.platform}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Row: Navigation Indices & Colophon Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-lg border-t border-outline-variant/20">
          <nav className="flex flex-wrap items-center gap-space-lg">
            <Link to="/" className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors">
              Home
            </Link>
            <a href="#about" className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors">
              About
            </a>
            <a href="#services-section" className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors">
              Services
            </a>
            <a href="#portfolio-section" className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors">
              Portfolio
            </a>
            <a href="#contact-section" className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors">
              Contact
            </a>
            <Link to="/admin" className="font-label-sm text-label-sm text-primary font-medium hover:underline">
              CMS Login
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-secondary font-label-sm text-label-sm">
            <span>© 2026 {designerName}. All rights reserved.</span>
            <span className="text-outline-variant">•</span>
            <span>v2.4 Editorial</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
