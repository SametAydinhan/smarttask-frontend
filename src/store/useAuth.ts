import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null as string | null,
      user: null as User | null,
      setAuth: (token: string, user: User) => set({ token, user }),
      logout: () => set({ token: null as string | null, user: null as User | null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
