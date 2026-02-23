import AppRoutes from './routes/AppRoutes.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  
  useEffect(() => {
    // ensure auth checked once on mount / when checkAuth changes
    checkAuth();

    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [checkAuth, theme]);

  if (isCheckingAuth && !authUser) {
    return <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" />

    </div>;
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <AppRoutes />
      <Toaster />
    </div>
  )
}

export default App

