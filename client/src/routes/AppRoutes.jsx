import SignUpPage from '../pages/SignUpPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import { Routes,Route } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <div>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    </div>
  )
}

export default AppRoutes