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

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  // Temporarily bypass authentication
  return <>{children}</>;
};
