'use client';

import React from 'react';
import { useAuthLoading } from '@/hooks/useAuthLoading';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface AuthLoadingWrapperProps {
  children: React.ReactNode;
}

const AuthLoadingWrapper: React.FC<AuthLoadingWrapperProps> = ({ children }) => {
  const { isAuthLoading, isSignedIn } = useAuthLoading();

  const getLoadingMessage = () => {
    if (isSignedIn) {
      return 'Entrando na sua conta...';
    }
    return 'Carregando...';
  };

  return (
    <>
      {children}
      <LoadingOverlay 
        isVisible={isAuthLoading} 
        message={getLoadingMessage()}
      />
    </>
  );
};

export default AuthLoadingWrapper;