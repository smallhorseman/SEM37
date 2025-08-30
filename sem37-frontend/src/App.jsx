import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Get the token from our AuthContext
  const { token } = useAuth();

  return (
    <div>
      {/* If a token exists, the user is logged in. Show the Dashboard. */}
      {/* If not, show the Login page. */}
      {token ? <DashboardPage /> : <LoginPage />}
    </div>
  );
}

export default App;