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

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setIsRedirecting(true);
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || isRedirecting) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
