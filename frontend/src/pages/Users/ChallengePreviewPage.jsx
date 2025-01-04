import { useParams } from "react-router-dom"
import { useChallengesStore } from "../../store/useChallengesStore"
import { useEffect, useState } from "react"
import { Loader, Swords, ReceiptText, ChartColumnStacked, Hourglass } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { useNavigate } from "react-router-dom"
const ChallengePreviewPage = () => {

  // get the challenge from the challenges array that has the same id as the parameter 
  const { challenges, getChallenges, isDeletingChallenge, isUpdatingChallenge, deleteChallenge, updateChallenge } = useChallengesStore()
  const [challenge, setChallenge] = useState(null)
  const { id } = useParams()

  const { isAdmin } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)

  const navigate = useNavigate()

  const [challengeData, setChallengeData] = useState({
    challengeTitle: '',
    challengeCategory: '',
    challengeDescription: '',
    challengeResources: '',
    challengeStatus: false,
    challengeDeadline: '',
  });

  useEffect(() => {
    if (challenges.length === 0) {
      getChallenges();
    }
  }, [challenges, getChallenges]);

  useEffect(() => {
    const foundChallenge = challenges.find((challenge) => challenge.id === parseInt(id));
    if (foundChallenge) {
      setChallenge(foundChallenge);
      setChallengeData({
        challengeTitle: foundChallenge.title,
        challengeCategory: foundChallenge.category,
        challengeDescription: foundChallenge.description,
        challengeResources: foundChallenge.resources,
        challengeStatus: foundChallenge.status,
        challengeDeadline: foundChallenge.deadline ? formatDateTimeLocal(foundChallenge.deadline) : '',
      });
    }
  }, [challenges, updateChallenge, id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleResourceChange = (index, value) => {
    const resourcesArray = challengeData.challengeResources.split(',');
    resourcesArray[index] = value;
    setChallengeData((prevData) => ({
      ...prevData,
      challengeResources: resourcesArray.join(','),
    }));
  };

  const handleResourceDelete = (index) => {
    const resourcesArray = challengeData.challengeResources.split(',');
    resourcesArray.splice(index, 1);
    setChallengeData((prevData) => ({
      ...prevData,
      challengeResources: resourcesArray.join(','),
    }));
  };

  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toISOString().slice(0, 16);
  };

  const handleSave = async () => {
    // call the update challenge data
    const data = {
      challengeId: challenge.id,
      challengeTitle: challengeData.challengeTitle,
      challengeCategory: challengeData.challengeCategory,
      challengeDescription: challengeData.challengeDescription,
      challengeResources: challengeData.challengeResources,
      challengeStatus: challengeData.challengeStatus,
      challengeDeadline: challengeData.challengeDeadline,
    };
    await updateChallenge(data);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteChallenge(challenge.id, navigate);
      setChallengeData({
        challengeTitle: '',
        challengeCategory: '',
        challengeDescription: '',
        challengeResources: '',
        challengeStatus: false,
        challengeDeadline: '',
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChallengeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (!challenge) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }


  return (
    <div className="bg-base-200 min-h-screen  py-10">
      <div className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Challenge</h1>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Swords className="w-4 h-4"></Swords >
                  Challenge Title
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="challengeTitle"
                    value={challengeData.challengeTitle}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  />
                ) : (
                  <p className="text-lg">{challengeData.challengeTitle}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <ChartColumnStacked className="w-4 h-4" />
                  Category
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="challengeCategory"
                    value={challengeData.challengeCategory}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  />
                ) : (
                  <p className="text-lg">{challengeData.challengeCategory}</p>
                )}
              </div>

              <div className="contaner-names flex gap-4 min-w-full justify-between">
                <div className="space-y-1.5 flex-1">
                  <div className="text-5m text-zinc-400 flex items-center gap-2">
                    <ReceiptText className="w-4 h-4" />
                    Challenge description
                  </div>
                  {isEditing ? (
                    <textarea
                      name="challengeDescription"
                      value={challengeData.challengeDescription}
                      onChange={handleChange}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    />
                  ) : (
                    <p className="text-lg">{challengeData.challengeDescription}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Hourglass className="w-4 h-4" />
                  Deadline
                </div>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    name="challengeDeadline"
                    value={challengeData.challengeDeadline}
                    onChange={handleChange}
                    className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                  />
                ) : (
                  <p className="text-lg">{challengeData.challengeDeadline}</p>
                )}
              </div>
              <div className="mt-6 bg-base-300 rounded-xl py-6">

                <div className="team-container">
                  <h2 className="text-lg font-medium mb-4">Team Information:</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span>Challenge ID</span>
                      <span className="text-green-500">{challenge.id}</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span>Challenge Status</span>
                      <span className="text-green-500">{challenge.status ? "not Assigned" : "Assigned"}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 my-4">
                    <div className="text-5m flex flex-col items-start gap-2">
                      Resources
                      {isEditing ? (
                        challengeData.challengeResources.split(',').map((resource, index) => (
                          <div key={index} className="flex items-center justify-between min-w-full gap-2">
                            <input
                              type="text"
                              value={resource.trim()}
                              onChange={(e) => handleResourceChange(index, e.target.value)}
                              className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                            />
                            <button
                              onClick={() => handleResourceDelete(index)}
                              className="px-2 py-1 bg-red-500 text-white rounded-md"
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      ) : (
                        challengeData.challengeResources.split(',').map((resource, index) => (
                          <p key={index} className="text-lg">
                            {resource.trim()}
                          </p>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="root-container">
                  <div className="flex justify-end space-x-4 mt-6">
                    {
                      isEditing ? (
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          {isUpdatingChallenge ? (
                            <>
                              <Loader className="size-5 animate-spin" />
                            </>
                          ) : (
                            "Save"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={handleEditToggle}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Edit Submission
                        </button>
                      )
                    }
                    <div className="btn-container">
                      {isAdmin && (
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          {isDeletingChallenge ? (
                            <>
                              <Loader className="size-5 animate-spin" />
                            </>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      )
                      }
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



export default ChallengePreviewPage
