import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3001/api/teacher";

axios.defaults.withCredentials = true; // set withCredentials to true

export const useStudentStore = create((set) => ({
  allStudents: [],
  students: [],
  error: null,
  success: null,
  message: null,
  isLoading: false,
  getStudents: async (id) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get(`${API_URL}/students/${id}`);
      if (response.status === 200) {
        const { students } = response.data;
        set({ students, isLoading: false, error: null });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  getAllStudents: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/students/all`);
      if (response.status === 200) {
        const allStudents = response.data.data.map(student => ({
          idNumber: student.idNumber,
          name: student.name
        }));        
        
        set({ allStudents, isLoading: false, error: null });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  
  addStudent: async (classCode, newStudent) => {
    set({ isLoading: true });
    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(`${API_URL}/students/${classCode}`, newStudent);
      if (response.status === 200) {
        const { student } = response.data;
        set({
          success: true,
          message: "Student added successfully",
          student,
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  deleteStudent: async (classCode, studentId) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const response = await axios.delete(`${API_URL}/students`, {
        data: { classCode, idNumber: studentId },
      });
  
      if (response.status === 200) {
        set({
          success: true,
          message: "Student deleted successfully",
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  deleteMultipleStudents: async (classCode, studentIds) => { 
    set({ isLoading: true });
    try {
      console.log("Class Code:", classCode);
      console.log("Student IDs to delete:", studentIds);
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const response = await axios.delete(`${API_URL}/students/multiple`, {
        data: { classCode, idNumbers: studentIds },
      });
  
      console.log("Response from delete request:", response); // Log the response
  
      if (response.status === 200) {
        set({
          success: true,
          message: "Students deleted successfully", 
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error deleting students:", error.response ? error.response.data : error.message);
      set({ error, isLoading: false });
    }
  },
  
  updateStudent: async (id, updatedStudent) => {
    set({ isLoading: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.put(
        `${API_URL}/students/${id}`,
        updatedStudent
      );
      if (response.status === 200) {
        set({
          success: true,
          message: "Student updated successfully",
          isLoading: false,
        });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  // updateStudentStatus: async (id, status) => {
  //   set({ isLoading: true });
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     const response = await updateStudentStatus(id, status);
  //     if (response.status === 200) {
  //       set({
  //         success: true,
  //         message: "Student status updated successfully",
  //         isLoading: false,
  //       });
  //     }
  //   } catch (error) {
  //     set({ error, isLoading: false });
  //   }
  // },

  // importFile: async (file) => {
  //   set({ isLoading: true });
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     const response = await importFile(file);
  //     if (response.status === 200) {
  //       set({
  //         success: true,
  //         message: "File imported successfully",
  //         isLoading: false,
  //       });
  //     }
  //   } catch (error) {
  //     set({ error, isLoading: false });
  //   }
  // },
}));
