import { create } from "zustand";

type MenuState = {
  isOpen: boolean;
  isAnimating: boolean;
  setIsOpen: (open: boolean) => void;
  setIsAnimating: (animating: boolean) => void;
};

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  isAnimating: false,
  setIsOpen: (open) => set({ isOpen: open }),
  setIsAnimating: (animating) => set({ isAnimating: animating }),
}));
