'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEdit, faWeight, faRulerVertical, faCalendarAlt, faHeartbeat, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { User, UserProfile, PerfilData } from '@/types';
import { userService } from '@/services';
import { useToast } from '@/hooks/useToast';
import { localStorageService, WeightEntry } from '@/services/LocalStorageService';
import { progressoService } from '@/services/ProgressoService';
import { PlanoAtivo, EstatisticasProgresso, ConquistaUsuario } from '@/types/user';
import RegistrarPesoForm from '@/components/forms/RegistrarPesoForm';
import RegistrarJejumForm from '@/components/forms/RegistrarJejumForm';
import RegistrarDietaForm from '@/components/forms/RegistrarDietaForm';

export default function ProfilePage() {
  const { showError, showSuccess } = useToast();
  
  // Estados para os modais de registro
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [isJejumModalOpen, setIsJejumModalOpen] = useState(false);
  const [isDietaModalOpen, setIsDietaModalOpen] = useState(false);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  
  // Estados para o sistema de progresso
  const [planoAtivo, setPlanoAtivo] = useState<PlanoAtivo | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasProgresso | null>(null);
  const [conquistas, setConquistas] = useState<ConquistaUsuario[]>([]);
  
  // Mapeamento das dietas disponíveis
  /*const dietasDisponiveis = {
    'low_carb': {
      nome: 'Low Carb',
      descricao: 'Baixo teor de carboidratos, ideal para perda de peso',
      progresso: '2 de 8 semanas'
    },
    'cetogenica': {
      nome: 'Cetogênica',
      descricao: 'Rica em gorduras, induz cetose para queima de gordura',
      progresso: '3 de 10 semanas'
    },
    'carnivora': {
      nome: 'Carnívora',
      descricao: 'Baseada exclusivamente em produtos de origem animal',
      progresso: '1 de 12 semanas'
    },
    'ceto_carnivora': {
      nome: 'Ceto-Carnívora',
      descricao: 'Combinação cetogênica com carnívora, zero carboidratos',
      progresso: '2 de 16 semanas'
    },
    'jejum_intermitente': {
      nome: 'Jejum Intermitente',
      descricao: 'Alterna períodos de jejum e alimentação',
      progresso: '4 de 14 semanas'
    },
    'reeducacao_alimentar': {
      nome: 'Reeducação Alimentar',
      descricao: 'Mudança gradual e sustentável dos hábitos',
      progresso: '5 de 20 semanas'
    }
  };*/
  


  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [fotoPerfil, setFotoPerfil] = useState<string>('');
  const [perfilConfig, setPerfilConfig] = useState<PerfilData | null>(null);
  const [dietasSelecionadas, setDietasSelecionadas] = useState<string[]>([]);

  // Carregar dados do sistema de progresso
  const loadProgressoData = () => {
    if (userProfile?.id) {
      const plano = progressoService.getPlanoAtivo(userProfile.id);
      const stats = progressoService.getEstatisticasProgresso(userProfile.id);
      const userConquistas = progressoService.getConquistasUsuario(userProfile.id);
      
      setPlanoAtivo(plano);
      setEstatisticas(stats);
      setConquistas(userConquistas);
    }
  };

  // Recarregar dados após registros
  const handleRegistroSuccess = () => {
    loadProgressoData();
    setIsWeightModalOpen(false);
    setIsJejumModalOpen(false);
    setIsDietaModalOpen(false);
    showSuccess('Registro salvo com sucesso!');
  };

  // Carregar dados do perfil do usuário
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const currentUserResponse = await userService.getCurrentUser();
        
        if (currentUserResponse.success && currentUserResponse.data) {
          const profileResponse = await userService.getUserProfile(currentUserResponse.data.id);
          
          if (profileResponse.success && profileResponse.data) {
            setUserProfile(profileResponse.data);
          } else {
            // Se não há perfil, criar um objeto básico com dados do usuário
            setUserProfile({
              ...currentUserResponse.data,
              perfil: undefined
            });
          }
        } else {
          setError('Erro ao carregar dados do usuário');
        }
      } catch (err) {
        setError('Erro ao carregar perfil');
        console.error('Erro ao carregar perfil:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Carregar dados do progresso quando o perfil estiver disponível
  useEffect(() => {
    if (userProfile?.id) {
      loadProgressoData();
    }
  }, [userProfile]);

  // Carregar histórico de peso
  useEffect(() => {
    const currentUserId = localStorageService.getCurrentUserId();
    if (currentUserId) {
      const savedWeightHistory = localStorageService.getWeightHistory(currentUserId);
      setWeightHistory(savedWeightHistory);
    }
  }, []);

  // Funções para gerenciar peso
  // Função para calcular progresso de peso usando o novo sistema
  const getProgressoPeso = () => {
    if (!userProfile?.id) return null;
    const registros = progressoService.getRegistrosPeso(userProfile.id);
    if (registros.length < 2) return null;
    
    const primeiro = registros[0];
    const ultimo = registros[registros.length - 1];
    const perda = primeiro.peso - ultimo.peso;
    
    return {
      perda: perda.toFixed(1),
      sinal: perda >= 0 ? '-' : '+'
    };
  };

  // Carregar dados de configuração e foto do perfil do localStorage
  useEffect(() => {
    const loadLocalStorageData = () => {
      const currentUserId = localStorageService.getCurrentUserId();
      
      if (!currentUserId) {
        console.warn('Usuário não está logado');
        return;
      }

      // Carregar foto do perfil específica do usuário
      const fotoSalva = localStorageService.getItem(`fotoPerfil_${currentUserId}`);
      if (fotoSalva) {
        setFotoPerfil(fotoSalva as string);
      }

      // Carregar dados de configuração do perfil específicos do usuário
       const configSalva = localStorageService.getItem(`perfilConfiguracao_${currentUserId}`);
       if (configSalva) {
         try {
           setPerfilConfig(configSalva as PerfilData);
         } catch (error) {
           console.error('Erro ao carregar configuração do perfil:', error);
         }
       }

       // Carregar dietas selecionadas específicas do usuário
       const dietasSalvas = localStorageService.getItem(`dietasSelecionadas_${currentUserId}`);
       if (dietasSalvas) {
         try {
           setDietasSelecionadas(dietasSalvas as string[] || []);
         } catch (error) {
           console.error('Erro ao carregar dietas selecionadas:', error);
         }
       }
    };

    loadLocalStorageData();

    // Listener para detectar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      const currentUserId = localStorageService.getCurrentUserId();
      if (!currentUserId) return;
      
      if (e.key === `fotoPerfil_${currentUserId}` && e.newValue) {
        setFotoPerfil(e.newValue);
      }
      if (e.key === `perfilConfiguracao_${currentUserId}` && e.newValue) {
         try {
           const config = JSON.parse(e.newValue);
           setPerfilConfig(config);
         } catch (error) {
           console.error('Erro ao carregar configuração do perfil:', error);
         }
       }
       if (e.key === 'dietasSelecionadas' && e.newValue) {
         try {
           const dietas = JSON.parse(e.newValue);
           setDietasSelecionadas(dietas || []);
         } catch (error) {
           console.error('Erro ao carregar dietas selecionadas:', error);
         }
       }
    };

    // Listener customizado para mudanças no mesmo tab
    const handleCustomStorageChange = () => {
      loadLocalStorageData();
      // Recarregar dados do progresso quando houver mudanças
      if (userProfile?.id) {
        loadProgressoData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageUpdate', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleCustomStorageChange);
    };
  }, []);

  // Função para obter dados do perfil (prioriza configuração local)
  const getPerfilData = () => {
    return perfilConfig || userProfile?.perfil || null;
  };

  // Função para calcular IMC
  const calculateIMC = (): number | null => {
    const perfil = getPerfilData();
    if (!perfil?.peso || !perfil?.altura) return null;
    const peso = (perfil.peso);
    const altura = (perfil.altura);
    return userService.calculateIMC(peso, altura);
  };

  // Função para calcular TMB
  const calculateTMB = (): number | null => {
    const perfil = getPerfilData();
    if (!perfil?.peso || !perfil?.altura || !perfil?.idade || !perfil?.sexo) return null;
    const peso = (perfil.peso);
    const altura = (perfil.altura);
    const idade = (perfil.idade);
    return userService.calculateTMB(peso, altura, idade, perfil.sexo);
  };

  // Função para calcular peso ideal usando fórmula de Devine
  const calculatePesoIdeal = (): number | null => {
    const perfil = getPerfilData();
    if (!perfil?.altura || !perfil?.sexo) return null;
    
    const altura = perfil.altura;
    
    // Fórmula de Devine
    if (perfil.sexo === 'masculino') {
      return 50 + 2.3 * ((altura - 152.4) / 2.54);
    } else {
      return 45.5 + 2.3 * ((altura - 152.4) / 2.54);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-emerald-600">Carregando perfil...</div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-emerald-800 mb-8 font-serif">Meu Perfil</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Informações do Perfil */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                  {fotoPerfil || userProfile?.imageUrl || userProfile?.perfil?.foto ? (
                    <Image 
                      src={fotoPerfil || userProfile?.imageUrl || userProfile?.perfil?.foto || ''} 
                      alt="Foto do perfil" 
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-emerald-600 text-4xl" />
                  )}
                </div>
                <h2 className="text-xl font-bold">{userProfile?.name || 'Usuário'}</h2>
                <p className="text-gray-500">{userProfile?.email}</p>
                <p className="text-sm text-emerald-600 mt-2">
                  Membro desde {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'N/A'}
                </p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold text-lg mb-4">Informações Pessoais</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faWeight} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Peso</span>
                    </div>
                    <span className="font-medium">
                      {getPerfilData()?.peso ? `${getPerfilData()?.peso} kg` : 'Não informado'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faRulerVertical} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Altura</span>
                    </div>
                    <span className="font-medium">
                      {getPerfilData()?.altura ? `${((getPerfilData()?.altura!) / 100).toFixed(2)} m` : 'Não informado'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Idade</span>
                    </div>
                    <span className="font-medium">
                      {getPerfilData()?.idade ? `${getPerfilData()?.idade} anos` : 'Não informado'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-500 mr-3" />
                      <span className="text-gray-600">Objetivo</span>
                    </div>
                    <span className="font-medium">
                      {getPerfilData()?.objetivo ? 
                        getPerfilData()?.objetivo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
                        'Não definido'
                      }
                    </span>
                  </div>
                  
                  {getPerfilData()?.sexo && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="text-emerald-500 mr-3" />
                        <span className="text-gray-600">Sexo</span>
                      </div>
                      <span className="font-medium">
                        {getPerfilData()?.sexo === 'masculino' ? 'Masculino' : 'Feminino'}
                      </span>
                    </div>
                  )}
                  
                  {getPerfilData()?.nivelAtividade && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-500 mr-3" />
                        <span className="text-gray-600">Nível de Atividade</span>
                      </div>
                      <span className="font-medium">
                        {getPerfilData()?.nivelAtividade === 'sedentario' && 'Sedentário'}
                        {getPerfilData()?.nivelAtividade === 'leve' && 'Levemente ativo'}
                        {getPerfilData()?.nivelAtividade === 'moderado' && 'Moderadamente ativo'}
                        {getPerfilData()?.nivelAtividade === 'ativo' && 'Muito ativo'}
                        {getPerfilData()?.nivelAtividade === 'extra' && 'Extremamente ativo'}
                      </span>
                    </div>
                  )}
                  
                  {/* Mostrar IMC se disponível */}
                  {calculateIMC() && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-500 mr-3" />
                        <span className="text-gray-600">IMC</span>
                      </div>
                      <span className="font-medium">
                        {calculateIMC()?.toFixed(1)} - {userService.getIMCClassification(calculateIMC()!)}
                      </span>
                    </div>
                  )}
                  
                  {/* Mostrar TMB se disponível */}
                  {calculateTMB() && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faHeartbeat} className="text-emerald-500 mr-3" />
                        <span className="text-gray-600">TMB</span>
                      </div>
                      <span className="font-medium">
                        {calculateTMB()?.toFixed(0)} kcal/dia
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  <Link href="/perfil/configuracao">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center" 
                      size="md"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Editar Perfil
                    </Button>
                  </Link>
                  
                  <Button 
                    onClick={() => setIsWeightModalOpen(true)}
                    variant="outline"
                    className="w-full flex items-center justify-center mt-4"
                    size="md"
                  >
                    <FontAwesomeIcon icon={faWeight} className="mr-2" />
                    Registrar Peso
                  </Button>
                  
                  {planoAtivo && (planoAtivo.plano.tipo === 'jejum' || planoAtivo.plano.tipo === 'combinado') && (
                    <Button 
                      onClick={() => setIsJejumModalOpen(true)}
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      size="md"
                    >
                      <span className="mr-2">🌙</span>
                      Registrar Jejum
                    </Button>
                  )}
                  
                  {planoAtivo && (planoAtivo.plano.tipo === 'dieta' || planoAtivo.plano.tipo === 'combinado') && (
                    <Button 
                      onClick={() => setIsDietaModalOpen(true)}
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      size="md"
                    >
                      <span className="mr-2">🍽️</span>
                      Registrar Dieta
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
          
          {/* Coluna da Direita - Progresso e Planos */}
          <div className="lg:col-span-2">
            {/* Seu progresso */}
            <Card className="p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-emerald-800">Seu progresso</h3>
                <button className="text-emerald-600 text-sm font-medium hover:underline">
                  Ver tudo
                </button>
              </div>
              
              {/* Estatísticas */}
              <div className="mb-6">
                <h4 className="font-bold text-lg mb-4">Estatísticas</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Peso atual</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {getPerfilData()?.peso ? `${getPerfilData()?.peso} kg` : '-- kg'}
                    </div>
                    <div className="text-sm text-orange-600">
                      {getProgressoPeso() ? 
                        `${getProgressoPeso()?.sinal}${getProgressoPeso()?.perda} kg total` : 
                        'Sem dados'
                      }
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">IMC</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {calculateIMC() ? calculateIMC()?.toFixed(1) : '--'}
                    </div>
                    <div className="text-sm text-blue-600">
                      {calculateIMC() ? userService.getIMCClassification(calculateIMC()!) : 'Sem dados'}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Dias na dieta</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {estatisticas?.diasNaDieta || 0} dias
                    </div>
                    <div className="text-sm text-green-600">
                      {estatisticas?.mediaJejum ? 
                        `Média de jejum: ${Math.floor(estatisticas.mediaJejum)}h ${Math.round((estatisticas.mediaJejum % 1) * 60)}min/dia` :
                        'Sem dados de jejum'
                      }
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Histórico de peso */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-lg">Histórico de peso</h4>
                  <button className="text-emerald-600 text-sm font-medium hover:underline">
                    Adicionar
                  </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-end justify-center space-x-2 h-32 mb-2">
                    {/* Gráfico simplificado com barras */}
                    <div className="bg-emerald-500 w-6 h-16 rounded-t"></div>
                    <div className="bg-emerald-500 w-6 h-20 rounded-t"></div>
                    <div className="bg-emerald-500 w-6 h-24 rounded-t"></div>
                    <div className="bg-emerald-500 w-6 h-20 rounded-t"></div>
                    <div className="bg-emerald-500 w-6 h-18 rounded-t"></div>
                    <div className="bg-emerald-500 w-6 h-16 rounded-t"></div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Últimas 6 medições - Objetivo: {calculatePesoIdeal()?.toFixed(0) || '--'} kg
                  </div>
                </div>
              </div>
              
              {/* Conquistas */}
              <div>
                <h4 className="font-bold text-lg mb-4">Conquistas</h4>
                <div className="grid grid-cols-4 gap-4">
                  {conquistas.length > 0 ? (
                    conquistas.slice(0, 4).map((conquista, index) => (
                      <div key={conquista.conquistaId} className="text-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                          conquista.desbloqueada 
                            ? 'bg-yellow-100' 
                            : 'bg-gray-100'
                        }`}>
                          <span className={`text-xl ${
                            conquista.desbloqueada 
                              ? 'text-yellow-600' 
                              : 'text-gray-400'
                          }`}>
                            {conquista.conquista.icone}
                          </span>
                        </div>
                        <div className={`text-xs font-medium ${
                          conquista.desbloqueada 
                            ? 'text-gray-900' 
                            : 'text-gray-500'
                        }`}>
                          {conquista.conquista.nome}
                        </div>
                      </div>
                    ))
                  ) : (
                    // Conquistas padrão quando não há dados
                    <>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-gray-400 text-xl">🏆</span>
                        </div>
                        <div className="text-xs font-medium text-gray-500">1ª semana</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-gray-400 text-xl">🌙</span>
                        </div>
                        <div className="text-xs font-medium text-gray-500">5 jejuns</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-gray-400 text-xl">📸</span>
                        </div>
                        <div className="text-xs font-medium text-gray-500">-3kg</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-gray-400 text-xl">💧</span>
                        </div>
                        <div className="text-xs font-medium text-gray-500">Cetose</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>
              
            {/* Planos Ativos */}
            <Card className="p-6">
              <h3 className="font-bold text-xl mb-4">Meus Planos Ativos</h3>
              
              <div className="space-y-4">
                {planoAtivo ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-lg">{planoAtivo.plano.nome}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          planoAtivo.plano.tipo === 'dieta' ? 'bg-blue-100 text-blue-800' :
                          planoAtivo.plano.tipo === 'jejum' ? 'bg-purple-100 text-purple-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {planoAtivo.plano.tipo === 'dieta' ? 'Dieta' :
                           planoAtivo.plano.tipo === 'jejum' ? 'Jejum' : 'Combinado'}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">Ativo</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{planoAtivo.plano.descricao}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Progresso: Semana {planoAtivo.semanaAtual} de {planoAtivo.plano.duracao}
                      </span>
                      <Link href="/dashboard/planos/gerenciar">
                        <Button variant="outline" size="sm">Ver Detalhes</Button>
                      </Link>
                    </div>
                    
                    {/* Barra de progresso */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((planoAtivo.semanaAtual / planoAtivo.plano.duracao) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.round((planoAtivo.semanaAtual / planoAtivo.plano.duracao) * 100)}% concluído
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📋</span>
                    <p className="text-gray-500 mb-4">Nenhum plano ativo encontrado</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Escolha um plano para começar sua jornada de saúde
                    </p>
                  </div>
                )}
              </div>
              
              <Link href="/dashboard/planos">
                <Button variant="primary" className="mt-6 w-full" size="md">
                  {planoAtivo ? 'Explorar Mais Planos' : 'Escolher Plano'}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Modais de Registro */}
      {isWeightModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <RegistrarPesoForm 
            onSuccess={handleRegistroSuccess}
            onCancel={() => setIsWeightModalOpen(false)}
          />
        </div>
      )}
      
      {isJejumModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <RegistrarJejumForm 
            onSuccess={handleRegistroSuccess}
            onCancel={() => setIsJejumModalOpen(false)}
          />
        </div>
      )}
      
      {isDietaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <RegistrarDietaForm 
            onSuccess={handleRegistroSuccess}
            onCancel={() => setIsDietaModalOpen(false)}
          />
        </div>
      )}
    </MainLayout>
  );
}