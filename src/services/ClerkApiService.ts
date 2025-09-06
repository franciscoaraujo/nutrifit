import { useAuth } from '@clerk/nextjs';

/**
 * Serviço para gerenciar tokens do Clerk e comunicação com APIs externas
 */
export class ClerkApiService {
  private static instance: ClerkApiService;
  private baseApiUrl: string;

  constructor(baseApiUrl: string = 'http://localhost:8080/api') {
    this.baseApiUrl = baseApiUrl;
  }

  public static getInstance(baseApiUrl?: string): ClerkApiService {
    if (!ClerkApiService.instance) {
      ClerkApiService.instance = new ClerkApiService(baseApiUrl);
    }
    return ClerkApiService.instance;
  }

  /**
   * Faz uma requisição autenticada para uma API externa
   */
  public async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      body?: any;
      headers?: Record<string, string>;
      getToken: (args?: { template?: string }) => Promise<string | null>;
      template?: string;
    }
  ): Promise<T> {
    const { method = 'GET', body, headers = {}, getToken, template = 'default' } = options;

    try {
      // Obter o token do Clerk com template
      const token = await getToken({ template });
      console.log('=== TESTE: Token obtido ===', token);

      if (!token) {
        throw new Error('Token de autenticação não disponível');
      }

      // Configurar headers padrão
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...headers,
      };

      // Log detalhado do JSON sendo enviado
      console.log('=== DADOS COMPLETOS SENDO ENVIADOS ===');
      console.log('Endpoint:', `${this.baseApiUrl}${endpoint}`);
      console.log('Method:', method);
      console.log('Headers:', requestHeaders);
      console.log('Body (JSON):', JSON.stringify(body, null, 2));
      console.log('Token no header:', requestHeaders.Authorization);

      // Fazer a requisição
      console.log('=== ENVIANDO REQUISIÇÃO ===');
      const response = await fetch(`${this.baseApiUrl}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
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

      const responseData = await response.json();
      console.log('=== DADOS DA RESPOSTA ===');
      console.log('Response JSON:', JSON.stringify(responseData, null, 2));
      return responseData;
    } catch (error) {
      console.error('Erro na requisição autenticada:', error);
      throw error;
    }
  }

  /**
   * Envia dados do perfil do usuário para API externa
   */
  public async sendUserProfile(
    profileData: any,
    getToken: (args?: { template?: string }) => Promise<string | null>
  ): Promise<any> {
    return this.makeAuthenticatedRequest('/profile', {
      method: 'POST',
      body: profileData,
      getToken,
    });
  }

  /**
   * Registra um novo usuário na API externa
   */
  public async registerUser(
    userData: any,
    getToken: (args?: { template?: string }) => Promise<string | null>
  ): Promise<any> {
    return this.makeAuthenticatedRequest('/users/register', {
      method: 'POST',
      body: userData,
      getToken,
    });
  }

  /**
   * Sincroniza dados do usuário após login
   */
  public async syncUserData(
    getToken: (args?: { template?: string }) => Promise<string | null>
  ): Promise<any> {
    return this.makeAuthenticatedRequest('/users/sync', {
      method: 'POST',
      getToken,
    });
  }

  /**
   * Atualiza dados do usuário
   */
  public async updateUser(
    userId: string,
    userData: any,
    getToken: (args?: { template?: string }) => Promise<string | null>
  ): Promise<any> {
    return this.makeAuthenticatedRequest(`/users/${userId}`, {
      method: 'PUT',
      body: userData,
      getToken,
    });
  }

  /**
   * Obtém dados do usuário
   */
  public async getUser(
    userId: string,
    getToken: (args?: { template?: string }) => Promise<string | null>
  ): Promise<any> {
    return this.makeAuthenticatedRequest(`/users/${userId}`, {
      method: 'GET',
      getToken,
    });
  }

  /**
   * Define a URL base da API
   */
  public setBaseApiUrl(url: string): void {
    this.baseApiUrl = url;
  }

  /**
   * Obtém a URL base da API
   */
  public getBaseApiUrl(): string {
    return this.baseApiUrl;
  }
}

// Instância singleton do serviço
export const clerkApiService = ClerkApiService.getInstance();
