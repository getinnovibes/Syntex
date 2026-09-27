import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  inquiryCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ inquiryCount = 0 }) => {
  const location = useLocation();
  const { signOut, profile } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: 'grid_view' },
    { label: 'Portfolio Works', path: '/admin/projects', icon: 'folder_special' },
    {
      label: 'Client Inquiries',
      path: '/admin/inquiries',
      icon: 'mail',
      badge: inquiryCount > 0 ? inquiryCount : undefined,
    },
    { label: 'Site Settings & Bio', path: '/admin/settings', icon: 'tune' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[250px] bg-surface-container-lowest border-r border-outline-variant/40 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)] hidden lg:flex">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex flex-col">
            <Link to="/" className="font-headline-sm text-headline-sm text-on-surface tracking-tight uppercase font-bold hover:text-primary transition-colors">
              Syntax
            </Link>
            <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase">
              Admin Panel
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 py-5">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-secondary-container text-primary font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-body-sm text-body-sm">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-primary-container text-white font-label-sm text-[11px] font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Admin User Footer Strip */}
      <div className="p-4 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Admin Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-outline-variant/40"
            src={profile?.avatar_url || '/assets/portrait.png'}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-body-sm text-body-sm font-medium text-on-surface leading-tight truncate">
              {profile?.full_name || 'Abdullah'}
            </span>
            <span className="font-label-sm text-label-sm text-outline capitalize">
              {profile?.role || 'Administrator'}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          title="Sign Out"
          className="text-outline hover:text-error transition-colors p-1.5 rounded-full hover:bg-surface-container active:scale-95"
          aria-label="Logout"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
        </button>
      </div>
    </aside>
  );
};
