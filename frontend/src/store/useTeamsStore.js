import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js"; 
import {useAuthStore} from './useAuthStore.js'

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

    createTeam: async (data) => {
        set({ isCreatingTeam: true });
        const {token} = useAuthStore.getState();
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
            localStorage.setItem('teamId', response.data.team_id);
            set({ teamCreated: response.data });
            toast.success(response.data.message);
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while joining the team.";
            toast.error(errorMessage);
        }
        set({ isCreatingTeam: false });
    },
    
    joinTeam: async (data) => {
        set({ isJoiningTeam: true });
        const {token} = useAuthStore.getState();
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
            set({ teamJoined: response.data });
            toast.success("Team joined successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An error occurred while joining the team."
            toast.error(errorMessage);
        }
        set({ isJoiningTeam: false });
    }
}))