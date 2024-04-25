import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contacts';
import Navbar from './components/Navbar';
import ListContacts from './components/ListContacts';
import { useNavigate } from 'react-router-dom';

const isLoggedIn = () => {
  // Verificar se o usuário está logado (pode ser uma verificação em localStorage, por exemplo)
  return localStorage.getItem('loggedIn') === 'true';
};

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');

  const handleLogin = (username: string) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    setLoggedIn(true);
    setUsername(username);
  };

  

const handleLogout = () => {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  setLoggedIn(false);
  setUsername('');
  const navigate = useNavigate();
  navigate('/login');
};

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn() ? <Navigate to="/login" /> : <Login onLogin={handleLogin} />} />
        <Route path="/login" element={isLoggedIn() ? <Navigate to="/login" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn() ? <Navigate to="/register" /> : <Register onLogin={handleLogin} />} />
        <Route path="/ListContact" element={isLoggedIn() ? <ListContacts /> : <Login onLogin={handleLogin} />} />
        <Route path="/create" element={isLoggedIn() ? <Contact /> :<Login onLogin={handleLogin} />} />
      </Routes>
      <div>
      {loggedIn ? (
        <div>
         <Navbar username={username} onLogout={handleLogout} />
        </div>
      ) : (
        <a/>
      )}
      </div>
    </Router>

  );
};

export default App;
