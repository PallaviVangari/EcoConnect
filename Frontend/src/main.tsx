// // import { StrictMode } from 'react';
// // import { createRoot } from 'react-dom/client';
// // import App from './App.tsx';
// // import './index.css';
// //
// //
// // createRoot(document.getElementById('root')!).render(
// //   <StrictMode>
// //     <App />
// //   </StrictMode>
// // );
//
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Auth0Provider } from '@auth0/auth0-react';
// import App from './App';
//
// const domain = import.meta.env.VITE_AUTH0_DOMAIN;
// const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
// const redirectUri = window.location.origin;
//
// ReactDOM.createRoot(document.getElementById('root')!).render(
//     <React.StrictMode>
//         <Auth0Provider
//             domain={domain}
//             clientId={clientId}
//             authorizationParams={{ redirect_uri: redirectUri }}
//         >
//             <App />
//         </Auth0Provider>
//     </React.StrictMode>
// );
//

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import RegisterUser from "./pages/RegisterUser";
import './index.css'

// Development mode - bypass Auth0 completely
const DEV_MODE = true;

// Create a mock Auth0 context if your app uses Auth0 hooks
const MockAuth0Context = React.createContext({
  isAuthenticated: true,
  user: {
    name: "Test User",
    email: "test@example.com",
    // Add other user properties your app needs
  },
  loginWithRedirect: () => console.log("Mock login called"),
  logout: () => console.log("Mock logout called"),
  getAccessTokenSilently: async () => "mock-token"
});

// Export the hook for use in components
export const useAuth0 = () => React.useContext(MockAuth0Context);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {DEV_MODE ? (
      // Provide mock Auth0 context in development
      <MockAuth0Context.Provider
        value={{
          isAuthenticated: true,
          user: {
            name: "Test User",
            email: "test@example.com"
          },
          loginWithRedirect: () => console.log("Mock login called"),
          logout: () => console.log("Mock logout called"),
          getAccessTokenSilently: async () => "mock-token"
        }}
      >
        <App />
      </MockAuth0Context.Provider>
    ) : (
      // Use real Auth0 in production
      <Auth0Provider
        domain="dev-13zg1l1k707oxy8x.us.auth0.com"
        clientId="ZD0KOl9ok3YfDxWU0DiYGYxVUZOJauiy"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
    )}
  </React.StrictMode>,
);
