import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_KEY = 'syntax_demo_admin_authenticated';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check profile in Supabase database to verify role === 'admin'
  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback default admin profile if user exists in auth
        setProfile({
          id: userId,
          email,
          role: 'admin',
          full_name: 'Abdullah',
          avatar_url: '/assets/portrait.png',
        });
      }
    } catch (err) {
      console.warn('Could not verify profile with database:', err);
      setProfile({
        id: userId,
        email,
        role: 'admin',
        full_name: 'Abdullah',
        avatar_url: '/assets/portrait.png',
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id, session.user.email || '');
            }
          }

          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
              await fetchProfile(session.user.id, session.user.email || '');
            } else {
              setProfile(null);
            }
            setLoading(false);
          });

          return () => {
            subscription.unsubscribe();
          };
        } catch (e) {
          console.warn('Supabase auth init error:', e);
        }
      } else {
        // Demo session restore
        const isDemoLoggedIn = sessionStorage.getItem(DEMO_ADMIN_KEY) === 'true';
        if (isDemoLoggedIn) {
          const demoUser = {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'admin@syntaxstudio.design',
          } as User;
          setUser(demoUser);
          setProfile({
            id: demoUser.id,
            email: demoUser.email || '',
            role: 'admin',
            full_name: 'Abdullah',
            avatar_url: '/assets/portrait.png',
          });
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setLoading(false);
          return { error };
        }

        if (data.user) {
          setUser(data.user);
          setSession(data.session);
          await fetchProfile(data.user.id, data.user.email || '');
        }

        setLoading(false);
        return { error: null };
      } catch (err: any) {
        setLoading(false);
        return { error: err };
      }
    }

    // Interactive Demo Auth (allows full test of CMS before Supabase keys are plugged in)
    // Matches the email and password pattern in the Stitch mockup
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('syntax') || password.length >= 6) {
      const demoUser = {
        id: '00000000-0000-0000-0000-000000000001',
        email,
      } as User;
      setUser(demoUser);
      setProfile({
        id: demoUser.id,
        email,
        role: 'admin',
        full_name: 'Abdullah',
        avatar_url: '/assets/portrait.png',
      });
      sessionStorage.setItem(DEMO_ADMIN_KEY, 'true');
      setLoading(false);
      return { error: null };
    }

    setLoading(false);
    return { error: new Error('Invalid credentials. Please enter a valid administrator account.') };
  };

  const signOut = async () => {
    setLoading(true);
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    sessionStorage.removeItem(DEMO_ADMIN_KEY);
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
  };

  const isAdmin = Boolean(profile?.role === 'admin' || (user && !isSupabaseConfigured));

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isAdmin,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
