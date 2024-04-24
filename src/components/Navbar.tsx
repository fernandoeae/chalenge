import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface NavbarProps {
  username: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ username, onLogout }) => {
  return (
    <AppBar position="fixed"> {/* Alterei a posição para "fixed" */}
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}> {/* Este Box garante que o espaço restante seja preenchido */}
          <Typography variant="h6" component="div">
            Bem vindo, {username}!
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
