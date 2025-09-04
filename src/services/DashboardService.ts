// Serviço para gerenciar operações do dashboard e medidas corporais

import { 
  MedidaCorporal, 
  MedidaFormData, 
  HistoricoMedidas, 
  EvolucaoMedidas, 
  FotoProgresso, 
  DashboardStats,
  DadosGrafico,
  ConfiguracaoGrafico,
  ApiResponse,
  PaginatedResponse
} from '@/types';
import { localStorageService } from './LocalStorageService';

export class DashboardService {
  private static instance: DashboardService;
  private baseUrl = '/api';

  private constructor() {}

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  // Métodos auxiliares para cálculos
  private calcularTendenciaPeso(medidas: MedidaCorporal[]): 'subindo' | 'descendo' | 'estavel' {
    if (medidas.length < 2) return 'estavel';
    
    const ultimasMedidas = medidas.slice(-3); // Últimas 3 medidas
    const pesos = ultimasMedidas.map(m => m.peso);
    
    const tendenciaPositiva = pesos.filter((peso, index) => 
      index > 0 && peso > pesos[index - 1]
    ).length;
    
    const tendenciaNegativa = pesos.filter((peso, index) => 
      index > 0 && peso < pesos[index - 1]
    ).length;
    
    if (tendenciaPositiva > tendenciaNegativa) return 'subindo';
    if (tendenciaNegativa > tendenciaPositiva) return 'descendo';
    return 'estavel';
  }

  private calcularProximoObjetivo(medidas: MedidaCorporal[]): string {
    if (medidas.length === 0) return 'Registrar primeira medida';
    
    const ultimaMedida = medidas[medidas.length - 1];
    const pesoAtual = ultimaMedida.peso;
    
    // Objetivos baseados em marcos de peso
    const marcos = [5, 10, 15, 20]; // kg
    
    for (const marco of marcos) {
      const objetivoPerda = Math.floor(pesoAtual / marco) * marco;
      const objetivoGanho = Math.ceil(pesoAtual / marco) * marco;
      
      if (Math.abs(pesoAtual - objetivoPerda) < Math.abs(pesoAtual - objetivoGanho)) {
        return `Alcançar ${objetivoPerda}kg`;
      } else {
        return `Alcançar ${objetivoGanho}kg`;
      }
    }
    
    return 'Manter peso atual';
  }

  // Métodos para medidas corporais
  async getMedidas(): Promise<ApiResponse<MedidaCorporal[]>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const medidas = localStorageService.getMedidasCorporais(currentUserId);
      
      return {
        success: true,
        data: medidas
      };
    } catch (error) {
      console.error('Erro ao buscar medidas corporais:', error);
      return {
        success: false,
        error: 'Erro ao buscar medidas corporais'
      };
    }
  }

  async createMedida(medidaData: MedidaFormData): Promise<ApiResponse<MedidaCorporal>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const newMedida: MedidaCorporal = {
        id: localStorageService.generateId(),
        userId: currentUserId,
        data: medidaData.data,
        bracos: parseFloat(medidaData.bracos),
        busto: parseFloat(medidaData.busto),
        cintura: parseFloat(medidaData.cintura),
        quadril: parseFloat(medidaData.quadril),
        coxas: parseFloat(medidaData.coxas),
        observacoes: medidaData.observacoes,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const medidas = localStorageService.getMedidasCorporais(currentUserId);
      medidas.push(newMedida);
      
      const success = localStorageService.setMedidasCorporais(currentUserId, medidas);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao salvar medida corporal'
        };
      }
      
      return {
        success: true,
        data: newMedida
      };
    } catch (error) {
      console.error('Erro ao criar medida corporal:', error);
      return {
        success: false,
        error: 'Erro ao criar medida corporal'
      };
    }
  }

  async updateMedida(medidaId: string, medidaData: Partial<MedidaFormData>): Promise<ApiResponse<MedidaCorporal>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const medidas = localStorageService.getMedidasCorporais(currentUserId);
      const medidaIndex = medidas.findIndex(m => m.id === medidaId);
      
      if (medidaIndex === -1) {
        return {
          success: false,
          error: 'Medida não encontrada'
        };
      }
      
      const updatedMedida = {
        ...medidas[medidaIndex],
        ...medidaData,
        updatedAt: new Date()
      };
      
      medidas[medidaIndex] = updatedMedida;
      
      const success = localStorageService.setMedidasCorporais(currentUserId, medidas);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao salvar medida corporal'
        };
      }
      
      return {
        success: true,
        data: updatedMedida
      };
    } catch (error) {
      console.error('Erro ao atualizar medida corporal:', error);
      return {
        success: false,
        error: 'Erro ao atualizar medida corporal'
      };
    }
  }

  async deleteMedida(medidaId: string): Promise<ApiResponse<boolean>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const medidas = localStorageService.getMedidasCorporais(currentUserId);
      const medidaIndex = medidas.findIndex(m => m.id === medidaId);
      
      if (medidaIndex === -1) {
        return {
          success: false,
          error: 'Medida não encontrada'
        };
      }
      
      medidas.splice(medidaIndex, 1);
      
      const success = localStorageService.setMedidasCorporais(currentUserId, medidas);
      
      if (!success) {
        return {
          success: false,
          error: 'Erro ao deletar medida corporal'
        };
      }
      
      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('Erro ao deletar medida corporal:', error);
      return {
        success: false,
        error: 'Erro ao deletar medida corporal'
      };
    }
  }

  // Métodos para fotos de progresso
  async uploadFotoProgresso(file: File, data: string, observacoes?: string): Promise<ApiResponse<FotoProgresso>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      // Converter arquivo para base64
      const reader = new FileReader();
      
      return new Promise((resolve) => {
        reader.onload = () => {
          const fotoUrl = reader.result as string;
          
          const novaFoto: FotoProgresso = {
            id: localStorageService.generateId(),
            userId: currentUserId,
            url: fotoUrl,
            data: new Date(data),
            observacoes,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const fotos = localStorageService.getFotosProgresso(currentUserId);
          fotos.push(novaFoto);
          
          const success = localStorageService.setFotosProgresso(currentUserId, fotos);
          
          if (!success) {
            resolve({
              success: false,
              error: 'Erro ao salvar foto'
            });
            return;
          }
          
          resolve({
            success: true,
            data: novaFoto
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

  async getFotosProgresso(): Promise<ApiResponse<FotoProgresso[]>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      const fotos = localStorageService.getFotosProgresso(currentUserId);
      
      return {
        success: true,
        data: fotos
      };
    } catch (error) {
      console.error('Erro ao buscar fotos de progresso:', error);
      return {
        success: false,
        error: 'Erro ao buscar fotos de progresso'
      };
    }
  }

  // Métodos para estatísticas e análises
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        return {
          success: false,
          error: 'Usuário não está logado'
        };
      }
      
      // Buscar dados para calcular estatísticas
      const medidas = localStorageService.getMedidasCorporais(currentUserId);
      const fotos = localStorageService.getFotosProgresso(currentUserId);
      
      // Calcular estatísticas
      const stats: DashboardStats = {
        totalMedidas: medidas.length,
        totalFotos: fotos.length,
        ultimaMedida: medidas.length > 0 ? medidas[medidas.length - 1].data : null,
        ultimaFoto: fotos.length > 0 ? fotos[fotos.length - 1].data : null,
        pesoAtual: medidas.length > 0 ? medidas[medidas.length - 1].peso : null,
        pesoInicial: medidas.length > 0 ? medidas[0].peso : null,
        diferencaPeso: medidas.length > 1 ? 
          medidas[medidas.length - 1].peso - medidas[0].peso : 0,
        tendenciaPeso: this.calcularTendenciaPeso(medidas),
        proximoObjetivo: this.calcularProximoObjetivo(medidas)
      };
      
      // Salvar estatísticas calculadas
      localStorageService.setDashboardStats(currentUserId, stats);
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      return {
        success: false,
        error: 'Erro ao buscar estatísticas do dashboard'
      };
    }
  }

  async getEvolucaoMedidas(userId: string): Promise<ApiResponse<EvolucaoMedidas>> {
    try {
      const response = await fetch(`${this.baseUrl}/medidas/evolucao?userId=${userId}`);
      return await response.json();
    } catch {
      return {
        success: false,
        error: 'Erro ao buscar evolução das medidas'
      };
    }
  }

  async getDadosGrafico(userId: string, config: ConfiguracaoGrafico): Promise<ApiResponse<DadosGrafico>> {
    try {
      const params = new URLSearchParams({
        userId,
        tipo: config.tipo,
        medida: config.medida,
        periodo: config.periodo
      });
      
      const response = await fetch(`${this.baseUrl}/medidas/grafico?${params}`);
      return await response.json();
    } catch {
      return {
        success: false,
        error: 'Erro ao buscar dados do gráfico'
      };
    }
  }

  // Métodos de validação
  validateMedidaData(data: MedidaFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.data) {
      errors.push('Data é obrigatória');
    }

    const medidas = ['bracos', 'busto', 'cintura', 'quadril', 'coxas'] as const;
    
    medidas.forEach(medida => {
      const valor = parseFloat(data[medida]);
      if (!data[medida] || isNaN(valor) || valor <= 0 || valor > 200) {
        errors.push(`${medida.charAt(0).toUpperCase() + medida.slice(1)} deve ser um valor válido entre 1 e 200 cm`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Métodos utilitários
  calculateDiferencaMedidas(medidaAnterior: MedidaCorporal, medidaAtual: MedidaCorporal): EvolucaoMedidas['diferencas'] {
    return {
      bracos: medidaAtual.bracos - medidaAnterior.bracos,
      busto: medidaAtual.busto - medidaAnterior.busto,
      cintura: medidaAtual.cintura - medidaAnterior.cintura,
      quadril: medidaAtual.quadril - medidaAnterior.quadril,
      coxas: medidaAtual.coxas - medidaAnterior.coxas
    };
  }

  calculatePercentualMudanca(medidaAnterior: MedidaCorporal, medidaAtual: MedidaCorporal): EvolucaoMedidas['percentualMudanca'] {
    const calcularPercentual = (anterior: number, atual: number): number => {
      if (anterior === 0) return 0;
      return ((atual - anterior) / anterior) * 100;
    };

    return {
      bracos: calcularPercentual(medidaAnterior.bracos, medidaAtual.bracos),
      busto: calcularPercentual(medidaAnterior.busto, medidaAtual.busto),
      cintura: calcularPercentual(medidaAnterior.cintura, medidaAtual.cintura),
      quadril: calcularPercentual(medidaAnterior.quadril, medidaAtual.quadril),
      coxas: calcularPercentual(medidaAnterior.coxas, medidaAtual.coxas)
    };
  }

  formatMedida(valor: number): string {
    return `${valor.toFixed(1)} cm`;
  }

  formatPercentual(valor: number): string {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}${valor.toFixed(1)}%`;
  }

  exportMedidasCSV(medidas: MedidaCorporal[]): string {
    const headers = ['Data', 'Braços (cm)', 'Busto (cm)', 'Cintura (cm)', 'Quadril (cm)', 'Coxas (cm)'];
    const rows = medidas.map(medida => [
      new Date(medida.data).toLocaleDateString('pt-BR'),
      medida.bracos.toString(),
      medida.busto.toString(),
      medida.cintura.toString(),
      medida.quadril.toString(),
      medida.coxas.toString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

// Exportar instância singleton
export const dashboardService = DashboardService.getInstance();