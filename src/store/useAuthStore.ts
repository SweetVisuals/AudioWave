import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { registerUser, loginUser } from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  wallet: string;
  profilePicture?: string;
  bannerImage?: string;
  followers: number;
  following?: number;
  bio?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loginDemo: () => Promise<void>;
  registerNewUser: (username: string, walletAddress: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      loginDemo: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const demoUser: User = {
            id: 'demo-user',
            username: 'Demo User',
            wallet: '0xdemo' + Math.random().toString(36).substring(2, 15),
            profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=demo`,
            bannerImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80',
            followers: 0,
            following: 0,
            bio: 'Demo Account',
            createdAt: new Date().toISOString(),
          };

          set({ user: demoUser });
          toast.success('Welcome to the demo account!');
        } catch (error: any) {
          console.error('Demo login error:', error);
          set({ error: error.message });
          toast.error('Failed to login to demo account');
        } finally {
          set({ isLoading: false });
        }
      },

      registerNewUser: async (username: string, walletAddress: string) => {
        try {
          set({ isLoading: true, error: null });
          const userData = await registerUser({ username, walletAddress });
          // Transform the API response to match our User interface
          const user: User = {
            id: userData.id,
            username: userData.username,
            wallet: userData.walletAddress,
            profilePicture: userData.profilePicture,
            followers: userData.followers,
            createdAt: userData.createdAt
          };
          set({ user });
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ error: error.message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('pendingWallet');
        set({ user: null });
        toast.success('Logged out successfully');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);