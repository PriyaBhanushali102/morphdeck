import { create } from "zustand";
import { getAllPPTs } from "@/services/pptService";

const useHistoryStore = create((set) => ({
  history: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchHistory: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getAllPPTs();
      if (Array.isArray(data))
        set({
          history: data,
          lastFetched: Date.now(),
        });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Failed to load presentations",
      });
    } finally {
      set({ loading: false });
    }
  },

  addToHistory: (newPpt) =>
    set((state) => ({
      history: [newPpt, ...state.history],
    })),

  removeFromHistory: (id) =>
    set((state) => ({
      history: state.history.filter((p) => p._id !== id),
    })),
}));

export default useHistoryStore;
