import './App.css';
import { useState, useEffect } from 'react';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useChatState } from './useChatState.js';
import { AuthProvider, AuthContext } from "./AuthContext.jsx";
import { Login } from "./Login.jsx";
import { Signup } from "./Signup.jsx";
import { useContext } from 'react';

function AppContent() {
  const { user } = useContext(AuthContext);
  const [authMode, setAuthMode] = useState("login");
  const [showAuth, setShowAuth] = useState(false);
  const providerValues = useChatState();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  if (showAuth && !user) {
    return authMode === "login" ? (
      <Login onSwitchToSignup={() => setAuthMode("signup")} />
    ) : (
      <Signup onSwitchToLogin={() => setAuthMode("login")} />
    );
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar user={user} onLoginClick={() => setShowAuth(true)} />
        <ChatWindow user={user} onLoginClick={() => setShowAuth(true)} />
      </MyContext.Provider>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;