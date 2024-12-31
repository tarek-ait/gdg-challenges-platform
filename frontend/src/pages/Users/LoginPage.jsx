import AdminShowLogin from "../../components/AdminShowLogin";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";


const LoginPage = () => {
  // for the signup page, the data we will need is this, the username and the password
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const { login, isLoginIn } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const validateDataForm = () => {
    if (formData.userName.length === 0) {
      toast.error("user name is required");
      return false;
    }
    if (formData.password.length === 0) {
      toast.error("Password is required");
      return false;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataValidated = validateDataForm();
    if (dataValidated) {
      login(formData);
    }
  }


  const useAuth = false;
  return (
    <div className="grid min-h-screen py-10">
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
                <span className="label-text font-medium">User Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-5 text-base-content/40"></Mail>
                </div>
                <input type="text"
                  className={`input input-bordered w-full pl-12 ${formData.userName.length > 0 ? 'input-success' : ''}`}
                  placeholder="user name"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
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

            <button type="submit" className="btn btn-primary w-full" disabled={isLoginIn}>
              {isLoginIn ? (
                <>
                  <Loader className="size-5 animate-spin">
                    loading...
                  </Loader>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/50">
              You don&apos;t have an account?, try to create one&nbsp;&nbsp;{""}
              <Link to="/signup" className="link link-primary">
                Signup</Link>
            </p>
          </div>
        </div>
      </div>
      {!useAuth && (
        <div className="container">
          <AdminShowLogin className="my-10" />
        </div>

      )}
    </div>

  )
}

export default LoginPage
