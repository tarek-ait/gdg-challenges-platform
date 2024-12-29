import AdminShowLogin from "../../components/AdminShowLogin";

const LoginPage = () => {
  const useAuth = false;
  return (
    <div className="bg-base-200 min-h-screen">
      this is the login page for the regular use
      {!useAuth && (
        <AdminShowLogin />
      )}
    </div>
  )
}

export default LoginPage
