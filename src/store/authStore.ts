import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hrlServices } from '@/lib/apiClient';

export interface HRLUser {
  email: string;
  credits: number;
  tier: string;
  is_premium: boolean;
  pmp_level: string;
  trial_status: 'active' | 'expired' | 'none';
  all_apps_access: boolean;
}

interface AuthState {
  token: string | null;
  user: HRLUser | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: HRLUser | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: true,
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('hrl_sso_token', token);
        } else {
          localStorage.removeItem('hrl_sso_token');
        }
      },
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
      checkAuth: async () => {
        const token = localStorage.getItem('hrl_sso_token');
        if (!token) {
          set({ loading: false, user: null, token: null });
          return;
        }

        set({ loading: true, token });
        try {
          // W docelowej wersji wyciągamy email z zdekodowanego JWT
          // Na potrzeby MVP/Testów używamy zapisanego maila lub mocka
          const email = localStorage.getItem('hrl_user_email') || 'contact@hardbanrecordslab.online';
          
          const response = await hrlServices.getProfile(email);
          if (response.data) {
            set({ user: response.data, loading: false });
          }
        } catch (error) {
          console.error('HRL Unified Auth Error:', error);
          set({ loading: false, user: null, token: null });
          localStorage.removeItem('hrl_sso_token');
        }
      },
      logout: () => {
        localStorage.removeItem('hrl_sso_token');
        localStorage.removeItem('hrl_user_email');
        set({ token: null, user: null });
        window.location.href = 'https://hardbanrecordslab.online'; // Powrót do głównego portalu
      },
    }),
    {
      name: 'hrl-unified-auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user 
      }),
    }
  )
);
