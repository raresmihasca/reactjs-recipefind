import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const CustomRoute = ({  roles }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.user);

  // Check if the user is logged in and has the required role
  const hasRequiredRole = isLoggedIn && roles.some((role) => currentUser.roles.includes(role));

  return hasRequiredRole ? <Outlet/> : <Navigate to="/"/>;
};

export default CustomRoute;