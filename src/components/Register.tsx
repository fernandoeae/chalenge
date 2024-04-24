import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';

const Register: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleRegister = () => {
    if (!username || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    const usersString = localStorage.getItem('users');
    const users: { username: string, password: string }[] = usersString ? JSON.parse(usersString) : [];

    // Verifica se o nome de usuário já existe
    if (users.find(user => user.username === username)) {
      setError('Nome de usuário já existe');
      return;
    }

    // Adiciona o novo usuário à lista de usuários
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    // Registra o novo usuário
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', username);
    onLogin(username);
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item xs={12} sm={6} md={4}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <TextField label="Username" variant="outlined" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <TextField label="Confirm Password" type="password" variant="outlined" fullWidth margin="normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        {error && <p>{error}</p>}
        <Button variant="contained" color="secondary" fullWidth onClick={handleRegister}>
          Registrar
        </Button>
      </Grid>
    </Grid>
  );
};

export default Register;
