

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

export const useSubmissionsStore = create((set) => ({
    submission: null,
    isSubmitting: false,
    updated: false,
    isUpdating: false,
    deleted: false,
    isDeleting: false,

    submit: async (data) => {
        set({ isSubmitting: true });
        const { token } = useAuthStore.getState();
        try {
            const requestData = {
                team_id: data.teamId,
                challenge_id: data.challengeId,
                video_url: data.videoUrl,
                resources_links: data.resourcesLinks,
            };
            const response = await axiosInstance.post("submissions/add/", requestData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            set({ submission: response.data });
            toast.success(response.data.message);
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                "An error occurred while submitting the challenge.";
            toast.error(errorMessage);
        }
        set({ isSubmitting: false });
    },
    // delete a submission by passing the submission id in the request body
    deleteSubmission: async (submissionId) => {
        set({ isDeleting: true });
        const { token } = useAuthStore.getState();

        try {
            const response = await axiosInstance.post(
                "submissions/remove/",
                { submission_id: submissionId },
                {
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                }
            );
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
        try {
            const requestData = {
                submission_id: data.submissionId,
                video_url: data.videoUrl,
                resources_links: data.resourcesLinks,
            };
            const response = await axiosInstance.post("submissions/update/", requestData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            toast.success(response.data.message);
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                "An error occurred while updating the submission.";
            toast.error(errorMessage);
        }
        set({ isUpdating: false });
    },

    // the get submissions for the admin we will do it later on
}))