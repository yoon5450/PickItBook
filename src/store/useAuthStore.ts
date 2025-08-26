import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware"

type Status = 'idle' | 'loading' | 'authed' | 'guest';
type Social = 'google' | 'github'


type AuthStore = {
  user: User | null;
  session: Session | null;
  authStatus: Status;
  lastProvider: Social | null;
  setAuth: ({ user, session }: { user: User | null, session: Session | null }) => void;
  setAuthStatus: (status: Status) => void;
  resetAuth: () => void;
  setLastProvider: (provider: Social) => void;
  clearLastProvider: () => void;
}


export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      authStatus: 'idle',
      lastProvider: null,
      setAuth: ({ user, session }) => set({ user, session, authStatus: user ? 'authed' : 'guest' }),
      setAuthStatus: (status) => set({ authStatus: status }),
      resetAuth: () => set({ user: null, session: null, authStatus: 'guest' }),
      setLastProvider: (provider) => set({ lastProvider: provider }),
      clearLastProvider: () => set({ lastProvider: null }),
    }),
    {
      name: 'provider',
      storage: createJSONStorage(() => localStorage),
      // provider 필드만 저장
      partialize: (state) => ({ lastProvider: state.lastProvider }),
    }
  )
);

