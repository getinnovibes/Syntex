import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'services' | 'portfolio' | 'contact'>('home');
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';

  // Smooth scroll handler for anchor sections
  const navigateToSection = (sectionId?: string) => {
    setMobileMenuOpen(false);

    if (!sectionId || sectionId === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setActiveSection('home');
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Track active section on scroll when on homepage
  useEffect(() => {
    if (!isHome) return;

    const handleScroll = () => {
      const sections: { id: string; name: 'home' | 'about' | 'services' | 'portfolio' | 'contact' }[] = [
        { id: 'contact-section', name: 'contact' },
        { id: 'portfolio-section', name: 'portfolio' },
        { id: 'services-section', name: 'services' },
        { id: 'about', name: 'about' },
      ];

      const scrollPos = window.scrollY + 200;

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sec.name);
          return;
        }
      }

      if (window.scrollY < 300) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-outline-variant/30 transition-all duration-300">
      <div className="h-20 max-w-[1440px] mx-auto px-6 md:px-margin-lg flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => navigateToSection('home')}
            className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight flex items-center gap-1.5 group cursor-pointer text-left"
          >
            <span>Syntax</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container group-hover:scale-125 transition-transform" />
          </button>
        </div>

        {/* Desktop Floating Navigation Capsule */}
        <nav className="hidden md:flex items-center bg-surface-container-lowest/90 backdrop-blur-xl px-1.5 py-1.5 rounded-full shadow-[0_20px_40px_-15px_rgba(8,8,8,0.05),0_0_1px_rgba(8,8,8,0.08)] border border-outline-variant/40">
          <button
            onClick={() => navigateToSection('home')}
            className={`px-space-md py-space-xs transition-all duration-200 rounded-full font-label-md text-label-md cursor-pointer ${
              isHome && activeSection === 'home'
                ? 'bg-secondary-container text-primary font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => navigateToSection('about')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer ${
              isHome && activeSection === 'about'
                ? 'bg-secondary-container text-primary font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            About
          </button>

          <button
            onClick={() => navigateToSection('services-section')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer ${
              isHome && activeSection === 'services'
                ? 'bg-secondary-container text-primary font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Services
          </button>

          <button
            onClick={() => navigateToSection('portfolio-section')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer ${
              isHome && activeSection === 'portfolio'
                ? 'bg-secondary-container text-primary font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Portfolio
          </button>

          <button
            onClick={() => navigateToSection('contact-section')}
            className={`px-space-md py-space-xs rounded-full font-label-md text-label-md transition-all duration-200 cursor-pointer ${
              isHome && activeSection === 'contact'
                ? 'bg-secondary-container text-primary font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateToSection('contact-section')}
            className="inline-flex items-center justify-center px-5 md:px-space-lg py-2.5 bg-primary-container text-on-primary font-headline-sm text-headline-sm rounded-full shadow-[0_12px_28px_-6px_rgba(108,59,255,0.28)] hover:bg-primary transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Hire Me
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/40"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest/98 backdrop-blur-2xl border-b border-outline-variant/40 px-6 py-5 shadow-2xl transition-all">
          <div className="flex flex-col gap-2 font-label-md text-label-md">
            <button
              onClick={() => navigateToSection('home')}
              className="px-4 py-2.5 rounded-xl text-left hover:bg-surface-container-low text-on-surface"
            >
              Home
            </button>
            <button
              onClick={() => navigateToSection('about')}
              className="px-4 py-2.5 rounded-xl text-left hover:bg-surface-container-low text-on-surface"
            >
              About
            </button>
            <button
              onClick={() => navigateToSection('services-section')}
              className="px-4 py-2.5 rounded-xl text-left hover:bg-surface-container-low text-on-surface"
            >
              Services
            </button>
            <button
              onClick={() => navigateToSection('portfolio-section')}
              className="px-4 py-2.5 rounded-xl text-left hover:bg-surface-container-low text-on-surface"
            >
              Portfolio
            </button>
            <button
              onClick={() => navigateToSection('contact-section')}
              className="px-4 py-2.5 rounded-xl text-left hover:bg-surface-container-low text-on-surface"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
