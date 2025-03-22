import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmissionsStore } from '../../store/useSubmissionsStore';

const SubmissionAdminPrePage = () => {
  const navigate = useNavigate();
  const { getSubmissions, submissions, loading } = useSubmissionsStore();

  useEffect(() => {
    getSubmissions();
  }, []);

  return (
    <div className="bg-base-200 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submissions Overview</h1>

        {loading ? (
          <div className="text-center">Loading submissions...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <div key={submission.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Team {submission.team_id}</h2>
                  <p>Challenge ID: {submission.challenge_id}</p>
                  <p>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/admin/submissions/${submission.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionAdminPrePage;