import { useAuthStore } from "../../store/useAuthStore";
const TeamPage = () => {
  const {teamId} = useAuthStore();



  return (
    <div className="bg-base-200 min-h-screen  py-10">
        <div className="team-info">
          <h1>Welcome to the team {teamId} space</h1>
        </div>
    </div>
  )
}

export default TeamPage
