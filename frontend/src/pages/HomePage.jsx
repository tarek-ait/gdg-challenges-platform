import { Link } from "react-router-dom"
import { useAuthStore } from "../store/useAuthStore"

const HomePage = () => {

  const { user } = useAuthStore();

  return (
    <div className="hero bg-base-200 py-10 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there!</h1>
          <p className="py-6 ">
            Welcome to the GDG-Algiers Challenges platform, and congratulations on participating in the hackathon!
            we are glad to have you here with us, please sign in with your account and if you dont have one,
            WHAT ARE YOU WAITING TO CREATE ONE!
          </p>
          {!user &&
            <Link to="/login">
              <button className="btn btn-primary">Sign in!</button>
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

export default HomePage
