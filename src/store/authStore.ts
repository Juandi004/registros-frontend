import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type AuthStore = {
  isLoggedIn: boolean
  token: string | null
  userId: string | null
  user: any | null
  careerId: any | null
  login: (token: string, userId: string) => void
  logout: () => void
  setUser: (user: any) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      userId: null,
      user: null,
      careerId: null,

      login: (token, userId) => set({ isLoggedIn: true, token, userId }),
      logout: () => set({ isLoggedIn: false, token: null, userId: null, user: null }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => window.localStorage),
    }
  )
)

