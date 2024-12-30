import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  token: null,
  user : null, // the user information
  teamId : null, // the team information
  phoneNumber : null, // the phone number of the user
  isSigninup: false,
  isLoginIn: false,
  isCheckingAuth: true,
  challenges: [],
  teams: [],
  submissions: [],
  users: [],
  isAdmin: false, // once an admin is logged in this will be set to true, to not display what the admin can do, still if this is changed in the client the auth is done in the backend.


  signup: async (data) => {
    set({ isSigninup: true });
    try {
      const response = await axiosInstance.post("signup/", data);
      localStorage.setItem("token", response.data.token);
      set({ token: response.data.token });
      set({ user: response.data.user });
      set({ phoneNumber: response.data.phone_number });
      set({ teamId: response.data.team_id });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    set({ isSigninup: false });
  },
  
  login: async (data) => {
    set({ isLoginIn: true });
    try {
      const response = await axiosInstance.post("login/", data);
      localStorage.setItem("token", response.data.token);
      set({ token: response.data.token });
      set({ user: response.data.user });
      set({ phoneNumber: response.data.phone_number });
      set({ teamId: response.data.team_id });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    set({ isLoginIn: false });
  },

  logout: () => {
    set({ token: null });
    set({ user: null });
    set({ phoneNumber: null });
    set({ teamId: null });
    localStorage.removeItem("token");
  }
}));
