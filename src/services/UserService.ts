// Serviço para gerenciar operações relacionadas ao usuário e perfil

import { User, PerfilData, UserProfile, PerfilFormData, ApiResponse } from '@/types';
import { localStorageService } from './LocalStorageService';

export class UserService {
  private static instance: UserService;
  private baseUrl = '/api';

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // Métodos de autenticação
  static async register(userData: { name: string; email: string; password: string }): Promise<ApiResponse<User>> {
    try {
      // Limpar sessão do usuário anterior para garantir perfil limpo
      const currentUserId = localStorageService.getCurrentUserId();
      if (currentUserId) {
        localStorageService.clearUserData(currentUserId);
      }
      localStorageService.clearUserSession();
      
      // Verificar se o email já existe
      const existingUser = localStorageService.findUserByEmail(userData.email);
      
      if (existingUser) {
        return {
          success: false,
          error: 'Email já está em uso'
        };
      }
      
      // Criar novo usuário
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Salvar usuário
      const success = localStorageService.addUser(newUser);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao criar usuário'
        };
      }
      
      // Fazer login automático com perfil limpo
      localStorageService.setCurrentUserId(newUser.id);
      localStorageService.setUserData(newUser.id, newUser);
      
      return {
        success: true,
        data: newUser
      };
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return {
        success: false,
        error: 'Erro ao registrar usuário'
      };
    }
  }

  static async login(email: string, password: string): Promise<ApiResponse<User>> {
    try {
      const user = localStorageService.validateCredentials(email, password);
      
      if (!user) {
        return {
          success: false,
          error: 'Email ou senha inválidos'
        };
      }
      
      // Definir usuário atual
      localStorageService.setCurrentUserId(user.id);
      localStorageService.setUserData(user.id, user);
      
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return {
        success: false,
        error: 'Erro ao fazer login'
      };
    }
  }

  static async logout(): Promise<ApiResponse<boolean>> {
    try {
      localStorageService.removeItem('currentUserId');
      
      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return {
        success: false,
        error: 'Erro ao fazer logout'
      };
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      return !!currentUserId && localStorageService.userExists(currentUserId);
    } catch {
      return false;
    }
  }

  // Métodos para usuário
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const userData = localStorageService.getUserData(currentUserId);
      
      if (!userData) {
        return {
          success: false,
          error: 'Dados do usuário não encontrados'
        };
      }
      
      return {
        success: true,
        data: userData
      };
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      return {
        success: false,
        error: 'Erro ao buscar dados do usuário'
      };
    }
  }

  async updateUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const existingUserData = localStorageService.getUserData(currentUserId);
      
      if (!existingUserData) {
        return {
          success: false,
          error: 'Usuário não encontrado'
        };
      }
      
      const updatedUserData = {
        ...existingUserData,
        ...userData,
        updatedAt: new Date()
      };
      
      const success = localStorageService.setUserData(currentUserId, updatedUserData);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao salvar dados do usuário'
        };
      }
      
      // Atualizar também na lista de usuários
      localStorageService.addUser(updatedUserData);
      
      return {
        success: true,
        data: updatedUserData
      };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return {
        success: false,
        error: 'Erro ao atualizar dados do usuário'
      };
    }
  }

  // Buscar perfil do usuário
  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const profileData = localStorageService.getUserProfile(currentUserId);
      
      if (!profileData) {
        return {
          success: false,
          error: 'Perfil não encontrado'
        };
      }
      
      return {
        success: true,
        data: profileData
      };
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return {
        success: false,
        error: 'Erro ao buscar perfil do usuário'
      };
    }
  }

  async createProfile(profileData: PerfilFormData): Promise<ApiResponse<UserProfile>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const newProfile: UserProfile = {
        id: localStorageService.generateId(),
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: '',
        email: ''
      };
      
      const success = localStorageService.setUserProfile(currentUserId, newProfile);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao salvar perfil'
        };
      }
      
      return {
        success: true,
        data: newProfile
      };
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      return {
        success: false,
        error: 'Erro ao criar perfil'
      };
    }
  }

  async updateProfile(profileId: string, profileData: Partial<PerfilFormData>): Promise<ApiResponse<UserProfile>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const existingProfile = localStorageService.getUserProfile(currentUserId);
      
      if (!existingProfile) {
        return {
          success: false,
          error: 'Perfil não encontrado'
        };
      }
      
      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...profileData,
        updatedAt: new Date()
      };
      
      const success = localStorageService.setUserProfile(currentUserId, updatedProfile);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao salvar perfil'
        };
      }
      
      return {
        success: true,
        data: updatedProfile
      };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        error: 'Erro ao atualizar perfil'
      };
    }
  }

  // Upload de foto de perfil
  async uploadProfilePhoto(file: File): Promise<ApiResponse<{ photoUrl: string }>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      // Converter arquivo para base64 para armazenar no localStorage
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = () => {
          const photoUrl = reader.result as string;
          
          // Salvar a foto no localStorage
          const success = localStorageService.setItem(`fotoPerfil_${currentUserId}`, photoUrl);
          
          if (!success) {
            resolve({
              success: false,
              error: 'Erro ao salvar foto'
            });
            return;
          }
          
          resolve({
            success: true,
            data: { photoUrl }
          });
        };
        
        reader.onerror = () => {
          resolve({
            success: false,
            error: 'Erro ao processar arquivo'
          });
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      return {
        success: false,
        error: 'Erro ao fazer upload da foto'
      };
    }
  }

  // Métodos de validação
  validateProfileData(data: PerfilFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.sexo) {
      errors.push('Sexo é obrigatório');
    }

    if (!data.idade || (data.idade) < 1 || (data.idade) > 120) {
      errors.push('Idade deve estar entre 1 e 120 anos');
    }

    if (!data.altura || (data.altura) < 50 || (data.altura) > 250) {
      errors.push('Altura deve estar entre 50 e 250 cm');
    }

    if (!data.peso || (data.peso) < 20 || (data.peso) > 300) {
      errors.push('Peso deve estar entre 20 e 300 kg');
    }

    if (!data.objetivo) {
      errors.push('Objetivo é obrigatório');
    }

    if (!data.nivelAtividade) {
      errors.push('Nível de atividade é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validar dados do perfil
  async validateProfile(profileData: PerfilFormData): Promise<ApiResponse<{ isValid: boolean; errors?: string[] }>> {
    try {
      const errors: string[] = [];
      
      // Validações básicas
      if (!profileData.nome || profileData.nome.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
      }
      
      if (!profileData.idade || profileData.idade < 1 || profileData.idade > 120) {
        errors.push('Idade deve estar entre 1 e 120 anos');
      }
      
      if (!profileData.peso || profileData.peso < 1 || profileData.peso > 500) {
        errors.push('Peso deve estar entre 1 e 500 kg');
      }
      
      if (!profileData.altura || profileData.altura < 50 || profileData.altura > 250) {
        errors.push('Altura deve estar entre 50 e 250 cm');
      }
      
      if (!profileData.sexo || !['masculino', 'feminino'].includes(profileData.sexo)) {
        errors.push('Sexo deve ser masculino ou feminino');
      }
      
      if (!profileData.nivelAtividade || !['sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso'].includes(profileData.nivelAtividade)) {
        errors.push('Nível de atividade inválido');
      }
      
      if (!profileData.objetivo || !['perder_peso', 'manter_peso', 'ganhar_peso', 'ganhar_massa'].includes(profileData.objetivo)) {
        errors.push('Objetivo inválido');
      }
      
      const isValid = errors.length === 0;
      
      return {
        success: true,
        data: {
          isValid,
          errors: isValid ? undefined : errors
        }
      };
    } catch (error) {
      console.error('Erro ao validar perfil:', error);
      return {
        success: false,
        error: 'Erro ao validar perfil'
      };
    }
  }

  // Métodos utilitários
  calculateIMC(peso: number, altura: number): number {
    const alturaMetros = altura / 100;
    return peso / (alturaMetros * alturaMetros);
  }

  getIMCClassification(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau I';
    if (imc < 40) return 'Obesidade grau II';
    return 'Obesidade grau III';
  }

  calculateTMB(peso: number, altura: number, idade: number, sexo: string): number {
    // Fórmula de Harris-Benedict revisada
    if (sexo === 'masculino') {
      return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
    } else {
      return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
    }
  }

  calculateCaloriasDiarias(tmb: number, nivelAtividade: string): number {
    const fatores = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      ativo: 1.725,
      extra: 1.9
    };

    return tmb * (fatores[nivelAtividade as keyof typeof fatores] || 1.2);
  }
}

// Exportar instância singleton
export const userService = UserService.getInstance();