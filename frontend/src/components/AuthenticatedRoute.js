import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Auth from '../contexts/Auth';

function AuthenticatedRoute() {
  const { isAuthenticated } = useContext(Auth);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default AuthenticatedRoute;
