// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuthStore } from '../stores/authStore';
//
// interface AuthGuardProps {
//   children: React.ReactNode;
// }
//
// export function AuthGuard({ children }: AuthGuardProps) {
//   // Bypass authentication check for now
//   return <>{children}</>;
//
//   // Original authentication check (commented out)
//   /*
//   const { isAuthenticated } = useAuthStore();
//   const location = useLocation();
//
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
//
//   return <>{children}</>;
//   */
// }
//

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
