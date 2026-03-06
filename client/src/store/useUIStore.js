import { create } from "zustand";

const useUIStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebar: (value) => set({ isSidebarOpen: value }),
}));

export default useUIStore;
