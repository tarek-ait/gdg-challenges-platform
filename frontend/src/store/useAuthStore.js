import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  token: null,
  user: null, // the user information
  teamId: null, // the team information
  phoneNumber: null, // the phone number of the user
  isSigninup: false,
  isLoginIn: false,
  isCheckingAuth: true,
  challenges: [],
  teams: [],
  submissions: [],
  users: [],
  isAdmin: false, // once an admin is logged in this will be set to true, to not display what the admin can do, still if this is changed in the client the auth is done in the backend.

  checkAuth: async () => {
    // we just see if there is a token available in the local storage, there is no function check auth in the backend
    const token = localStorage.getItem("token");
    const user =  localStorage.getItem("user");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const teamId = localStorage.getItem("teamId");
    set({ isCheckingAuth: false });
    if (token) {
      set({ user: user, phoneNumber: phoneNumber, teamId: teamId, token: token });
      return true;
    }
    return false;
  },

  signup: async (data) => {
    set({ isSigninup: true });
    try {
      // Adjust the request data structure
      const requestData = {
        username: data.username,
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
        user_profile: {
          phone_number: data.phoneNumber,
        },
      };

      const response = await axiosInstance.post("signup/", requestData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("phoneNumber", response.data.phone_number);
      localStorage.setItem("teamId", response.data.team_id);
      set({
        token: response.data.token,
        user: response.data.user,
        phoneNumber: response.data.phone_number,
        teamId: response.data.team_id,
      });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    set({ isSigninup: false });
  },

  login: async (data) => {
    set({ isLoginIn: true });
    try {
      const response = await axiosInstance.post("login/", data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("phoneNumber", response.data.phone_number);
      localStorage.setItem("teamId", response.data.team_id);
      set({ token: response.data.token });
      set({ user: response.data.user });
      set({ phoneNumber: response.data.phone_number });
      set({ teamId: response.data.team_id });
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("user credentials are incorrect");
      console.log(error);
    }
    set({ isLoginIn: false });
  },

  logout: () => {
    localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("phoneNumber");
      localStorage.removeItem("teamId");
    set({
      token: null,
      user: null,
      phoneNumber: null,
      teamId: null,
    });
    toast.success("Logged out successfully!");
  },
}));
