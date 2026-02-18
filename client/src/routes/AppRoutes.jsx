import React from 'react'
import SignUpPage from '../pages/SignUpPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import { Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <div>
        <Routes>
          <Routes path="/" element={<HomePage/>} />
          <Routes path="/signup" element={<SignUpPage />} />
          <Routes path="/login" element={<LoginPage />} />
          <Routes path="/settings" element={<SettingsPage />} />
          <Routes path="/profile" element={<ProfilePage />} />
        </Routes>
    </div>
  )
}

export default AppRoutes