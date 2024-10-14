import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3001/api";

axios.defaults.withCredentials = true; // For secure cookie handling

export const useClassStore = create((set) => ({
  classes: [],
  error: null,
  isLoading: false,

  getClasses: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/classes`);
      if (response.status === 200) {
        const { classes } = response.data;
        set({ classes, isLoading: false, error: null });
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      set({ error: error.response?.data || error.message, isLoading: false });
    }
  },

  addClass: async (newClass) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/classes`, newClass);
      if (response.status === 200) {
        const { newClass } = response.data;
        set((state) => ({
          classes: [...state.classes, newClass],
          isLoading: false,
          error: null,
        }));
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  deleteClass: async (classCode) => {
    set({ isLoading: true });
    try {
      const response = await axios.delete(`${API_URL}/classes`, {
        data: { classCode }
      });
      if (response.status === 200) {
        set((state) => ({
          classes: state.classes.filter((classItem) => classItem.classCode !== classCode),
          isLoading: false,
          error: null,
        }));
        alert(response.data.message); // Optionally show a message
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  archiveClass: async (classCode) => {
    set({ isLoading: true });
    try {
      const response = await axios.patch(`${API_URL}/classes/archive`, {
        classCode
      });
      if (response.status === 200) {
        set((state) => ({
          classes: state.classes.map((classItem) => 
            classItem.classCode === classCode ? { ...classItem, archived: true } : classItem
          ),
          isLoading: false,
          error: null,
        }));
        alert(response.data.message); // Optionally show a message
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));