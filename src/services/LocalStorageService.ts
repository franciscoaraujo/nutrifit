// Serviço centralizado para gerenciar operações do localStorage

export interface WeightEntry {
  weight: number;
  date: string;
  id: string;
}

export interface StorageKeys {
  USER_DATA: 'userData';
  USER_PROFILE: 'userProfile';
  PERFIL_CONFIGURACAO: 'perfilConfiguracao';
  DIETAS_SELECIONADAS: 'dietasSelecionadas';
  FOTO_PERFIL: 'fotoPerfil';
  MEDIDAS_CORPORAIS: 'medidasCorporais';
  DASHBOARD_STATS: 'dashboardStats';
  FOTOS_PROGRESSO: 'fotosProgresso';
  WEIGHT_HISTORY: 'weightHistory';
  CURRENT_USER_ID: 'currentUserId';
  USERS_LIST: 'usersList';
}

export const STORAGE_KEYS: StorageKeys = {
  USER_DATA: 'userData',
  USER_PROFILE: 'userProfile',
  PERFIL_CONFIGURACAO: 'perfilConfiguracao',
  DIETAS_SELECIONADAS: 'dietasSelecionadas',
  FOTO_PERFIL: 'fotoPerfil',
  MEDIDAS_CORPORAIS: 'medidasCorporais',
  DASHBOARD_STATS: 'dashboardStats',
  FOTOS_PROGRESSO: 'fotosProgresso',
  WEIGHT_HISTORY: 'weightHistory',
  CURRENT_USER_ID: 'currentUserId',
  USERS_LIST: 'usersList'
};

export class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {}

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Métodos genéricos para localStorage
  setItem<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    try {
      if (typeof window === 'undefined') return null;
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  }

  removeItem(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
      return false;
    }
  }

  clear(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
      return false;
    }
  }

  // Métodos específicos para usuários
  setCurrentUserId(userId: string): boolean {
    return this.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  getCurrentUserId(): string | null {
    return this.getItem<string>(STORAGE_KEYS.CURRENT_USER_ID);
  }

  // Métodos para gerenciar múltiplos usuários
  getUserData(userId: string): any {
    return this.getItem(`${STORAGE_KEYS.USER_DATA}_${userId}`);
  }

  setUserData(userId: string, userData: any): boolean {
    return this.setItem(`${STORAGE_KEYS.USER_DATA}_${userId}`, userData);
  }

  getUserProfile(userId: string): any {
    return this.getItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`);
  }

  setUserProfile(userId: string, profileData: any): boolean {
    return this.setItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`, profileData);
  }

  getMedidasCorporais(userId: string): any[] {
    return this.getItem(`${STORAGE_KEYS.MEDIDAS_CORPORAIS}_${userId}`) || [];
  }

  setMedidasCorporais(userId: string, medidas: any[]): boolean {
    return this.setItem(`${STORAGE_KEYS.MEDIDAS_CORPORAIS}_${userId}`, medidas);
  }

  getDashboardStats(userId: string): any {
    return this.getItem(`${STORAGE_KEYS.DASHBOARD_STATS}_${userId}`);
  }

  setDashboardStats(userId: string, stats: any): boolean {
    return this.setItem(`${STORAGE_KEYS.DASHBOARD_STATS}_${userId}`, stats);
  }

  getFotosProgresso(userId: string): any[] {
    return this.getItem(`${STORAGE_KEYS.FOTOS_PROGRESSO}_${userId}`) || [];
  }

  setFotosProgresso(userId: string, fotos: any[]): boolean {
    return this.setItem(`${STORAGE_KEYS.FOTOS_PROGRESSO}_${userId}`, fotos);
  }

  // Métodos para gerenciar histórico de peso
  getWeightHistory(userId: string): WeightEntry[] {
    return this.getItem(`${STORAGE_KEYS.WEIGHT_HISTORY}_${userId}`) || [];
  }

  setWeightHistory(userId: string, weightHistory: WeightEntry[]): boolean {
    return this.setItem(`${STORAGE_KEYS.WEIGHT_HISTORY}_${userId}`, weightHistory);
  }

  addWeightEntry(userId: string, weightEntry: WeightEntry): boolean {
    const currentHistory = this.getWeightHistory(userId);
    const updatedHistory = [...currentHistory, weightEntry].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return this.setWeightHistory(userId, updatedHistory);
  }

  // Método para listar todos os usuários
  getAllUsers(): any[] {
    return this.getItem(STORAGE_KEYS.USERS_LIST) || [];
  }

  addUser(userData: any): boolean {
    const users = this.getAllUsers();
    const existingUserIndex = users.findIndex(user => user.id === userData.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = userData;
    } else {
      users.push(userData);
    }
    
    return this.setItem(STORAGE_KEYS.USERS_LIST, users);
  }

  removeUser(userId: string): boolean {
    const users = this.getAllUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    // Remove todos os dados relacionados ao usuário
    this.removeItem(`${STORAGE_KEYS.USER_DATA}_${userId}`);
    this.removeItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`);
    this.removeItem(`${STORAGE_KEYS.MEDIDAS_CORPORAIS}_${userId}`);
    this.removeItem(`${STORAGE_KEYS.DASHBOARD_STATS}_${userId}`);
    this.removeItem(`${STORAGE_KEYS.FOTOS_PROGRESSO}_${userId}`);
    
    return this.setItem(STORAGE_KEYS.USERS_LIST, filteredUsers);
  }

  // Método para limpar dados de sessão do usuário anterior
  clearUserSession(): boolean {
    try {
      // Remove apenas o ID do usuário atual, mantendo os dados dos usuários
      this.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
      return true;
    } catch (error) {
      console.error('Erro ao limpar sessão do usuário:', error);
      return false;
    }
  }

  // Método para limpar todos os dados específicos de um usuário
  clearUserData(userId: string): boolean {
    try {
      this.removeItem(`${STORAGE_KEYS.USER_DATA}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.USER_PROFILE}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.MEDIDAS_CORPORAIS}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.DASHBOARD_STATS}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.FOTOS_PROGRESSO}_${userId}`);
      // Limpar dados específicos de configuração do perfil
      this.removeItem(`${STORAGE_KEYS.PERFIL_CONFIGURACAO}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.FOTO_PERFIL}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.DIETAS_SELECIONADAS}_${userId}`);
      this.removeItem(`${STORAGE_KEYS.WEIGHT_HISTORY}_${userId}`);
      return true;
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
      return false;
    }
  }

  // Método para gerar IDs únicos
  generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Método para verificar se um usuário existe
  userExists(userId: string): boolean {
    const users = this.getAllUsers();
    return users.some(user => user.id === userId);
  }

  // Método para encontrar usuário por email
  findUserByEmail(email: string): any | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  // Método para validar credenciais
  validateCredentials(email: string, password: string): any | null {
    const user = this.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  // Método para backup dos dados
  exportData(): string {
    try {
      if (typeof window === 'undefined') return '{}';
      const data: { [key: string]: any } = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key);
        }
      }
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      return '{}';
    }
  }

  // Método para restaurar dados do backup
  importData(jsonData: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const data = JSON.parse(jsonData);
      
      // Limpar localStorage atual
      localStorage.clear();
      
      // Restaurar dados
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, data[key]);
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }
}

export const localStorageService = LocalStorageService.getInstance();