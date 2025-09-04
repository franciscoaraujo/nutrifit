import { 
  Plano, 
  PlanoAtivo, 
  RegistroPeso, 
  RegistroJejum, 
  RegistroDieta, 
  Conquista, 
  ConquistaUsuario, 
  EstatisticasProgresso,
  TipoDieta 
} from '@/types/user';
import { LocalStorageService } from './LocalStorageService';

export class ProgressoService {
  private static instance: ProgressoService;
  private localStorageService: LocalStorageService;

  constructor() {
    this.localStorageService = LocalStorageService.getInstance();
  }

  static getInstance(): ProgressoService {
    if (!ProgressoService.instance) {
      ProgressoService.instance = new ProgressoService();
    }
    return ProgressoService.instance;
  }

  // Planos disponíveis
  getPlanos(): Plano[] {
    return [
      {
        id: 'low-carb',
        nome: 'Low Carb',
        tipo: 'dieta',
        descricao: 'Dieta com redução de carboidratos para acelerar a queima de gordura',
        duracao: 12,
        categoria: TipoDieta.LOW_CARB,
        beneficios: ['Perda de peso rápida', 'Redução do apetite', 'Melhora da glicemia'],
        dificuldade: 'iniciante'
      },
      {
        id: 'cetogenica',
        nome: 'Cetogênica',
        tipo: 'dieta',
        descricao: 'Dieta muito baixa em carboidratos para induzir cetose',
        duracao: 16,
        categoria: TipoDieta.CETOGENICA,
        beneficios: ['Cetose', 'Perda de peso acelerada', 'Maior saciedade'],
        dificuldade: 'intermediario'
      },
      {
        id: 'carnivora',
        nome: 'Carnívora',
        tipo: 'dieta',
        descricao: 'Dieta baseada exclusivamente em produtos de origem animal',
        duracao: 8,
        categoria: TipoDieta.CARNIVORA,
        beneficios: ['Eliminação de inflamação', 'Simplicidade', 'Saciedade'],
        dificuldade: 'avancado'
      },
      {
        id: 'reeducacao',
        nome: 'Reeducação Alimentar',
        tipo: 'dieta',
        descricao: 'Mudança gradual de hábitos alimentares para um estilo de vida saudável',
        duracao: 24,
        categoria: TipoDieta.REEDUCACAO_ALIMENTAR,
        beneficios: ['Sustentabilidade', 'Flexibilidade', 'Mudança de hábitos'],
        dificuldade: 'iniciante'
      },
      {
        id: 'jejum-16h',
        nome: 'Jejum Intermitente 16h',
        tipo: 'jejum',
        descricao: 'Protocolo de jejum de 16 horas com janela alimentar de 8 horas',
        duracao: 12,
        categoria: 'jejum_intermitente',
        protocolos: ['16h', '18h', '20h'],
        beneficios: ['Autofagia', 'Perda de peso', 'Melhora metabólica'],
        dificuldade: 'iniciante'
      },
      {
        id: 'jejum-24h',
        nome: 'Jejum Intermitente 24h',
        tipo: 'jejum',
        descricao: 'Protocolo de jejum de 24 horas, 1-2 vezes por semana',
        duracao: 8,
        categoria: 'jejum_intermitente',
        protocolos: ['24h', '36h'],
        beneficios: ['Autofagia intensa', 'Reset metabólico', 'Disciplina'],
        dificuldade: 'avancado'
      },
      {
        id: 'ceto-jejum',
        nome: 'Cetogênica + Jejum',
        tipo: 'combinado',
        descricao: 'Combinação de dieta cetogênica com jejum intermitente',
        duracao: 16,
        categoria: TipoDieta.CETOGENICA,
        protocolos: ['16h', '18h', '20h'],
        beneficios: ['Cetose profunda', 'Perda de peso máxima', 'Clareza mental'],
        dificuldade: 'avancado'
      }
    ];
  }

  // Gerenciamento de planos ativos
  ativarPlano(userId: string, planoId: string): PlanoAtivo {
    const plano = this.getPlanos().find(p => p.id === planoId);
    if (!plano) throw new Error('Plano não encontrado');

    // Desativar plano atual se existir
    this.desativarPlanoAtual(userId);

    const planoAtivo: PlanoAtivo = {
      id: `plano-ativo-${Date.now()}`,
      userId,
      planoId,
      plano,
      dataInicio: new Date(),
      progresso: 0,
      semanaAtual: 1,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const planosAtivos = this.localStorageService.getItem<PlanoAtivo[]>('planos-ativos') || [];
    planosAtivos.push(planoAtivo);
    this.localStorageService.setItem('planos-ativos', planosAtivos);

    // Disparar evento customizado para notificar mudança de plano ativo
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('localStorageUpdate'));
    }

    return planoAtivo;
  }

  getPlanoAtivo(userId: string): PlanoAtivo | null {
    const planosAtivos = this.localStorageService.getItem<PlanoAtivo[]>('planos-ativos') || [];
    return planosAtivos.find(p => p.userId === userId && p.ativo) || null;
  }

  desativarPlanoAtual(userId: string): void {
    const planosAtivos = this.localStorageService.getItem<PlanoAtivo[]>('planos-ativos') || [];
    const planoAtivo = planosAtivos.find(p => p.userId === userId && p.ativo);
    
    if (planoAtivo) {
      planoAtivo.ativo = false;
      planoAtivo.dataFim = new Date();
      planoAtivo.updatedAt = new Date();
      this.localStorageService.setItem('planos-ativos', planosAtivos);
      
      // Disparar evento customizado para notificar mudança de plano ativo
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('localStorageUpdate'));
      }
    }
  }

  // Registros de peso
  registrarPeso(userId: string, data: Date, peso: number): RegistroPeso {
    const registro: RegistroPeso = {
      id: `peso-${Date.now()}`,
      userId,
      data,
      peso,
      createdAt: new Date()
    };

    const registros = this.localStorageService.getItem<RegistroPeso[]>('registros-peso') || [];
    registros.push(registro);
    this.localStorageService.setItem('registros-peso', registros);

    // Verificar conquistas
    this.verificarConquistasPeso(userId);

    return registro;
  }

  getRegistrosPeso(userId: string): RegistroPeso[] {
    const registros = this.localStorageService.getItem<RegistroPeso[]>('registros-peso') || [];
    return registros.filter(r => r.userId === userId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Registros de jejum
  registrarJejum(userId: string, data: Date, horaInicio: string, horaFim: string, protocolo: string): RegistroJejum {
    const duracao = this.calcularDuracaoJejum(horaInicio, horaFim);
    const planoAtivo = this.getPlanoAtivo(userId);

    const registro: RegistroJejum = {
      id: `jejum-${Date.now()}`,
      userId,
      data,
      horaInicio,
      horaFim,
      duracao,
      protocolo,
      planoAtivoId: planoAtivo?.id,
      createdAt: new Date()
    };

    const registros = this.localStorageService.getItem<RegistroJejum[]>('registros-jejum') || [];
    registros.push(registro);
    this.localStorageService.setItem('registros-jejum', registros);

    // Verificar conquistas
    this.verificarConquistasJejum(userId);

    return registro;
  }

  getRegistrosJejum(userId: string): RegistroJejum[] {
    const registros = this.localStorageService.getItem<RegistroJejum[]>('registros-jejum') || [];
    return registros.filter(r => r.userId === userId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Registros de dieta
  registrarDiaDieta(userId: string, data: Date, observacoes?: string): RegistroDieta {
    const planoAtivo = this.getPlanoAtivo(userId);
    if (!planoAtivo) throw new Error('Nenhum plano ativo encontrado');

    const registro: RegistroDieta = {
      id: `dieta-${Date.now()}`,
      userId,
      data,
      planoAtivoId: planoAtivo.id,
      observacoes,
      createdAt: new Date()
    };

    const registros = this.localStorageService.getItem<RegistroDieta[]>('registros-dieta') || [];
    registros.push(registro);
    this.localStorageService.setItem('registros-dieta', registros);

    // Verificar conquistas
    this.verificarConquistasDieta(userId);

    return registro;
  }

  getRegistrosDieta(userId: string): RegistroDieta[] {
    const registros = this.localStorageService.getItem<RegistroDieta[]>('registros-dieta') || [];
    return registros.filter(r => r.userId === userId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  // Estatísticas
  getEstatisticasProgresso(userId: string): EstatisticasProgresso {
    const registrosPeso = this.getRegistrosPeso(userId);
    const registrosJejum = this.getRegistrosJejum(userId);
    const registrosDieta = this.getRegistrosDieta(userId);
    const conquistasUsuario = this.getConquistasUsuario(userId);

    const pesoAtual = registrosPeso[0]?.peso || 0;
    const pesoInicial = registrosPeso[registrosPeso.length - 1]?.peso || pesoAtual;
    const perdaTotal = pesoInicial - pesoAtual;

    const mediaJejum = registrosJejum.length > 0 
      ? registrosJejum.reduce((acc, r) => acc + r.duracao, 0) / registrosJejum.length 
      : undefined;

    const diasNaDieta = this.calcularDiasConsecutivos(registrosDieta);
    const conquistasDesbloqueadas = conquistasUsuario.filter(c => c.desbloqueada).length;

    return {
      pesoAtual,
      imc: this.calcularIMC(pesoAtual, 170), // Altura padrão, deve vir do perfil
      diasNaDieta,
      mediaJejum,
      perdaTotal,
      conquistasDesbloqueadas,
      sequenciaAtual: diasNaDieta
    };
  }

  // Conquistas
  getConquistas(): Conquista[] {
    return [
      {
        id: 'primeira-semana',
        nome: '1ª Semana',
        descricao: 'Complete sua primeira semana de dieta',
        icone: '🏆',
        tipo: 'dieta',
        condicao: { tipo: 'dias_consecutivos', valor: 7 }
      },
      {
        id: 'cinco-jejuns',
        nome: '5 Jejuns',
        descricao: 'Complete 5 jejuns',
        icone: '🌙',
        tipo: 'jejum',
        condicao: { tipo: 'quantidade', valor: 5 }
      },
      {
        id: 'perda-3kg',
        nome: '-3kg',
        descricao: 'Perca 3kg do seu peso inicial',
        icone: '📸',
        tipo: 'peso',
        condicao: { tipo: 'objetivo_atingido', valor: 3, unidade: 'kg' }
      },
      {
        id: 'cetose',
        nome: 'Cetose',
        descricao: 'Mantenha cetose por 7 dias consecutivos',
        icone: '💧',
        tipo: 'combinado',
        condicao: { tipo: 'dias_consecutivos', valor: 7 }
      }
    ];
  }

  getConquistasUsuario(userId: string): ConquistaUsuario[] {
    const conquistas = this.localStorageService.getItem<ConquistaUsuario[]>('conquistas-usuario') || [];
    return conquistas.filter(c => c.userId === userId);
  }

  // Métodos auxiliares
  private calcularDuracaoJejum(horaInicio: string, horaFim: string): number {
    const [horaIni, minIni] = horaInicio.split(':').map(Number);
    const [horaFim_, minFim] = horaFim.split(':').map(Number);
    
    const inicioMinutos = horaIni * 60 + minIni;
    let fimMinutos = horaFim_ * 60 + minFim;
    
    // Se hora fim é menor que início, assumir que passou para o próximo dia
    if (fimMinutos < inicioMinutos) {
      fimMinutos += 24 * 60;
    }
    
    return (fimMinutos - inicioMinutos) / 60;
  }

  private calcularIMC(peso: number, altura: number): number {
    return peso / Math.pow(altura / 100, 2);
  }

  private calcularDiasConsecutivos(registros: RegistroDieta[]): number {
    if (registros.length === 0) return 0;
    
    const hoje = new Date();
    let dias = 0;
    
    for (let i = 0; i < registros.length; i++) {
      const dataRegistro = new Date(registros[i].data);
      const diffDias = Math.floor((hoje.getTime() - dataRegistro.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDias === i) {
        dias++;
      } else {
        break;
      }
    }
    
    return dias;
  }

  private verificarConquistasPeso(userId: string): void {
    // Implementar lógica de verificação de conquistas de peso
  }

  private verificarConquistasJejum(userId: string): void {
    // Implementar lógica de verificação de conquistas de jejum
  }

  private verificarConquistasDieta(userId: string): void {
    // Implementar lógica de verificação de conquistas de dieta
  }
}

export const progressoService = ProgressoService.getInstance();