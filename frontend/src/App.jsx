
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UsersPage from './pages/Admin/UsersPage.jsx'
import TeamsPage from './pages/Admin/TeamsPage.jsx'
import SubmissionsPage from './pages/Admin/SubmissionsPage.jsx'
import AdminLoginPage from './pages/Admin/AdminLoginPage.jsx'
import AddChallenge from './pages/Admin/AddChallenge.jsx'
import ProfilePage from './pages/Users/ProfilePage.jsx'
import TeamPage from './pages/Users/TeamPage.jsx'
import SubmissionPage from './pages/Users/SubmissionPage.jsx'
import SignupPage from './pages/Users/SignupPage.jsx'
import LoginPage from './pages/Users/LoginPage.jsx'
import ChallengesPage from './pages/Users/ChallengesPage.jsx'
import ChallengePreviewPage from './pages/Users/ChallengePreviewPage.jsx'
import HomePage from './pages/HomePage.jsx'
import { Toaster } from 'react-hot-toast'
import { Loader } from 'lucide-react'
// importing the navigation bar 
import NavBar from './components/NavBar.jsx'
import { useAuthStore } from '../src/store/useAuthStore.js';
import { useTeamsStore } from './store/useTeamsStore.js';
import { useEffect } from 'react'
import JoinTeamPage from './pages/Users/JoinTeamPage.jsx'
import CreatTeamPage from './pages/Users/CreateTeamPage.jsx'

function App() {

  const { user,  checkAuth, isCheckingAuth } = useAuthStore();
  const { team} = useTeamsStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth, user]);



  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }



  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <Toaster />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/users" element={user ? <UsersPage /> : <Navigate to="/login" />} />
            <Route path="/admin/teams" element={user ? <TeamsPage /> : <Navigate to="/login" />} />
            <Route path="/admin/submissions" element={user ? <SubmissionsPage /> : <Navigate to="/login" />} />
            <Route path="/admin/login" element={!user ? <AdminLoginPage /> : <Navigate to="/" />} />
            <Route path="/admin/add-challenge" element={user ? <AddChallenge /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route
              path="/team/:teamId"
              element={
                user ? (
                  team ? (
                    <TeamPage />
                  ) : (
                    <Navigate to="/join-team" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/submission" element={
                user ? (
                  team ? (
                    <SubmissionPage />
                  ) : (
                    <Navigate to="/join-team" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              } />
            <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/join-team" element={user && !team ? <JoinTeamPage /> : <Navigate to="/login" />} />
            <Route path="/create-team" element={user && !team ? <CreatTeamPage /> : <Navigate to="/login" />} />
            <Route path="/challenges" element={user ? <ChallengesPage /> : <Navigate to="/login" />} />
            <Route path="/challenge-preview/:id" element={user ? <ChallengePreviewPage /> : <Navigate to="/login" />} />
          </Routes>
        </div>


      </div>

    </Router>

  )
}

export default App
