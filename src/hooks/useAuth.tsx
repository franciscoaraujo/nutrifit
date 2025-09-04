'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserService } from '@/services/UserService';
import { localStorageService } from '@/services/LocalStorageService';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const checkAuth = () => {
      try {
        const currentUserId = localStorageService.getCurrentUserId();
        
        if (currentUserId) {
          const userData = localStorageService.getUserData(currentUserId);
          if (userData) {
            setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email
            });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await UserService.login(email, password);
      
      if (response.success && response.data) {
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }): Promise<boolean> => {
    try {
      console.log('Iniciando registro para:', userData.email);
      
      // Validações básicas
      if (!userData.name || !userData.email || !userData.password) {
        console.error('Dados incompletos para registro');
        return false;
      }
      
      if (userData.password.length < 6) {
        console.error('Senha muito curta');
        return false;
      }
      
      const response = await UserService.register(userData);
      
      if (response.success && response.data) {
        setUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email
        });
        
        console.log('Registro concluído com sucesso');
        return true;
      }
      
      console.error('Falha no registro:', response.error);
      return false;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      UserService.logout();
      setUser(null);
      router.push('/'); // Redirecionar para a página inicial
    } catch (error) {
      console.error('Erro no logout:', error);
      setUser(null); // Limpar estado mesmo com erro
      router.push('/'); // Redirecionar mesmo com erro
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};