import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FloatingLogoutButton } from '../components/FloatingLogoutButton';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  logoutPosition?: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, logoutPosition = 'bottom-right' }) => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children}
      <FloatingLogoutButton position={logoutPosition} />
    </>
  );
};

