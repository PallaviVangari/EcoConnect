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

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-13zg1l1k707oxy8x.us.auth0.com"
            clientId="ZD0KOl9ok3YfDxWU0DiYGYxVUZOJauiy"
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
            useRefreshTokens={false}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
);
