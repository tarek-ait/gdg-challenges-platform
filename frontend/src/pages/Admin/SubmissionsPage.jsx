import { useSubmissionsStore } from "../../store/useSubmissionsStore"
import { useAuthStore } from "../../store/useAuthStore"
import { useEffect } from "react"
import { Loader } from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
const SubmisionsPage = () => {
  const { isAdmin } = useAuthStore()
  const { submissions, isGettingSubmissions, getSubmissions, totalPages, hasNext, hasPrevious } = useSubmissionsStore()


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
    getSubmissions();
  }, []);

  if (isGettingSubmissions) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="challenges-container p-8 py-24 bg-base-200 min-h-screen">
      {!isGettingSubmissions &&
        (
          <div className="challenges-container py-24">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Submissions</h1>
              <div></div>
            </div>
            <div className="relative  overflow-x-auto  shadow-md sm:rounded-lg p-8">
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
                      resources links
                    </th>
                    <th scope="col" className="px-6 py-3">
                      submitted at
                    </th>
                    <th scope="col" className="px-6 py-3">
                      validated
                    </th>
                    <th scope="col" className="px-6 py-3">

                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* iterating through the challenges array */}
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          {/* <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      <label className="sr-only">checkbox</label> */}
                        </div>
                      </td>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {submission.team_id}
                      </th>
                      <td className="px-6 py-4">
                        <Link to={`/challenge-preview/${submission.challenge_id}`} className="text-blue-600 hover:underline">
                          <button className="btn btn-ghost btn-xs">{submission.challenge_id}</button>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {submission.resources_links ? (
                          <>
                            Available: {submission.resources_links.substring(0, 10)}...
                          </>
                        ) : (
                          "Not Available"
                        )}

                      </td>
                      <td className="px-6 py-4">
                        {formatDate(submission.submitted_at)}
                      </td>
                      <td className="px-6 py-4">
                        not available yet
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
              <nav className="flex items-center flex-col h-auto  shadow-transparent p-4 flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, submissions.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{submissions.length}</span>
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
                    <ul>
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
                    </ul>

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
          </div>

        )
      }
    </div>

  )
}

export default SubmisionsPage
