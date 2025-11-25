import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: '#333333',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          border: '1px solid rgba(0,0,0,0.15)',
        }}
      >




        <Toolbar>
          <img
            src="/cc.png"
            alt="Home"
            style={{
              height: "75px",
              cursor: "pointer"
            }}
            onClick={() => navigate('/')}
          />

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated ? (
            <Button
              sx={{ color: '#ffffff' }}
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </Button>

          ) : (
            <Button
            sx={{ color: '#ffffff' }} 
            onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
