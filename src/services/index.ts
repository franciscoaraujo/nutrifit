// Exportações centralizadas de todos os serviços

export { UserService, userService } from './UserService';
export { DashboardService, dashboardService } from './DashboardService';
export { ProgressoService, progressoService } from './ProgressoService';

// Classe base para serviços com funcionalidades comuns
export abstract class BaseService {
  protected baseUrl = '/api';
  
  protected async handleRequest<T>(request: Promise<Response>): Promise<T> {
    try {
      const response = await request;
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Service request error:', error);
      throw error;
    }
  }
  
  protected buildQueryParams(params: Record<string, string | number | boolean | undefined | null>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  }
  
  protected formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }
  
  protected parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}

// Utilitários para validação
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isValidPassword(password: string): boolean {
    // Mínimo 8 caracteres, pelo menos uma letra e um número
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }
  
  static isValidPhone(phone: string): boolean {
    // Formato brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }
  
  static isValidCPF(cpf: string): boolean {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  }
  
  static formatCPF(cpf: string): string {
    const cleanCPF = cpf.replace(/\D/g, '');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  static formatPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  }
  
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>"'&]/g, '');
  }
}

// Utilitários para formatação
export class FormatUtils {
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  
  static formatNumber(value: number, decimals = 2): string {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }
  
  static formatDate(date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    const formatOptions: Record<string, Intl.DateTimeFormatOptions> = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      long: { day: '2-digit', month: 'long', year: 'numeric' },
      full: { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }
    };
    
    return new Intl.DateTimeFormat('pt-BR', formatOptions[format]).format(d);
  }
  
  static formatTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  }
  
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

// Utilitários para localStorage
export class StorageUtils {
  static setItem(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Error saving to localStorage');
    }
  }
  
  static getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch {
      console.error('Error reading from localStorage');
      return defaultValue || null;
    }
  }
  
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('Error removing from localStorage');
    }
  }
  
  static clear(): void {
    try {
      localStorage.clear();
    } catch {
      console.error('Error clearing localStorage');
    }
  }
}