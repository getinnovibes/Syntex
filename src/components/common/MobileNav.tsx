import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const scrollTo = (id?: string) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe pointer-events-none md:hidden">
      <div className="mx-auto max-w-md px-3 pb-2">
        <div className="pointer-events-auto h-16 bg-surface-container-lowest/90 backdrop-blur-xl rounded-full shadow-[0_12px_32px_-8px_rgba(8,8,8,0.12)] border border-outline-variant/40 flex items-center justify-around px-2">
          {/* Home */}
          <button
            onClick={() => scrollTo()}
            aria-label="Home"
            className="flex flex-col items-center justify-center w-11 h-11 rounded-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span className="font-label-sm text-[9px] tracking-tight leading-none mt-0.5">Home</span>
          </button>

          {/* About */}
          <button
            onClick={() => scrollTo('about')}
            aria-label="About"
            className="flex flex-col items-center justify-center w-11 h-11 rounded-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">badge</span>
            <span className="font-label-sm text-[9px] tracking-tight leading-none mt-0.5">About</span>
          </button>

          {/* Services */}
          <button
            onClick={() => scrollTo('services-section')}
            aria-label="Services"
            className="flex flex-col items-center justify-center w-11 h-11 rounded-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">layers</span>
            <span className="font-label-sm text-[9px] tracking-tight leading-none mt-0.5">Services</span>
          </button>

          {/* Portfolio */}
          <button
            onClick={() => scrollTo('portfolio-section')}
            aria-label="Portfolio"
            className="flex flex-col items-center justify-center w-11 h-11 rounded-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">folder_special</span>
            <span className="font-label-sm text-[9px] tracking-tight leading-none mt-0.5">Portfolio</span>
          </button>

          {/* Contact */}
          <button
            onClick={() => scrollTo('contact-section')}
            aria-label="Contact"
            className="flex flex-col items-center justify-center w-11 h-11 rounded-full text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">mail</span>
            <span className="font-label-sm text-[9px] tracking-tight leading-none mt-0.5">Contact</span>
          </button>

          {/* CMS */}
          <Link
            to="/admin"
            aria-label="CMS"
            className={`flex flex-col items-center justify-center w-11 h-11 rounded-full transition-colors ${
              isAdmin
                ? 'bg-secondary-container text-primary font-medium'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dataset</span>
            <span className="font-label-sm text-[9px] tracking-tight leading-none mt-0.5">CMS</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
