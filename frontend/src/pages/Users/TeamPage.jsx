import { DoorOpen, Loader } from 'lucide-react';
import { useNavigate, useParams } from "react-router-dom";
import { useTeamsStore } from "../../store/useTeamsStore";
import { useEffect } from "react";

const TeamPage = () => {
  const { teamId } = useParams();
  const { leaveTeam, isLeavingTeam, getTeamInfo, team } = useTeamsStore();

  useEffect(() => {
    async function fetchData() {
      await getTeamInfo(teamId);
    }
    fetchData();
  }, [teamId, getTeamInfo])
  const navigate = useNavigate();

  const exit = async () => {
    await leaveTeam(navigate);
    navigate("/");
  }

  if (!team || !team?.team_info?.members?.length) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  } 
  

  console.log('Team data:', team); // Debugging the team data after it's fetched

  return (
    <div className="bg-base-200 min-h-screen py-28">
      <div className="team-info flex items-center justify-center flex-col">
        <h1>Welcome to the team {teamId} space</h1>
        <h1 className="my-10">Members</h1>

        {/* Check for team members before rendering the table */}
        {team?.team_info?.members?.length > 0 ? (
          <div className="overflow-x-auto my-5">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>User Name</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone number</th>
                </tr>
              </thead>
              <tbody>
                {team.team_info.members.map((member) => (
                  <tr key={member.username}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img src="/avatar.jpg" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{member.username}</td>
                    <td>{member.first_name}</td>
                    <td>{member.last_name}</td>
                    <td>{member.email}</td>
                    <td>{member.profile.phone_number}</td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No members available</div>
        )}

        <h1>Assigned Challenge: {team?.team_info?.challenge?.id}</h1>
        <h1>Team Submission Details</h1>

        <h1>Leave the team</h1>
        <button
          onClick={exit}
          className="btn bg-error text-base-300 my-10 hover:text-inherit cursor-pointer"
          disabled={isLeavingTeam}
        >
          <DoorOpen />
          {isLeavingTeam ? (
            <Loader className="size-5 animate-spin" />
          ) : (
            'Leave Team'
          )}
        </button>
      </div>
    </div>
  );
};

export default TeamPage;