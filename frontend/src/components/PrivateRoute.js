// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // In a real application, you might also want to:
  // 1. Check if the token is still valid (not just if it exists).
  //    You could have a context/hook that manages authentication state
  //    and potentially validates the token on app load or specific actions.
  // 2. Handle refresh tokens if your auth system uses them.
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;