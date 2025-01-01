import { User, Mail, Phone } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore.js'
import { useTeamsStore } from '../../store/useTeamsStore.js'
const ProfilePage = () => {

  const { user, teamId } = useAuthStore()
  const { team } = useTeamsStore()

  let parsedUser;

  try {
    parsedUser = JSON.parse(user);
  } catch (error) {
    console.error('Failed to parse user JSON:', error);
  }


  return (
    <div className="bg-base-200 min-h-screen  py-10">
      <div className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Profile</h1>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src="/avatar.jpg"
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4" />
              </div>
            </div>
            {/* user info section */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4"></User>
                  user Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{parsedUser.username}</p>
              </div>


              <div className="contaner-names flex gap-4 min-w-full justify-between">
                <div className="space-y-1.5 flex-1">
                  <div className="text-5m text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4"></User>
                    Last Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{parsedUser.last_name}</p>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="text-5m text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4"></User>
                    first Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{parsedUser.first_name}</p>
                </div>
              </div>


              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4"></Mail>
                  Email Adress
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{parsedUser.email}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Phone className="w-4 h-4"></Phone>
                  Phone number
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{parsedUser.user_profile.phone_number}</p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              {( !team ) && (
                <div className="team-container">
                  <h2 className="text-lg font-medium mb-4">Dont have a team</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span>Account Status</span>
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                </div>
              )}
              {( team) && (
                <div className="team-container">
                  <h2 className="text-lg font-medium mb-4">Team Information:</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span>Team ID</span>
                      <span className="text-green-500">{teamId}</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span>Account Status</span>
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
