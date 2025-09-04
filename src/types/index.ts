// Exportações centralizadas de todos os tipos

// Tipos de usuário e perfil
export type {
  User,
  PerfilData,
  UserProfile,
  PerfilFormData,
  UserFormData
} from './user';

export {
  Sexo,
  Objetivo,
  NivelAtividade,
  TipoDieta
} from './user';

// Tipos de dashboard e medidas
export type {
  MedidaCorporal,
  MedidaFormData,
  HistoricoMedidas,
  EvolucaoMedidas,
  FotoProgresso,
  DashboardStats,
  DadosGrafico,
  ConfiguracaoGrafico
} from './dashboard';

// Tipos comuns da aplicação
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos para componentes UI
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface InputProps {
  label?: string;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  error?: string;
  helperText?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  border?: boolean;
}