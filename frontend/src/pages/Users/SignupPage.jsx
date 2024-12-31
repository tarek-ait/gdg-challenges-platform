
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
const SignupPage = () => {
  // here are the data form for the user 
  // fields = ['id', 'username', 'email', 'firstName', 'lastName', 'password', 'is_staff', 'user_profile'] + the phone number and the team id, the id is created by default 

  const { signup, isSigninup } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
  })

  //  validating the data from the user, all fields are required and the password must b at least 6 characters, with the toast notifications for each field of the formData
  const validateDataForm = () => {
    if (formData.username.length === 0) {
      toast.error("Username is required")
      return false
    }
    if (formData.email.length === 0) {
      toast.error("Email is required")
      return false
    }
    if (formData.firstName.length === 0) {
      toast.error("First Name is required")
      return false
    }
    if (formData.lastName.length === 0) {
      toast.error("Last Name is required")
      return false
    }
    // for the phone number
    if (formData.phoneNumber.length === 0) {
      toast.error("Phone Number is required")
      return false
    }

    if (formData.password.length === 0) {
      toast.error("Password is required")
      return false
    }

    // adding more checks to the email, the pattern of the email

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataValidated = validateDataForm();
    if (dataValidated) {
      console.log(formData)
      signup(formData)
    }
  }



  return (
    <div className="min-h-screen py-10 grid">
      <div className="flex flex-col justify-center items-center p-6 smp">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                <h2 className="size-6 text-primary flex justify-center">
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
                  <User className="size-5 text-base-content/40"></User>
                </div>
                <input type="text"
                  className={`input input-bordered w-full pl-12 ${formData.username > 0 ? 'input-success' : ''}`}
                  placeholder="user name"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>
            <div className="form-cotrol">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="size-5 text-base-content/40"></Mail>
                </div>
                <input type="email"
                  className={`input input-bordered w-full pl-12 ${formData.email.length > 0 ? 'input-success' : ''}`}
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-cotrol flex space-x-4">
              <div className="first">
                <label className="label">
                  <span className="label-text font-medium">First Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="size-5 text-base-content/40"></User>
                  </div>
                  <input type="text"
                    className={`input input-bordered w-full pl-12 ${formData.firstName > 0 ? 'input-success' : ''}`}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
              </div>
              <div className="second">
                <label className="label">
                  <span className="label-text font-medium">Last Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="size-5 text-base-content/40"></User>
                  </div>
                  <input type="text"
                    className={`input input-bordered w-full pl-12 ${formData.lastName > 0 ? 'input-success' : ''}`}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            {/* how to remove the default increment and decrement? */}

            <div className="form-cotrol">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="size-5 text-base-content/40"></User>
                </div>
                <input type='number'
                  className={`input contrast-more:opacity-100 input-bordered w-full pl-12 ${formData.phoneNumber > 0 ? 'input-success' : ''}`}
                  placeholder="ex: 0675076942"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  style={{
                    opacity: '0.5',
                  }}
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

            <button type="submit" className="btn btn-primary w-full" disabled={isSigninup} >
              {isSigninup ? (
                <>
                  <Loader className="size-5 animate-spin"> </Loader>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

         
          <div className="text-center">
            <p className="text-base-content/50">
              Already have an account?&nbsp;&nbsp;{""}
              <Link to="/login" className="link link-primary">
                Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
