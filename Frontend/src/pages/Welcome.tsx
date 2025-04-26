import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export function Welcome() {
    const { isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login'); // Navigate to /login route to start Auth0 login
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
            <h1>Welcome to My Website</h1>
            {isAuthenticated ? (
                <div>
                    <p>Welcome {user?.name || "User"}!</p>
                    <p>Explore the features of our platform.</p>
                </div>
            ) : (
                <button onClick={handleLoginClick} style={{ marginTop: '2rem', padding: '1rem 2rem' }}>
                    Login
                </button>
            )}
        </div>
    );
}
