import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify user exists in database, not just in local session
    const verifyUser = async () => {
      try {
        const session = await authService.getSession();
        
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Verify user exists in database by checking profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          // User doesn't exist in database, clear session
          console.log('[Auth] User not found in database, clearing session');
          await authService.signOut();
          setUser(null);
        } else {
          setUser(session.user);
        }
      } catch (error) {
        console.error('[Auth] Error verifying user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      // Verify user exists in database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        console.log('[Auth] User not found in database, clearing session');
        await authService.signOut();
        setUser(null);
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
