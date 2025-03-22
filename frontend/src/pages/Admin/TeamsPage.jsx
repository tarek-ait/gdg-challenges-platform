import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTeamsStore } from '../../store/useTeamsStore'
import { Loader } from 'lucide-react'
import { useChallengesStore } from '../../store/useChallengesStore'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

const TeamsPage = () => {
  const { teams, getTeams, isGettingTeams, isAdmin } = useTeamsStore();
  const { challenges, getChallenges, assignChallenge } = useChallengesStore();
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isAssigningChallenge, setIsAssigningChallenge] = useState(false);

  useEffect(() => {
    getTeams();
    getChallenges();
  }, [getTeams, getChallenges]);

  const handleAssignChallenge = async () => {
    if (!selectedChallenge || !selectedTeam) return;
    setIsAssigningChallenge(true);
    try {
      await assignChallenge(selectedChallenge, selectedTeam);
      setSelectedChallenge(null);
      setSelectedTeam(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign challenge.");
    } finally {
      setIsAssigningChallenge(false);
    }
  };

  const handleSelectChange = (challengeId) => {
    setSelectedChallenge(challengeId);
  };

  const handleShowSelect = (teamId) => {
    setSelectedTeam(teamId);
    setSelectedChallenge(null);
  };

  if (isGettingTeams) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  // Show all challenges instead of filtering by status
  const availableChallenges = challenges;

  // here we will add the assign challenge button to assign a challenge to a team
  return (
    <div className="challenges-container p-8 py-24 bg-base-200 min-h-screen">
      {!isGettingTeams &&
        (
          <div className="challenges-container py-24">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Teams</h1>
              <div></div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-8">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {isAdmin ? (
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                          <label className="sr-only">checkbox</label>
                        </div>
                      </th>
                    ) : <th scope="col" className="p-4">
                      <div className="flex items-center">
                      </div>
                    </th>}
                    <th scope="col" className="px-6 py-3">
                      Team id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Challenge id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      team_leader
                    </th>
                    <th scope="col" className="px-6 py-3">
                      submission id
                    </th>
                    <th>

                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* iterating through the challenges array */}
                  {teams.map((team) => (
                    <tr key={team.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          {/* <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label className="sr-only">checkbox</label> */}
                        </div>
                      </td>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {team.id}
                      </th>
                      <td className="px-6 py-4">
                        <Link to={`/challenge-preview/${team.challenge}`} className="text-blue-600 hover:underline">
                          <button className="btn btn-ghost btn-xs">{team.challenge}</button>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {team.team_leader}
                      </td>
                      <td className="px-6 py-4">
                        {team.submission ? team.submission : "no submission"}
                      </td>
                      <td className="px-4 py-2  w-64">
                        <div className="flex items-center space-x-2">
                          {(selectedTeam === team.id && !team.challenge) ? (
                            <>
                              <select
                                value={selectedChallenge || ""}
                                onChange={(e) => handleSelectChange(e.target.value)}
                                className="px-2 py-1 bg-base-200 rounded-lg w-full outline-none"
                              >
                                <option value="">Select Challenge</option>
                                {availableChallenges.map((challenge) => (
                                  <option key={challenge.id} value={challenge.id}>
                                    {challenge.title}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={handleAssignChallenge}
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md outline-none"
                                disabled={isAssigningChallenge}
                              >
                                {isAssigningChallenge ? (
                                  <Loader className="size-4 animate-spin" />
                                ) : (
                                  "Assign"
                                )}
                              </button>
                            </>
                          ) : (!team.challenge) && (
                            <button
                              onClick={() => handleShowSelect(team.id)}
                              className="px-4 py-2 bg-blue-500 text-white relative right-0 rounded-md outline-none"
                            >
                              Select challenge
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>

        )
      }
    </div>

  )
}

export default TeamsPage
