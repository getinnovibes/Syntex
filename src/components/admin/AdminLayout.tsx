import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

export const AdminLayout: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <span className="font-label-md text-label-md text-secondary">
          Authenticating secure studio session...
        </span>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated but unauthorized role
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-surface-container-low flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[32px]">block</span>
        </div>
        <h1 className="font-headline-md text-2xl font-bold text-on-surface">Access Denied</h1>
        <p className="font-body-md text-body-md text-secondary max-w-sm mt-2">
          Your account is not authorized to access the Syntax CMS admin panel.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2.5 rounded-full bg-primary-container text-white font-label-md text-label-md"
        >
          Return to Public Site
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface antialiased flex flex-col">
      <AdminSidebar />
      <div className="lg:pl-[250px] flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
