'use client';

import { useAuth } from '@clerk/nextjs';
import { useState, useCallback } from 'react';
import { clerkApiService } from '@/services/ClerkApiService';

/**
 * Hook customizado para facilitar o uso do ClerkApiService
 */
export const useClerkApi = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Wrapper para fazer requisições autenticadas
   */
  const makeRequest = useCallback(async <T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      headers?: Record<string, string>;
      template?: string;
    } = {}
  ): Promise<T | null> => {
    if (!isLoaded || !isSignedIn) {
      setError('Usuário não autenticado');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await clerkApiService.makeAuthenticatedRequest<T>(endpoint, {
        ...options,
        getToken,
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isLoaded, isSignedIn]);

  /**
   * Envia dados do perfil
   */
  const sendProfile = useCallback(async (profileData: any) => {
    return makeRequest('/profile', {
      method: 'POST',
      body: profileData,
    });
  }, [makeRequest]);

  /**
   * Registra usuário na API externa
   */
  const registerUser = useCallback(async (userData: any) => {
    return makeRequest('/users/register', {
      method: 'POST',
      body: userData,
    });
  }, [makeRequest]);

  /**
   * Sincroniza dados do usuário
   */
  const syncUserData = useCallback(async () => {
    return makeRequest('/users/sync', {
      method: 'POST',
    });
  }, [makeRequest]);

  /**
   * Atualiza dados do usuário
   */
  const updateUser = useCallback(async (userId: string, userData: any) => {
    return makeRequest(`/users/${userId}`, {
      method: 'PUT',
      body: userData,
    });
  }, [makeRequest]);

  /**
   * Obtém dados do usuário
   */
  const getUser = useCallback(async (userId: string) => {
    return makeRequest(`/users/${userId}`, {
      method: 'GET',
    });
  }, [makeRequest]);

  /**
   * Obtém o token atual (útil para uso direto)
   */
  const getCurrentToken = useCallback(async (template: string = 'default') => {
    if (!isLoaded || !isSignedIn) {
      return null;
    }
    return await getToken({ template });
  }, [getToken, isLoaded, isSignedIn]);

  return {
    // Estados
    isLoading,
    error,
    isAuthenticated: isLoaded && isSignedIn,
    
    // Métodos genéricos
    makeRequest,
    getCurrentToken,
    
    // Métodos específicos
    sendProfile,
    registerUser,
    syncUserData,
    updateUser,
    getUser,
    
    // Utilitários
    clearError: () => setError(null),
  };
};