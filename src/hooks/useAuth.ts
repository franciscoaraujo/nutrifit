'use client';

import { useAuth } from '@clerk/nextjs';
import { useState, useCallback } from 'react';

/**
 * Hook simples para autenticação com Clerk e envio de dados para API externa
 */
export const useAuthApi = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Envia dados do perfil para API externa
   */
  const sendProfile = useCallback(async (profileData: any) => {
    console.log('=== TESTE: sendProfile chamado ===');
    console.log('Profile Data:', profileData);
    console.log('isLoaded:', isLoaded);
    console.log('isSignedIn:', isSignedIn);
    console.log('userId:', userId);

    if (!isLoaded || !isSignedIn || !userId) {
      console.log('=== TESTE: Usuário não autenticado ou userId não disponível ===');
      setError('Usuário não autenticado ou userId não disponível');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const baseApiUrl = '/api/proxy/nutrifit/api/v1/clientes';
      const endpoint = '/cadastrar';
      
      // Configurar headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      };

      // Log detalhado do JSON sendo enviado
      console.log('=== DADOS COMPLETOS SENDO ENVIADOS ===');
      console.log('Endpoint____:', `${baseApiUrl}${endpoint}`);
      console.log('Method: POST');
      console.log('Headers:', requestHeaders);
      console.log('Body (JSON):', JSON.stringify(profileData, null, 2));
      console.log('UserId no header:', requestHeaders['X-User-Id']);

      // Fazer a requisição
      console.log('=== ENVIANDO REQUISIÇÃO ===');
      const response = await fetch(`${baseApiUrl}${endpoint}`, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(profileData),
      });

      console.log('=== RESPOSTA RECEBIDA ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.text();
        console.log('=== ERRO NA API ===');
        console.log('Error Data:', errorData);
        throw new Error(`Erro na API: ${response.status} - ${errorData}`);
      }

      // Tentar ler como JSON, se falhar, ler como texto
      let responseData;
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }
      } catch (parseError) {
        // Se falhar ao fazer parse do JSON, tenta como texto
        responseData = await response.text();
        console.log('=== AVISO: Resposta não é JSON válido, lendo como texto ===');
      }
      
      console.log('=== DADOS DA RESPOSTA ===');
      console.log('Content-Type:', contentType);
      console.log('Response Data:', responseData);
      console.log('=== TESTE: sendProfile resultado ===', responseData);
      
      return responseData;
    } catch (err) {
      console.log('=== TESTE: Erro no sendProfile ===', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoaded, isSignedIn]);

  return {
    // Estados
    isLoading,
    error,
    isAuthenticated: isLoaded && isSignedIn,
    userId,
    
    // Métodos
    sendProfile,
    
    // Utilitários
    clearError: () => setError(null),
  };
};