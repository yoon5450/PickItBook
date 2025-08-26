import supabase from "@/utils/supabase"
import { create } from "zustand"

type ProfileStore = {
  id: string | null,
  email: string | null,
  nickname: string | null,
  profile_image: string | null,
  created_at: string | null,
  fetchUser: (id: string) => Promise<void>
  profileStatus: 'idle' | 'loading' | 'ready' | 'error'
  resetProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set, _get, store) => (
  {
    id: null,
    email: null,
    nickname: null,
    profile_image: null,
    created_at: null,
    profileStatus: 'idle',
    fetchUser: async (userId) => {
      set({ profileStatus: 'loading' })

      const { data, error } = await supabase
        .from('user_profile')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      const { id, email, nickname, profile_image, created_at } = data

      if (error || !data) return set({ profileStatus: 'error' })
      if (data) set({ id, email, nickname, profile_image, created_at, profileStatus: 'ready' })

    },
    resetProfile: () => set(store.getInitialState())
  })
)













