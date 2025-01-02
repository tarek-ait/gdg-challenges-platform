import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTeamsStore } from '../../store/useTeamsStore';
import { useSubmissionsStore } from '../../store/useSubmissionsStore';
import { Loader, ShieldHalf, Video, Link } from 'lucide-react';


const SubmissionPage = () => {
  const { user, teamId } = useAuthStore();
  const { team, getTeamInfo } = useTeamsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    videoUrl: '',
    frontendRepo: '',
    backendRepo: '',
  });
  const { submit, isSubmitting, updateSubmission, isUpdating, isDeleting, deleteSubmission } = useSubmissionsStore();
  // If the team has an assigned challenge, then we get the challenge from the challenges array

  useEffect(() => {
    async function fetchData() {
      await getTeamInfo(teamId);
    }
    fetchData();
  }, [teamId, getTeamInfo]);

  useEffect(() => {
    if (team && team?.team_info?.submission) {
      setSubmissionData({
        videoUrl: team?.team_info?.submission.video_url,
        frontendRepo: team?.team_info?.submission.resources_links.split(',')[0],
        backendRepo: team?.team_info?.submission.resources_links.split(',')[1],
      });
    }
  }, [team]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmissionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // call the update function, but first we create a data object,that has the submission_id and the video_ur
    // the resources are concatinated and seperated between a comma
    const data = {
      submissionId: team.team_info.submission.id,
      videoUrl: submissionData.videoUrl,
      resourcesLinks: `${submissionData.frontendRepo},${submissionData.backendRepo}`,
    };
    await updateSubmission(data);
    setIsEditing(false);
  };

  const handleSubmit = () => {
    const data = {
      teamId: teamId,
      challengeId: team.team_info.challenge.id,
      videoUrl: submissionData.videoUrl,
      resourcesLinks: `${submissionData.frontendRepo},${submissionData.backendRepo}`,
    };
    console.log(data);
    submit(data);
  };

  const handleDelete = async () => {
    console.log(team.team_info.submission.id);
    try {
      await deleteSubmission(team.team_info.submission.id);
      setSubmissionData({
        videoUrl: '',
        frontendRepo: '',
        backendRepo: '',
      }); 
    }catch (err) {
      console.error(err);
    }
  };


  if (!team || !team?.team_info?.members?.length) {
    return (
      <div className="loader-container flex justify-center items-center h-96">
        <Loader className="size-5 animate-spin" />
      </div>
    );
  }


  let parsedUser;

  try {
    parsedUser = JSON.parse(user);
  } catch (error) {
    console.error('Failed to parse user JSON:', error);
  }


  return (
    <div className="bg-base-200 min-h-screen  py-10">
      <div className="min-h-screen pt-20">
        {team.team_info?.challenge && (
          <div className="max-w-2xl mx-auto p-4 py-8">

            <div className="bg-base-300 rounded-xl p-6 space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold">Submission Details</h1>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                </div>
              </div>
              {/* user info section */}
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-5m text-zinc-400 flex items-center gap-2">
                    <ShieldHalf className="w-4 h-4" />
                    team Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{team.team_info.team_name}</p>
                </div>


                <div className="contaner-names flex gap-4 min-w-full justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-5m text-zinc-400 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Url of the Demo
                    </div>
                    <input
                      type="text"
                      name="videoUrl"
                      value={submissionData.videoUrl || ''}
                      onChange={handleChange}
                      disabled={!isEditing && team?.team_info?.submission}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    />
                  </div>

                </div>
                <div className="contaner-names flex gap-4 min-w-full justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-5m text-zinc-400 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      github frontend repo
                    </div>
                    <input
                      type="text"
                      name="frontendRepo"
                      value={submissionData.frontendRepo || ''}
                      onChange={handleChange}
                      disabled={!isEditing && team?.team_info?.submission}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    />
                  </div>

                </div>
                <div className="contaner-names flex gap-4 min-w-full justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-5m text-zinc-400 flex items-center gap-2">
                      <Link className="w-4 h-4" />
                      github backend repo
                    </div>
                    <input
                      type="text"
                      name="backendRepo"
                      value={submissionData.backendRepo || ''}
                      onChange={handleChange}
                      disabled={!isEditing && team?.team_info?.submission}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    />
                  </div>

                </div>
              </div>
              {team?.team_info.team_leader === parsedUser.username && (
                <div className="root-container">
                  <div className="flex justify-end space-x-4 mt-6">
                    {team?.team_info?.submission ? (
                      isEditing ? (
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          {isUpdating ? (
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
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="size-5 animate-spin" />
                          </>
                        ) : (
                          "Submit"
                        )}
                      </button>

                    )}
                    <div className="btn-container">
                      {team?.team_info?.submission && (
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                          {isDeleting ? (
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
        )}
        {!team.team_info.challenge && (
          <h1>there is no challenge assigned to the team for now, please try again</h1>
        )}

      </div>
    </div>
  );
};

export default SubmissionPage;