import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')!).render(
  
   <Auth0Provider
    domain="dev-k0mgwch8co155cww.us.auth0.com"
    clientId="eBmYz44mc5PPyYXYs2M47m0jDuMEWMUO"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);
