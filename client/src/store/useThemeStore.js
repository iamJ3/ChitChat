import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    // also apply theme to the root html element so portals and global elements
    // (toasts, overlays) receive the same DaisyUI theme
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
}));