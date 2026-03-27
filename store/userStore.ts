import { Profile } from "@/config/schema";
import { create } from "zustand";

interface UserState {
  userDetails: Profile | null;
  isLoading: boolean;
  setUserDetails: (user: Profile | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  userDetails: null,
  isLoading: true,
  setUserDetails: (user) => set({ userDetails: user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
