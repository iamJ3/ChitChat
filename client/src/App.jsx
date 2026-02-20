import AppRoutes from './routes/AppRoutes.jsx'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

const App = () => {
  const {authUser, isCheckingAuth, checkAuth} = useAuthStore();

  useEffect(() => {
    
   checkAuth();
  }, [checkAuth]);

  console.log({authUser});
  if(isCheckingAuth && !authUser){
    return <div className="flex items-center justify-center h-screen">
     <Loader className="animate-spin" />
    
    </div>;
  }

  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  )
}

export default App

