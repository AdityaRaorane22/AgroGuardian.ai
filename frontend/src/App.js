import { useState } from 'react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userData, setUserData] = useState(null);

  const styles = {
    app: {
      fontFamily: "'Poppins', sans-serif",
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundPattern: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
      `,
      zIndex: 1,
      pointerEvents: 'none'
    },
    container: {
      position: 'relative',
      zIndex: 2
    }
  };

  const handleLogin = (data) => {
    setUserData(data);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentPage('home');
  };

  return (
    <div style={styles.app}>
      <div style={styles.backgroundPattern}></div>
      <div style={styles.container}>
        {currentPage === 'home' ? (
          <HomePage onLogin={handleLogin} />
        ) : (
          <Dashboard userData={userData} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;