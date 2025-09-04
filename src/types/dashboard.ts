// Tipos relacionados ao dashboard e medidas corporais

export interface MedidaCorporal {
  id: string;
  userId: string;
  data: string; // formato ISO date string
  bracos: number; // em cm
  busto: number; // em cm
  cintura: number; // em cm
  quadril: number; // em cm
  coxas: number; // em cm
  foto?: string; // base64 ou URL da foto
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedidaFormData {
  data: string;
  bracos: string;
  busto: string;
  cintura: string;
  quadril: string;
  coxas: string;
  observacoes?: string;
}

export interface HistoricoMedidas {
  medidas: MedidaCorporal[];
  totalMedidas: number;
  primeiraData?: string;
  ultimaData?: string;
}

export interface EvolucaoMedidas {
  medidaAnterior?: MedidaCorporal;
  medidaAtual: MedidaCorporal;
  diferencas: {
    bracos: number;
    busto: number;
    cintura: number;
    quadril: number;
    coxas: number;
  };
  percentualMudanca: {
    bracos: number;
    busto: number;
    cintura: number;
    quadril: number;
    coxas: number;
  };
}

export interface FotoProgresso {
  id: string;
  userId: string;
  medidaId?: string;
  foto: string; // base64 ou URL
  data: string;
  tipo: 'frente' | 'lado' | 'costas' | 'livre';
  observacoes?: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalMedidas: number;
  totalFotos: number;
  diasAcompanhamento: number;
  ultimaMedida?: MedidaCorporal;
  proximaMetaMedida?: Date;
}

// Tipos para gráficos e visualizações
export interface DadosGrafico {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension?: number;
  }[];
}

export interface ConfiguracaoGrafico {
  tipo: 'linha' | 'barra';
  medida: keyof Omit<MedidaCorporal, 'id' | 'userId' | 'data' | 'foto' | 'observacoes' | 'createdAt' | 'updatedAt'>;
  periodo: '7dias' | '30dias' | '90dias' | 'todos';
}