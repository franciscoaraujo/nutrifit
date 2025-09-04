# Arquitetura de Classes - NutriFit

## Visão Geral

Este documento descreve a arquitetura de classes e relacionamentos implementados para as páginas de Perfil e Dashboard do sistema NutriFit.

## Estrutura de Tipos (src/types/)

### 1. Tipos de Usuário (user.ts)

#### Interface User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Interface UserProfile
```typescript
interface UserProfile {
  id: string;
  userId: string;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: Date;
  sexo?: Sexo;
  altura?: number;
  peso?: number;
  objetivo?: Objetivo;
  nivelAtividade?: NivelAtividade;
  fotoPerfil?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Enums
- **Sexo**: MASCULINO, FEMININO, OUTRO
- **Objetivo**: PERDER_PESO, GANHAR_MASSA, MANTER_PESO, MELHORAR_SAUDE
- **NivelAtividade**: SEDENTARIO, LEVE, MODERADO, INTENSO, MUITO_INTENSO

### 2. Tipos de Dashboard (dashboard.ts)

#### Interface MedidaCorporal
```typescript
interface MedidaCorporal {
  id: string;
  userId: string;
  data: Date;
  bracos: number;
  busto: number;
  cintura: number;
  quadril: number;
  coxas: number;
  foto?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Interface DashboardStats
```typescript
interface DashboardStats {
  totalMedidas: number;
  ultimaMedicao?: Date;
  evolucaoCintura: number;
  evolucaoQuadril: number;
  evolucaoBracos: number;
  mediaProgresso: number;
}
```

## Estrutura de Serviços (src/services/)

### 1. UserService

#### Responsabilidades:
- Gerenciamento de dados do usuário
- Operações CRUD do perfil
- Upload de fotos de perfil
- Cálculos de saúde (IMC, TMB, necessidades calóricas)
- Validação de dados do perfil

#### Métodos Principais:
```typescript
class UserService {
  async getCurrentUser(): Promise<User>
  async updateUser(userData: Partial<User>): Promise<User>
  async getUserProfile(userId: string): Promise<UserProfile>
  async createUserProfile(profileData: PerfilFormData): Promise<UserProfile>
  async updateUserProfile(userId: string, profileData: Partial<PerfilFormData>): Promise<UserProfile>
  async uploadProfilePhoto(userId: string, file: File): Promise<string>
  calculateIMC(peso: number, altura: number): number
  calculateTMB(peso: number, altura: number, idade: number, sexo: Sexo): number
  calculateDailyCalories(tmb: number, nivelAtividade: NivelAtividade): number
}
```

### 2. DashboardService

#### Responsabilidades:
- Gerenciamento de medidas corporais
- Operações CRUD de medições
- Upload de fotos de progresso
- Geração de estatísticas e gráficos
- Exportação de dados

#### Métodos Principais:
```typescript
class DashboardService {
  async getMedidas(userId: string): Promise<MedidaCorporal[]>
  async createMedida(medidaData: MedidaFormData): Promise<MedidaCorporal>
  async updateMedida(medidaId: string, medidaData: Partial<MedidaFormData>): Promise<MedidaCorporal>
  async deleteMedida(medidaId: string): Promise<void>
  async uploadFotoProgresso(medidaId: string, file: File): Promise<string>
  async getDashboardStats(userId: string): Promise<DashboardStats>
  async exportarDados(userId: string, formato: 'csv' | 'pdf'): Promise<Blob>
}
```

## Relacionamentos Entre Classes

### 1. Relacionamento User ↔ UserProfile
- **Tipo**: One-to-One
- **Chave Estrangeira**: UserProfile.userId → User.id
- **Descrição**: Cada usuário possui um perfil único com informações detalhadas

### 2. Relacionamento User ↔ MedidaCorporal
- **Tipo**: One-to-Many
- **Chave Estrangeira**: MedidaCorporal.userId → User.id
- **Descrição**: Um usuário pode ter múltiplas medições corporais ao longo do tempo

### 3. Relacionamento MedidaCorporal ↔ FotoProgresso
- **Tipo**: One-to-One (opcional)
- **Chave Estrangeira**: MedidaCorporal.foto (URL da foto)
- **Descrição**: Cada medição pode ter uma foto de progresso associada

## Integração com as Páginas

### Página de Perfil (src/app/dashboard/perfil/page.tsx)

#### Estados Gerenciados:
```typescript
const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

#### Funcionalidades Implementadas:
- Carregamento automático dos dados do perfil
- Exibição dinâmica de informações pessoais
- Cálculo e exibição de IMC e TMB
- Tratamento de estados de loading e erro

### Página de Dashboard (src/app/dashboard/page.tsx)

#### Estados Gerenciados:
```typescript
const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
const [novaMedida, setNovaMedida] = useState<MedidaFormData>({...});
const [fotosProgresso, setFotosProgresso] = useState<FotoProgresso[]>([]);
const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

#### Funcionalidades Implementadas:
- CRUD completo de medidas corporais
- Upload e gerenciamento de fotos de progresso
- Visualização de histórico e estatísticas
- Exportação de dados
- Validação de formulários

## Utilitários e Helpers

### ValidationUtils
- Validação de email, telefone, CPF
- Validação de dados de perfil e medidas

### FormatUtils
- Formatação de datas, números, moeda
- Formatação de texto e tamanhos de arquivo

### StorageUtils
- Operações com localStorage
- Gerenciamento de cache local

## Benefícios da Arquitetura

1. **Separação de Responsabilidades**: Cada classe tem uma responsabilidade específica
2. **Reutilização**: Serviços podem ser utilizados em múltiplas páginas
3. **Manutenibilidade**: Código organizado e fácil de manter
4. **Tipagem Forte**: TypeScript garante type safety
5. **Escalabilidade**: Estrutura preparada para crescimento
6. **Testabilidade**: Classes isoladas facilitam testes unitários

## Próximos Passos

1. Implementação de testes unitários para os serviços
2. Adição de cache para melhorar performance
3. Implementação de sincronização offline
4. Adição de validações mais robustas
5. Implementação de notificações e alertas