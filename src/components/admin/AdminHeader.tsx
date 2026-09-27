import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader: React.FC = () => {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard';
    if (location.pathname.startsWith('/admin/projects/new')) return 'New Project';
    if (location.pathname.includes('/edit')) return 'Edit Project';
    if (location.pathname.startsWith('/admin/projects')) return 'Portfolio Works';
    if (location.pathname.startsWith('/admin/inquiries')) return 'Client Inquiries';
    if (location.pathname.startsWith('/admin/settings')) return 'Site Settings';
    return 'Admin';
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 left-0 lg:left-[250px] right-0 h-16 bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/30 z-40 px-6 lg:px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        {/* Left: Mobile hamburger + breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <div className="flex items-center gap-2 font-label-md text-label-md text-outline">
            <Link to="/admin" className="hover:text-on-surface transition-colors">
              Syntax
            </Link>
            <span>/</span>
            <span className="text-primary font-medium">{getPageTitle()}</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-outline-variant/60" />

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 font-label-sm text-label-sm text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Website</span>
          </div>
        </div>

        {/* Right: Quick actions + View Public Site + User avatar */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest hover:bg-secondary-container hover:border-primary/40 text-on-surface font-label-sm text-label-sm transition-all shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <span className="font-medium hidden sm:inline">View Public Site</span>
            <span className="font-medium sm:hidden">Site</span>
            <span className="material-symbols-outlined text-[14px]">north_east</span>
          </Link>

          <div className="h-6 w-px bg-outline-variant/60 hidden sm:block" />

          <div className="flex items-center gap-2 pl-1">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              src={profile?.avatar_url || '/assets/portrait.png'}
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu for Admin */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 z-50 bg-surface-container-lowest/95 backdrop-blur-2xl border-b border-outline-variant/40 p-6 shadow-2xl">
          <nav className="flex flex-col gap-2 font-label-md text-label-md">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-secondary-container text-primary font-medium"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
              <span>Dashboard Overview</span>
            </Link>
            <Link
              to="/admin/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-surface-container-low text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">folder_special</span>
              <span>Manage Portfolio Works</span>
            </Link>
            <Link
              to="/admin/inquiries"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-surface-container-low text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
              <span>Client Inquiries</span>
            </Link>
            <Link
              to="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-surface-container-low text-on-surface"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
              <span>Site Settings & Profile</span>
            </Link>
            <div className="h-px bg-outline-variant/40 my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                signOut();
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-error hover:bg-error-container/20 w-full text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Logout of CMS</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};
