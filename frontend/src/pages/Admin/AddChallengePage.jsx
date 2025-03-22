import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallengesStore } from '../../store/useChallengesStore';
import { Target, FileText, Link, Tag, Loader } from 'lucide-react';

const AddChallengePage = () => {
  const navigate = useNavigate();
  const { addChallenge, isCreatingChallenge } = useChallengesStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resources: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addChallenge(formData);
      navigate('/admin/challenges');
    } catch (error) {
      console.error('Failed to add challenge:', error);
    }
  };

  return (
    <div className="bg-base-200 min-h-screen py-10">
      <div className="min-h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold">Add New Challenge</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Title
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Category
                </div>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows="4"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-5m text-zinc-400 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Resources
                </div>
                <textarea
                  name="resources"
                  value={formData.resources}
                  onChange={handleChange}
                  className="textarea textarea-bordered w-full"
                  rows="3"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/challenges')}
                  className="btn btn-ghost"
                  disabled={isCreatingChallenge}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingChallenge}
                  className="btn btn-primary"
                >
                  {isCreatingChallenge ? (
                    <div className="flex items-center gap-2">
                      <Loader className="size-4 animate-spin" />
                      Adding...
                    </div>
                  ) : (
                    'Add Challenge'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddChallengePage;