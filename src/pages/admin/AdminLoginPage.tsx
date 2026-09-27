import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@syntaxstudio.design');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Invalid administrator credentials. Access denied.');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-on-surface antialiased flex flex-col justify-between relative overflow-hidden">
      {/* Ambient Violet Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary-fixed/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[30rem] h-[30rem] rounded-full bg-secondary-container/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-primary-fixed-dim/25 blur-3xl pointer-events-none" />

      {/* Top minimal bar */}
      <header className="w-full px-6 md:px-margin-lg py-6 flex items-center justify-between z-10">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight flex items-center gap-1.5">
          <span>Syntax</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block" />
        </Link>
        <Link
          to="/"
          className="font-label-sm text-label-sm text-secondary hover:text-on-surface transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Portfolio</span>
        </Link>
      </header>

      {/* Login Card Container */}
      <main className="relative z-10 w-full max-w-md mx-auto my-8 px-6">
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(8,8,8,0.08),0_0_1px_rgba(8,8,8,0.1)] border border-outline-variant/40 transition-all duration-300">
          {/* Header Row: Brand Identity & Version Pill */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                Syntax
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container inline-block" />
            </div>
            <div className="flex items-center gap-1.5 px-space-sm py-1 bg-surface-container-low rounded-full border border-outline-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                CMS v2.4
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-headline-lg text-2xl md:text-headline-lg font-medium text-on-surface tracking-tight mb-2">
              Admin Login
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sign in to manage portfolio, services, and incoming project inquiries.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-2 animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Field 1: User Email */}
            <div className="flex flex-col gap-2">
              <label
                className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider flex items-center justify-between"
                htmlFor="admin-email"
              >
                <span>User Email</span>
                <span className="text-outline lowercase font-mono">required</span>
              </label>
              <div className="relative flex items-center">
                <input
                  autoComplete="email"
                  className="w-full bg-surface-container-lowest px-4 py-3.5 pr-10 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline border border-outline-variant/40 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  id="admin-email"
                  placeholder="admin@syntaxstudio.design"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="material-symbols-outlined absolute right-4 text-outline pointer-events-none text-[20px]">
                  alternate_email
                </span>
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider"
                  htmlFor="admin-password"
                >
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  autoComplete="current-password"
                  className="w-full bg-surface-container-lowest px-4 py-3.5 pr-12 rounded-xl font-body-md text-body-md text-on-surface placeholder:text-outline border border-outline-variant/40 shadow-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  id="admin-password"
                  placeholder="Enter administrator password"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 rounded-full text-outline hover:text-on-surface transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Session preferences */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-primary rounded w-4 h-4 cursor-pointer"
                />
                <span className="font-body-sm text-body-sm text-secondary">
                  Keep active studio session
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm shadow-[0_12px_28px_-6px_rgba(108,59,255,0.35)] hover:shadow-[0_16px_32px_-6px_rgba(108,59,255,0.45)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
                type="submit"
              >
                <span>{loading ? 'Authenticating...' : 'Login'}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform duration-150">
                  {loading ? 'hourglass_top' : 'arrow_forward'}
                </span>
              </button>
            </div>
          </form>

          {/* Studio Telemetry Footer */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant">
            <span className="font-label-sm text-label-sm text-secondary">Node: Zurich-01</span>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
                Encrypted Studio Session
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center gap-2 text-on-surface-variant">
          <span className="font-label-sm text-label-sm text-outline">
            Abdullah Studio Group • Zurich • Milan
          </span>
        </div>
      </main>

      {/* Footer Strip */}
      <footer className="w-full py-6 text-center font-label-sm text-label-sm text-outline z-10">
        © 2026 Syntax Studio. Authorized Studio Personnel Only.
      </footer>
    </div>
  );
};
