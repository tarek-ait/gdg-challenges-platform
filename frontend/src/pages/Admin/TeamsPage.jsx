import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTeamsStore } from '../../store/useTeamsStore'
import { useAuthStore } from '../../store/useAuthStore'
import { Loader } from 'lucide-react'

const TeamsPage = () => {
    const { isAdmin } = useAuthStore()
    const { teams, isGettingTeams, getTeams } = useTeamsStore()

  
    useEffect(() => {
      if (!teams || teams.length === 0) {
        getTeams();
      }
    }, [teams, getTeams]);
  
    if (isGettingTeams) {
      return (
        <div className="loader-container flex justify-center items-center h-96">
          <Loader className="size-5 animate-spin" />
        </div>
      );
    }
  
    // here we will add the assign challenge button to assign a challenge to a team
    return (
      <div className="challenges-container p-5 py-20 bg-base-200 min-h-screen">
        {!isGettingTeams &&
          (
            <div className="challenges-container py-20">
              <div className="relative  overflow-x-auto  shadow-md sm:rounded-lg">
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
                        submission id
                      </th>
                      <th scope="col" className="px-6 py-3">
                        team_leader
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
                          {team.submission ? team.submission.id : "no submission"}
                        </td>
                        <th>
                          {/* <Link to={`/challenge-preview/${submission.id}`} className="text-blue-600 hover:underline">
                            <button className="btn btn-ghost btn-xs">details</button>
                          </Link> */}
                        </th>
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
