import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface NavbarProps {
  onHomeClick?: () => void;
  onLoginClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onLoginClick }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          {/* Home (Left Side) */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={onHomeClick}
          >
            Home
          </Typography>

          {/* Login (Right Side) */}
          <Button color="inherit" onClick={onLoginClick}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
