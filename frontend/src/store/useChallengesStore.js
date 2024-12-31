
// class Challenge(models.Model):
//     title = models.CharField(max_length=255)
//     category = models.CharField(max_length=255)
//     description = models.TextField()
//     resources = models.URLField(blank=True, null=True)  # Resources link (optional)
//     status = models.BooleanField(default=False)  # Status of the challenge
//     inserted_at = models.DateTimeField(auto_now_add=True)  # Creation timestamp
//     deadline = models.DateTimeField(null=True, blank=True)  # Optional deadline

// and here are the functions to implement 
// # URL for listing challenges
// path('challenges/', views.list_challenges, name='list_challenges'),
// # URL for adding a new challenge (only for superusers)
// path('challenges/add/', views.add_challenge, name='add_challenge'),
// # URL for updating a challenge (only for superusers)
// path('challenges/update/', views.update_challenge, name='update_challenge'),
// # URL for deleting a challenge (only for superusers)
// path('challenges/delete/', views.delete_challenge, name='delete_challenge'),
//   # URL for assigning a challenge (only for superusers)
// path('challenges/assign/', views.assign_challenge, name='assign_challenge'),



import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore.js";


export const useChallengesStore = create((set) => ({
    challenges:[],
    isGettingChallenges: false,
    isCreatingChallenge: false,
    isUpdatingChallenge: false,
    isDeletingChallenge: false,
    isGettingChallenge: false,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,


    getChallenges: async () => {
        const {token} = useAuthStore.getState();
        set({isGettingChallenges: true})
        try {
            const response = await axiosInstance.get("/challenges/",{
                headers: {
                    Authorization: `Token ${token}`
                }
            })
            set({ challenges: response.data.challenges,
                totalPages: response.data.total_pages,
                hasNext: response.data.has_next,
                hasPrevious: response.data.has_previous
            })
            console.log(response.data)
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to get challenges"
            toast.error(errorMessage)
        } finally {
            set({ isGettingChallenges: false })
        }
    },
}))