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
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Home
            </span>
          </Typography>
          {isAuthenticated ? (
            <Button color="inherit" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
              Log Out
            </Button>
          ) : (
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;