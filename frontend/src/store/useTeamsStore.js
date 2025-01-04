import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useTeamsStore = create((set) => ({
  //  here are the functions we need to implement for the team features
  // 1. create a team. createTeam()
  // 2. join a team. joinTeam()
  // 3. leave a team. leaveTeam()
  // 4. get the data for the team work space. teamInfo()
  // here is the data we need to save in the global state.
  team: null,
  setTeam: (team) => set({ team }),
  teamCreated: null,
  isCreatingTeam: false,
  teamJoined: null,
  isJoiningTeam: false,
  teamLeft: null,
  isLeavingTeam: false,
  teamInfo: null,
  isFetchingTeamInfo: false,
  teams:[],
  isGettingTeams: false,
  createTeam: async (data, navigate) => {
    set({ isCreatingTeam: true });
    const { token } = useAuthStore.getState();
    try {
      const requestData = {
        name: data.teamName,
        password: data.password,
      };
      const response = await axiosInstance.post("teams/create/", requestData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      localStorage.setItem("teamId", response.data.team_id);
      set({ teamCreated: response.data });
      toast.success(response.data.message);
      const { checkAuth } = useAuthStore.getState();
      checkAuth();
      // redirect to the team page
      navigate(`/team/${response.data.team_id}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while joining the team.";
      toast.error(errorMessage);
    }
    set({ isCreatingTeam: false });
  },

  joinTeam: async (data, navigate) => {
    set({ isJoiningTeam: true });
    const { token } = useAuthStore.getState();
    try {
      const requestData = {
        name: data.teamName,
        password: data.password,
      };
      const response = await axiosInstance.post("teams/join/", requestData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      localStorage.setItem("teamId", response.data.team_id);
      const { checkAuth } = useAuthStore.getState();
      checkAuth();
      set({ teamJoined: response.data });
      toast.success("Team joined successfully!");
      navigate(`/team/${response.data.team_id}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while joining the team.";
      toast.error(errorMessage);
    }
    set({ isJoiningTeam: false });
  },
  // leave team function
  leaveTeam: async (navigate) => {
    set({ isLeavingTeam: true });
    const { token } = useAuthStore.getState();
    try {
      const response = await axiosInstance.post(
        "teams/leave/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      localStorage.setItem("teamId", null);
      set({ teamLeft: response.data });
      set({ teamId: null });
      set({ team: null });
      toast.success("Team left successfully!");
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while leaving the team.";
      toast.error(errorMessage);
    }
    set({ isLeavingTeam: false });
  },

  // get info for the team sapce page 
  getTeamInfo: async (teamId) => {
    const { token } = useAuthStore.getState();
    set({ isFetchingTeamInfo: true });
    try {
      const response = await axiosInstance.get(`teams/${teamId}/info/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      set({ team: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to get team info';
      toast.error(errorMessage);
    } finally {
      set({ isFetchingTeamInfo: false });
    }
  },
  // get all the teams for the admin
  getTeams: async () => {
    const { token } = useAuthStore.getState();
    set({ isGettingTeams: true });
    try {
      const response = await axiosInstance.get('teams/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      set({ teams: response.data });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to get teams';
      toast.error(errorMessage);
    } finally {
      set({ isGettingTeams: false });
    }
  },

}));
