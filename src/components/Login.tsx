import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';

const Login: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    const usersString = localStorage.getItem('users');
    const users: { username: string, password: string }[] = usersString ? JSON.parse(usersString) : [];

    // Verifica usuário e senha
    if (users.find(user => user.username === username && user.password === password)) {
      localStorage.setItem('loggedIn', 'true');
      onLogin(username);
    }else {
      setError('Nome de usuário ou senha incorretos');
      console.log('teste', storedUsername, storedPassword);
    }

  };

  const handleRedirect = (e: { preventDefault: () => void; }) => {
    e.preventDefault(); // Impede o comportamento padrão do link (recarregar a página)
    const url = '/register'; // Especifique a URL para a qual deseja redirecionar
    window.location.href = url; // Redireciona para a URL especificada
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p>{error}</p>}
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Sign In
        </Button>
        <a href="/registrar" onClick={handleRedirect}>Registrar-se</a>
      </Grid>
    </Grid>
  );
};

export default Login;
