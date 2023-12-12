import { create } from "zustand";

const useAuthStore = create((set) => ({
  userType: "",
  setUserType: (type) => set((state) => ({ userType: type })),
  loggedUsername: "",
  setLoggedUsername: (name) => set((state) => ({ loggedUsername: name })),
}));

export default useAuthStore;
