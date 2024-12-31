import { useParams } from "react-router-dom"
import { useChallengesStore } from "../../store/useChallengesStore"
import { useEffect, useState } from "react"
import { Loader } from "lucide-react"

const ChallengePreviewPage = () => {

  // get the challenge from the challenges array that has the same id as the parameter 
  const { challenges, getChallenges } = useChallengesStore()
  const [challenge, setChallenge] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    if (challenges.length === 0) {
      getChallenges();
    } else {
      const foundChallenge = challenges.find((challenge) => challenge.id === parseInt(id));
      setChallenge(foundChallenge);
    }
  }, [challenges, id, getChallenges]);

  if (!challenge) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }

  console.log(challenge);
  const resources = challenge.resources ? challenge.resources.split(',') : [];

  return (
    <div className="bg-base-200 min-h-screen p-10 py-20 flex items-start flex-col">
      <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
      <p className="text-lg mb-4">{challenge.description}</p>
      <p className="text-sm text-gray-600">Category: {challenge.category}</p>
      <p className="text-sm text-gray-600">Status: {challenge.status ? "Active" : "Inactive"}</p>
      <p className="text-sm text-gray-600">Inserted At: {new Date(challenge.inserted_at).toLocaleDateString()}</p>
      <p className="text-sm text-gray-600">Deadline: {new Date(challenge.deadline).toLocaleDateString()}</p>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Resources</h2>
        <ul className="list-disc list-inside">
          {resources.map((resource, index) => (
            <li key={index}>
              <a href={resource.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {resource.trim()}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ChallengePreviewPage
