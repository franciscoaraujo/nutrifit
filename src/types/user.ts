// Tipos relacionados ao usuário e perfil

export interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PerfilData {
  id?: string;
  userId: string;
  sexo: 'feminino' | 'masculino' | '';
  idade: number;
  altura: number; // em cm
  peso: number; // em kg
  objetivo: 'emagrecimento' | 'manutencao' | 'ganho_massa' | '';
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'extra' | '';
  dietas?: string[]; // Array de tipos de dieta selecionadas
  foto?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfile extends User {
  perfil?: PerfilData;
}

// Enums para melhor tipagem
export enum Sexo {
  FEMININO = 'feminino',
  MASCULINO = 'masculino'
}

export enum Objetivo {
  EMAGRECIMENTO = 'emagrecimento',
  MANUTENCAO = 'manutencao',
  GANHO_MASSA = 'ganho_massa'
}

export enum NivelAtividade {
  SEDENTARIO = 'sedentario',
  LEVE = 'leve',
  MODERADO = 'moderado',
  ATIVO = 'ativo',
  EXTRA = 'extra'
}

export enum TipoDieta {
  LOW_CARB = 'low_carb',
  CETOGENICA = 'cetogenica',
  CARNIVORA = 'carnivora',
  CETO_CARNIVORA = 'ceto_carnivora',
  JEJUM_INTERMITENTE = 'jejum_intermitente',
  REEDUCACAO_ALIMENTAR = 'reeducacao_alimentar',
  VEGETARIANA = 'vegetariana',
  VEGANA = 'vegana',
  PALEO = 'paleo',
  MEDITERRANEA = 'mediterranea',
  DASH = 'dash',
  FLEXITARIANA = 'flexitariana',
  SEM_GLUTEN = 'sem_gluten',
  SEM_LACTOSE = 'sem_lactose',
  DIABETICA = 'diabetica',
  HIPERTENSAO = 'hipertensao'
}

// Tipos para formulários
export interface PerfilFormData {
  sexo: Sexo | '';
  idade: number;
  nome:string;
  altura: number;
  peso: number;
  objetivo: Objetivo | '';
  nivelAtividade: NivelAtividade | '';
  dietas?: string[]; // Array de tipos de dieta selecionadas
  foto?: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
  rememberMe?: boolean;
}

// Tipos para planos
export interface Plano {
  id: string;
  nome: string;
  tipo: 'dieta' | 'jejum' | 'combinado';
  descricao: string;
  duracao: number; // em semanas
  categoria: TipoDieta | 'jejum_intermitente';
  protocolos?: string[]; // Para jejum: 16h, 18h, 24h, etc.
  beneficios: string[];
  dificuldade: 'iniciante' | 'intermediario' | 'avancado';
}

export interface PlanoAtivo {
  id: string;
  userId: string;
  planoId: string;
  plano: Plano;
  dataInicio: Date;
  dataFim?: Date;
  progresso: number; // 0-100
  semanaAtual: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para registros
export interface RegistroPeso {
  id: string;
  userId: string;
  data: Date;
  peso: number;
  createdAt: Date;
}

export interface RegistroJejum {
  id: string;
  userId: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  duracao: number; // em horas
  protocolo: string; // 16h, 18h, 24h, etc.
  planoAtivoId?: string;
  createdAt: Date;
}

export interface RegistroDieta {
  id: string;
  userId: string;
  data: Date;
  planoAtivoId: string;
  observacoes?: string;
  createdAt: Date;
}

// Tipos para conquistas
export interface Conquista {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  tipo: 'peso' | 'jejum' | 'dieta' | 'combinado';
  condicao: {
    tipo: 'dias_consecutivos' | 'quantidade' | 'objetivo_atingido' | 'duracao_jejum';
    valor: number;
    unidade?: string;
  };
}

export interface ConquistaUsuario {
  id: string;
  userId: string;
  conquistaId: string;
  conquista: Conquista;
  dataDesbloqueio: Date;
  progresso: number; // 0-100
  desbloqueada: boolean;
}

// Tipos para estatísticas
export interface EstatisticasProgresso {
  pesoAtual: number;
  imc: number;
  diasNaDieta: number;
  mediaJejum?: number; // em horas
  perdaTotal: number;
  conquistasDesbloqueadas: number;
  sequenciaAtual: number; // dias consecutivos
}