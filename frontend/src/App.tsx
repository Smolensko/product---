import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Index from './pages/Index';
import Login from './components/custom/Login';
import Signup from './components/custom/Signup';
import Profile from './components/custom/Profile';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#a72323' }} />
          <span className="text-sm" style={{ color: '#6B5744', fontFamily: 'Noto Sans SC, sans-serif' }}>华史通鉴加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  </HashRouter>
);

export default App;
