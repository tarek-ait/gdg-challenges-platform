
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
// importing the navigation bar 
import NavBar from './components/NavBar.jsx'

function App() {


  return (
    <Router>
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/teams" element={<TeamsPage />} />
        <Route path="/admin/submissions" element={<SubmissionsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/add-challenge" element={<AddChallenge />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/submission" element={<SubmissionPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/challenge-preview" element={<ChallengePreviewPage />} />
      </Routes>
    </>
  </Router>

  )
}

export default App
