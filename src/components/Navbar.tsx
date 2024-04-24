import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

interface NavbarProps {
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          {/* Adicionando os links para Cadastro e Lista */}
          <Button color="inherit" component={Link} to="/create">
            Cadastro
          </Button>
          <Button color="inherit" component={Link} to="/listContact">
            Lista
          </Button>
        </Typography>
        <Box >
          <h2>Bem vindo, {username}</h2>
        </Box>
        <Box >
          <Button variant="contained" color="primary" onClick={onLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
