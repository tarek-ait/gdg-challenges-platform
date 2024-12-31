import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTeamsStore } from'../../store/useTeamsStore.js'; // Adjust the import path as necessary
import { toast } from 'react-hot-toast';
import { ShieldHalf, Lock, Eye, EyeOff, Loader } from 'lucide-react'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';
const JoinTeamPage = () => {
    const [formData, setFormData] = useState({
        teamName: "",
        password: "",
    })

    const navigate = useNavigate();

    const { joinTeam, isJoiningTeam } = useTeamsStore();

    const [showPassword, setShowPassword] = useState(false);
    const validateDataForm = (dataForm) => {
        if (dataForm.teamName.length === 0) {
            toast.error("Team name is required");
            return false;
        }
        if (dataForm.password.length === 0) {
            toast.error("Password is required");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataValidated = validateDataForm(formData);
        if (dataValidated) {
            joinTeam(formData,navigate);
        }
    }


    return (
        <div className="grid min-h-screen z-50 py-10">
            {/* Left side */}
            <div className="flex flex-col justify-center items-center p-6 smp">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-primary/10   flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                                <h2 className="size-6 text-primary flex text-center items-center justify-center">
                                    GDG
                                </h2>
                            </div>
                        </div>
                    </div>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-cotrol">
                            <label className="label">
                                <span className="label-text font-medium">Team Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <ShieldHalf  className="size-5 text-base-content/40" />
                                </div>
                                <input type="text"
                                    className={`input input-bordered w-full pl-12 ${formData.teamName > 0 ? 'input-success' : ''}`}
                                    placeholder="team name"
                                    value={formData.teamName}
                                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-cotrol">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <Lock className="size-5 text-base-content/40"></Lock>
                                </div>
                                <input type={showPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="size-5 text-base-content/40"></EyeOff> : <Eye className="size-5 text-base-content/40"></Eye>}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full" disabled={isJoiningTeam}>
                            {isJoiningTeam ? (
                                <>
                                    <Loader className="size-5 animate-spin">
                                        loading...
                                    </Loader>
                                </>
                            ) : (
                                "Join Team"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/50">
                            You don&apos;t have an team?, create one!&nbsp;&nbsp;{""}
                            <Link to="/create-team" className="link link-primary">
                                Create a team</Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default JoinTeamPage
