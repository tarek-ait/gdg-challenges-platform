import { useAuthStore } from "../../store/useAuthStore"
import { useChallengesStore } from "../../store/useChallengesStore"
import { useEffect } from "react"
import { Loader } from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";
const ChallengesPage = () => {

  const { isAdmin } = useAuthStore()
  const { challenges, isGettingChallenges, getChallenges, totalPages, hasNext, hasPrevious } = useChallengesStore()


  const [currentPage, setCurrentPage] = useState(1)


  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    getChallenges()
  },
    [getChallenges])


  return (
    <div className="challenges-container p-5 py-20 bg-base-200 min-h-screen">
      {isGettingChallenges &&
        <div className="loader-container animate-spin flex justify-center items-center h-96">
          <Loader className="size-5" />
        </div>
      }
      {!isGettingChallenges &&
        (<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                  Challenge title
                </th>
                <th scope="col" className="px-6 py-3">
                  Category
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Added at
                </th>
                <th scope="col" className="px-6 py-3">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {/* iterating through the challenges array */}
              {challenges.map((challenge) => (
                <tr key={challenge.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      {/* <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label className="sr-only">checkbox</label> */}
                    </div>
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <Link to={`/challenge-preview/${challenge.id}`} className="text-blue-600 hover:underline">
                        {challenge.title}
                  </Link>
                  </th>
                  <td className="px-6 py-4">
                    {challenge.category}
                  </td>
                  <td className="px-6 py-4">
                    {challenge.status ? "Available" : "Not Available"}
                  </td>
                  <td className="px-6 py-4">
                  {formatDate(challenge.inserted_at)}
                  </td>
                  <td className="px-6 py-4">
                  {formatDate(challenge.deadline)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="flex items-center flex-col h-auto  shadow-transparent p-4 flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
              Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, challenges.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{challenges.length}</span>
            </span>
            <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
              <li>
                <button
                  onClick={handlePrevious}
                  disabled={!hasPrevious}
                  className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${!hasPrevious && 'cursor-not-allowed'}`}
                >
                  Previous
                </button>
              </li>
              <li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index}>
                    <button
                      onClick={() => setCurrentPage(index + 1)}
                      className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${currentPage === index + 1 && 'text-blue-600 bg-blue-50'}`}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </li>
              <li>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${!hasNext && 'cursor-not-allowed'}`}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
        )
      }
    </div>

  )
}

export default ChallengesPage
