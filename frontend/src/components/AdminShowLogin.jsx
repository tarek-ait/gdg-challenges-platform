import { Link } from "react-router-dom"

const AdminShowLogin = () => {
  return (
    <div className="card bg-neutral text-neutral-content w-80 absolute bottom-0 left-10 opacity-25">
      <div className="card-body items-center text-center">
      <h2 className="card-title">Admin!</h2>
        <div className="card-actions justify-end py-5">
          <Link className="btn btn-primary" to="/admin/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminShowLogin
