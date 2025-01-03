//  these are the field required when submitting a challenge and also the fields for the submission table
// # Extract fields and check if required ones are present
// team_id = data.get('team_id')
// challenge_id = data.get('challenge_id')
// video_url = data.get('video_url')
// resources_links = data.get('resources_links') # the repos urls
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";
import { useTeamsStore } from "./useTeamsStore.js";
export const useSubmissionsStore = create((set) => ({
  submission: null,
  isSubmitting: false,
  updated: false,
  isUpdating: false,
  deleted: false,
  isDeleting: false,
  submissions: [],
  isGettingSubmissions: false,

  submit: async (data) => {
    set({ isSubmitting: true });
    const { token } = useAuthStore.getState();
    const { team, setTeam } = useTeamsStore.getState();
    try {
      const requestData = {
        team_id: data.teamId,
        challenge_id: data.challengeId,
        video_url: data.videoUrl,
        resources_links: data.resourcesLinks,
      };
      console.log(requestData);
      const response = await axiosInstance.post(
        "submissions/add/",
        requestData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      set({ submission: response.data });
      const updatedTeam = {
        ...team,
        team_info: {
          ...team.team_info,
          submission: {
            id: response.data.submission_id,
            video_url: data.videoUrl,
            resources_links: data.resourcesLinks,
          },
        },
      };
      setTeam(updatedTeam);
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while submitting the challenge.";
      toast.error(errorMessage);
    }
    // updating the team from the useTeamStore

    set({ isSubmitting: false });
  },
  // delete a submission by passing the submission id in the request body
  deleteSubmission: async (submissionId) => {
    set({ isDeleting: true });
    const { team, setTeam } = useTeamsStore.getState();
    const { token } = useAuthStore.getState();
    console.log(token);
    try {
      const response = await axiosInstance.delete("submissions/remove/", {
        headers: {
          Authorization: `Token ${token}`,
        },
        data: {
          submission_id: submissionId,
        },
      });
      //  updating the team in the useTeamStore
      const updatedTeam = {
        ...team,
        team_info: {
          ...team.team_info,
          submission: null,
        },
      };
      setTeam(updatedTeam);
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while deleting the submission.";
      toast.error(errorMessage);
    }
    set({ isDeleting: false });
  },

  // update a submission by passing the submission id in the request body
  updateSubmission: async (data) => {
    set({ isUpdating: true });
    const { token } = useAuthStore.getState();
    const { team, setTeam } = useTeamsStore.getState();
    try {
      const requestData = {
        submission_id: data.submissionId,
        video_url: data.videoUrl,
        resources_links: data.resourcesLinks,
      };
      console.log(requestData);
      const response = await axiosInstance.put(
        "submissions/update/",
        requestData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      const updatedTeam = {
        ...team,
        team_info: {
          ...team.team_info,
          submission: {
            id: response.data.submission_id,
            video_url: data.videoUrl,
            resources_links: data.resourcesLinks,
          },
        },
      };
      setTeam(updatedTeam);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while updating the submission.";
      toast.error(errorMessage);
    }
    set({ isUpdating: false });
  },
  // function to get the submissions for the admin
  getSubmissions: async () => {
    set({ isGettingSubmissions: true });
    const { token } = useAuthStore.getState();
    try {
      const response = await axiosInstance.get("submissions/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      set({
        submissions: response.data.submissions,
        totalPages: response.data.total_pages,
        hasNext: response.data.has_next,
        hasPrevious: response.data.has_previous,
      });
      console.log(response.data);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while fetching the submissions.";
      toast.error(errorMessage);
    }
    set({ isGettingSubmissions: false });
  },
}));
