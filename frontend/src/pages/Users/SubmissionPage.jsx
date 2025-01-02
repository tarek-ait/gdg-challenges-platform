import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useTeamsStore } from '../../store/useTeamsStore';
import { Loader, ShieldHalf, Video, Link } from 'lucide-react';


const SubmissionPage = () => {
  const { user, teamId } = useAuthStore();
  const { team, getTeamInfo } = useTeamsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [submissionData, setSubmissionData] = useState({});

  // If the team has an assigned challenge, then we get the challenge from the challenges array

  useEffect(() => {
    async function fetchData() {
      await getTeamInfo(teamId);
    }

    fetchData();


  }, [teamId,  getTeamInfo]);

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

  const handleSave = () => {
    // Update the submission data in the team object or make an API call to save the changes
    setIsEditing(false);
  };

  console.log('Team data:', team);

  if (!team || !team?.team_info?.members?.length) {
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
          {team.team_info?.submission && (
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
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{ }</p>
                </div>


                <div className="contaner-names flex gap-4 min-w-full justify-between">
                  <div className="space-y-1.5 flex-1">
                    <div className="text-5m text-zinc-400 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video Url of the Demo
                    </div>
                    <input
                      type="text"
                      name="video_url"
                      value={submissionData.video_url || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                      name="video_url"
                      value={submissionData.frontendRepo || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                      name="video_url"
                      value={submissionData.backendRepo || ''}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                    />
                  </div>

                </div>
              </div>
              {team?.team_leader?.username === user?.username && (
                <div className="flex justify-end space-x-4 mt-6">
                  {isEditing ? (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit Submission
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
          {!team.team_info.submission && (
            <h1>there is no challenge assigned to the team for now, please try again</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionPage;