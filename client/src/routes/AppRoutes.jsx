import SignUpPage from '../pages/SignUpPage.jsx'
import LoginPage from '../pages/LoginPage.jsx'
import Home from '../pages/Home.jsx'
import SettingsPage from '../pages/SettingsPage.jsx'
import ProfilePage from '../pages/ProfilePage.jsx'
import { Routes,Route } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore.js';
import { Navigate } from 'react-router-dom';

const AppRoutes = () => {
  const {authUser} = useAuthStore();
  return (
    <div>
        <Routes>
          <Route path="/" element={authUser ?<Home/> : <Navigate to='/login' />} />
          <Route path="/signup" element= { !authUser ? <SignUpPage /> : <Navigate to='/' /> } />
          <Route path="/login" element={ !authUser ? <LoginPage /> : <Navigate to='/' /> } />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser? <ProfilePage /> : <Navigate to ='/login' />} />
        </Routes>
    </div>
  )
}

export default AppRoutes