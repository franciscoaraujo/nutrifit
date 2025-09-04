// Utilitários para verificação de perfil

import { UserService } from '@/services/UserService';
import { PerfilData } from '@/types';

/**
 * Verifica se o perfil do usuário está completo
 * @param userId - ID do usuário
 * @returns Promise<boolean> - true se o perfil estiver completo, false caso contrário
 */
export async function isProfileComplete(userId: string): Promise<boolean> {
  try {
    const userService = UserService.getInstance();
    const response = await userService.getUserProfile(userId);
    
    if (!response.success || !response.data?.perfil) {
      return false;
    }
    
    const perfil = response.data.perfil;
    
    // Verifica se todos os campos obrigatórios estão preenchidos
    return Boolean(
      perfil.sexo &&
      perfil.idade &&
      perfil.altura &&
      perfil.peso &&
      perfil.objetivo &&
      perfil.nivelAtividade)
  } catch (error) {
    console.error('Erro ao verificar perfil:', error);
    return false;
  }
}

/**
 * Verifica se os dados do perfil estão válidos
 * @param perfil - Dados do perfil
 * @returns boolean - true se válido, false caso contrário
 */
export function validateProfileData(perfil: PerfilData): boolean {
  return Boolean(
    perfil.sexo &&
    perfil.idade &&
    perfil.altura &&
    perfil.peso &&
    perfil.objetivo &&
    perfil.nivelAtividade &&
   (perfil.idade) > 0 &&
   (perfil.idade) <= 120 &&
   (perfil.altura) >= 50 &&
   (perfil.altura) <= 250 &&
   (perfil.peso) >= 20 &&
   (perfil.peso) <= 300)
}

/**
 * Retorna a URL de redirecionamento baseada no status do perfil
 * @param hasProfile - Se o usuário tem perfil completo
 * @returns string - URL de redirecionamento
 */
export function getRedirectUrl(hasProfile: boolean): string {
  return hasProfile ? '/dashboard' : '/perfil/configuracao';
}