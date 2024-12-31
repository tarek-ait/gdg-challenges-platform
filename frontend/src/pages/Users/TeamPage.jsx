import { useAuthStore } from "../../store/useAuthStore";
import { DoorOpen,Loader } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useTeamsStore } from "../../store/useTeamsStore";
const TeamPage = () => {
  const {teamId,} = useAuthStore();
  const {leaveTeam, isLeavingTeam} = useTeamsStore();
  
  const navigate = useNavigate();

  const exit = () => {
    leaveTeam(navigate);
  }

  return (
    <div className="bg-base-200 min-h-screen  py-10">
        <div className="team-info flex items-center justify-center flex-col">
          <h1>Welcome to the team {teamId} space</h1>
          <p>Here you can work with your team members on projects and tasks.</p>
          <button onClick={exit} className="btn bg-error text-base-300 my-10 hover:text-inherit cursor-pointer" disabled={isLeavingTeam}>
          <DoorOpen />
          {isLeavingTeam ? (
                <>
                  <Loader className="size-5 animate-spin">
                    loading...
                  </Loader>
                </>
              ) : (
                "Leave Team"
              )}
          </button>
        </div>
    </div>
  )
}

export default TeamPage
