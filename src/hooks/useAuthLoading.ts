'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export const useAuthLoading = () => {
  const { isLoaded, isSignedIn } = useUser();
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [previousSignedInState, setPreviousSignedInState] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      setIsAuthLoading(true);
      return;
    }

    // Se o usuário acabou de fazer login (transição de não logado para logado)
    if (previousSignedInState === false && isSignedIn === true) {
      setIsAuthLoading(true);
      // Simula um delay para uma transição mais suave
      const timer = setTimeout(() => {
        setIsAuthLoading(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }

    // Se o usuário acabou de fazer logout (transição de logado para não logado)
    if (previousSignedInState === true && isSignedIn === false) {
      setIsAuthLoading(true);
      const timer = setTimeout(() => {
        setIsAuthLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }

    // Atualiza o estado anterior
    if (previousSignedInState !== isSignedIn) {
      setPreviousSignedInState(isSignedIn);
    }

    // Se não há transição, remove o loading
    if (isLoaded && previousSignedInState === isSignedIn) {
      setIsAuthLoading(false);
    }
  }, [isLoaded, isSignedIn, previousSignedInState]);

  return {
    isAuthLoading,
    isLoaded,
    isSignedIn
  };
};