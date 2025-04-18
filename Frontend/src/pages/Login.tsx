import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    try {
      // Simulate authentication — replace with real authentication logic
      const fakeToken = 'example-auth-token';
      localStorage.setItem('token', fakeToken);  // Store the token

      // Redirect to the intended page (or home by default)
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
      <div>
        <h1>Login Page</h1>
        <button onClick={handleLogin}>Login</button>
      </div>
  );
};
