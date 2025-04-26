import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export function Login() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home'); // Already logged in → go to Home
        } else {
            loginWithRedirect(); // Not logged in → trigger Auth0 login
        }
    }, [isAuthenticated, loginWithRedirect, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h2>Redirecting to login...</h2>
        </div>
    );
}
