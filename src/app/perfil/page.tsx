'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faVenus, faMars, faRuler, faWeight, faBullseye, faRunning, faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { PerfilFormData, Sexo, Objetivo, NivelAtividade } from '@/types';
import { useToast } from '@/hooks/useToast';
import { localStorageService } from '@/services/LocalStorageService';
import { progressoService } from '@/services';
import { useUser } from '@clerk/nextjs';
import { RedirectToSignIn } from '@clerk/nextjs';

type PerfilData = PerfilFormData;

export default function ConfiguracaoPerfilPage() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { user, isLoaded } = useUser();

  // Redirecionar para login se não estiver autenticado
  if (isLoaded && !user) {
    return <RedirectToSignIn />;
  }

  // Mostrar loading enquanto carrega
  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const [perfil, setPerfil] = useState<PerfilData>({
    nome: '',
    sexo: '',
    idade: 0,
    altura: 0,
    peso: 0,
    objetivo: '',
    nivelAtividade: '',
    dietas: [],
    foto: ''
  });
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});


  // Carregar dados salvos do localStorage quando a página for carregada
  useEffect(() => {
    const carregarDadosSalvos = () => {
      const currentUserId = localStorageService.getCurrentUserId();
      if (!currentUserId) {
        console.warn('Usuário não está logado');
        return;
      }
      
      // Carregar dados de configuração do perfil específico do usuário
    const configSalva = localStorageService.getItem<PerfilFormData>(`perfilConfiguracao_${currentUserId}`);
    if (configSalva) {
      try {
        setPerfil(prev => ({
          ...prev,
          sexo: configSalva.sexo || '',
          idade: configSalva.idade || 0,
          altura: configSalva.altura || 0,
          peso: configSalva.peso || 0,
          objetivo: configSalva.objetivo || '',
          nivelAtividade: configSalva?.nivelAtividade || ''
        }));
      } catch (error) {
        console.error('Erro ao carregar configuração do perfil:', error);
      }
    }

      // Carregar foto do perfil específica do usuário
      const fotoSalva = localStorageService.getItem(`fotoPerfil_${currentUserId}`);
      if (fotoSalva) {
        setPerfil((prev: PerfilFormData): PerfilFormData => ({
          ...prev,
          foto: fotoSalva as string
        }));
      }


    };

    carregarDadosSalvos();
  }, []);



  const handleInputChange = (campo: keyof PerfilData, valor: string) => {
    setPerfil(prev => ({
      ...prev,
      [campo]: campo === 'idade' || campo === 'altura' || campo === 'peso' ? Number(valor) || 0 : valor
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (erros[campo]) {
      setErros(prev => {
        const novosErros = { ...prev };
        delete novosErros[campo];
        return novosErros;
      });
    }
  };

  const handleDietaToggle = (dieta: string) => {
    setPerfil(prev => {
      const dietasAtuais = prev.dietas || [];
      const dietaJaSelecionada = dietasAtuais.includes(dieta);
      
      if (dietaJaSelecionada) {
        // Remove a dieta se já estiver selecionada
        return {
          ...prev,
          dietas: dietasAtuais.filter(d => d !== dieta)
        };
      } else {
        // Adiciona a dieta se não estiver selecionada
        return {
          ...prev,
          dietas: [...dietasAtuais, dieta]
        };
      }
    });
  };

  const handleFotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPerfil(prev => ({
          ...prev,
          foto: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validarCampos = () => {
    const novosErros: Record<string, string> = {};
    
    if (!perfil.sexo) {
      novosErros.sexo = 'Sexo é obrigatório';
    }
    
    if (!perfil.idade || perfil.idade <= 0) {
      novosErros.idade = 'Idade é obrigatória';
    } else if (perfil.idade > 120) {
      novosErros.idade = 'Idade deve ser um número válido entre 1 e 120';
    }
    
    if (!perfil.altura || perfil.altura <= 0) {
      novosErros.altura = 'Altura é obrigatória';
    } else if (perfil.altura > 300) {
      novosErros.altura = 'Altura deve ser um número válido entre 1 e 300 cm';
    }
    
    if (!perfil.peso || perfil.peso <= 0) {
      novosErros.peso = 'Peso é obrigatório';
    } else if (perfil.peso > 500) {
      novosErros.peso = 'Peso deve ser um número válido entre 1 e 500 kg';
    }
    
    if (!perfil.objetivo) {
      novosErros.objetivo = 'Objetivo é obrigatório';
    }
    
    if (!perfil.nivelAtividade) {
      novosErros.nivelAtividade = 'Nível de atividade é obrigatório';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvarPerfil = async () => {
    if (!validarCampos()) {
      showError('Por favor, corrija os erros nos campos destacados.', 'Erro de validação');
      return;
    }

    const currentUserId = localStorageService.getCurrentUserId();
    
    if (!currentUserId) {
      showError('Usuário não está logado', 'Erro de autenticação');
      return;
    }

    setSalvando(true);
    
    // Simular salvamento
    setTimeout(() => {
      setSalvando(false);
      setSalvo(true);
      showSuccess('Perfil salvo com sucesso! Redirecionando...', 'Sucesso');
      
      // Salvar dados do perfil no localStorage específico do usuário
      if (perfil.foto) {
        localStorageService.setItem(`fotoPerfil_${currentUserId}`, perfil.foto);
      }
      
      // Salvar todos os dados de configuração do perfil específico do usuário
      const dadosConfiguracao = {
        sexo: perfil.sexo,
        idade: perfil.idade,
        altura: perfil.altura,
        peso: perfil.peso,
        objetivo: perfil.objetivo,
        nivelAtividade: perfil.nivelAtividade
      };
      localStorageService.setItem(`perfilConfiguracao_${currentUserId}`, dadosConfiguracao);
      

      
      // Disparar evento customizado para notificar outras páginas
      window.dispatchEvent(new Event('localStorageUpdate'));
      
      // Redirecionar para a página de perfil após 2 segundos
      setTimeout(() => {
        router.push('/perfil');
      }, 2000);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 font-serif flex items-center gap-3">
              <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
              Cadastro de Perfil
            </h1>
            <p className="text-gray-600 mt-2">Complete suas informações pessoais para personalizar sua experiência</p>
          </div>
        </div>

        {/* Formulário de Perfil */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-emerald-800 mb-8 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
            Informações Pessoais
          </h2>
          
          <div className="space-y-8">
            {/* Foto do Perfil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Foto do Perfil
              </label>
              <div className="flex items-center gap-6">
                {/* Preview da foto */}
                <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  {perfil.foto ? (
                    <Image 
                      src={perfil.foto} 
                      alt="Foto do perfil" 
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-2xl" />
                  )}
                </div>
                
                {/* Botão de upload */}
                <div>
                  <input
                    type="file"
                    id="foto-upload"
                    accept="image/*"
                    onChange={handleFotoUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="foto-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUpload} />
                    Escolher Foto
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Sexo *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sexo"
                    value="feminino"
                    checked={perfil.sexo === 'feminino'}
                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                    perfil.sexo === 'feminino' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.sexo
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <FontAwesomeIcon icon={faVenus} className="text-xl" />
                    <span className="font-medium">Feminino</span>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="sexo"
                    value="masculino"
                    checked={perfil.sexo === 'masculino'}
                    onChange={(e) => handleInputChange('sexo', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                    perfil.sexo === 'masculino' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.sexo
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <FontAwesomeIcon icon={faMars} className="text-xl" />
                    <span className="font-medium">Masculino</span>
                  </div>
                </label>
              </div>
              {erros.sexo && (
                <p className="text-red-500 text-sm mt-2">{erros.sexo}</p>
              )}
            </div>

            {/* Dados Físicos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade (anos) *
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 25"
                  value={perfil.idade}
                  onChange={(e) => handleInputChange('idade', e.target.value)}
                  fullWidth
                  min="10"
                  max="100"
                  className={erros.idade ? 'border-red-500' : ''}
                />
                {erros.idade && (
                  <p className="text-red-500 text-sm mt-1">{erros.idade}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faRuler} className="mr-2 text-emerald-600" />
                  Altura (cm) *
                </label>
                <Input
                  type="number"
                  placeholder="Ex: 170"
                  value={perfil.altura}
                  onChange={(e) => handleInputChange('altura', e.target.value)}
                  fullWidth
                  min="100"
                  max="250"
                  className={erros.altura ? 'border-red-500' : ''}
                />
                {erros.altura && (
                  <p className="text-red-500 text-sm mt-1">{erros.altura}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FontAwesomeIcon icon={faWeight} className="mr-2 text-emerald-600" />
                  Peso (kg) *
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Ex: 70.5"
                  value={perfil.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  fullWidth
                  className={erros.peso ? 'border-red-500' : ''}
                  min="30"
                  max="300"
                />
                {erros.peso && (
                  <p className="text-red-500 text-sm mt-1">{erros.peso}</p>
                )}
              </div>
            </div>

            {/* Objetivos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <FontAwesomeIcon icon={faBullseye} className="mr-2 text-emerald-600" />
                Objetivo *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="objetivo"
                    value="emagrecimento"
                    checked={perfil.objetivo === 'emagrecimento'}
                    onChange={(e) => handleInputChange('objetivo', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full text-center px-4 py-4 rounded-lg border-2 transition-all ${
                    perfil.objetivo === 'emagrecimento' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.objetivo
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div className="font-medium">Emagrecimento</div>
                    <div className="text-xs mt-1">Perder peso</div>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="objetivo"
                    value="manutencao"
                    checked={perfil.objetivo === 'manutencao'}
                    onChange={(e) => handleInputChange('objetivo', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full text-center px-4 py-4 rounded-lg border-2 transition-all ${
                    perfil.objetivo === 'manutencao' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.objetivo
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div className="font-medium">Manutenção</div>
                    <div className="text-xs mt-1">Manter peso</div>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="objetivo"
                    value="ganho_massa"
                    checked={perfil.objetivo === 'ganho_massa'}
                    onChange={(e) => handleInputChange('objetivo', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full text-center px-4 py-4 rounded-lg border-2 transition-all ${
                    perfil.objetivo === 'ganho_massa' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.objetivo
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div className="font-medium">Ganho de Massa</div>
                    <div className="text-xs mt-1">Ganhar peso/músculo</div>
                  </div>
                </label>
              </div>
              {erros.objetivo && (
                <p className="text-red-500 text-sm mt-2">{erros.objetivo}</p>
              )}
            </div>

            {/* Nível de Atividade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <FontAwesomeIcon icon={faRunning} className="mr-2 text-emerald-600" />
                Nível de Atividade Física *
              </label>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="nivelAtividade"
                    value="sedentario"
                    checked={perfil.nivelAtividade === 'sedentario'}
                    onChange={(e) => handleInputChange('nivelAtividade', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                    perfil.nivelAtividade === 'sedentario' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.nivelAtividade
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div>
                      <div className="font-medium">Sedentário</div>
                      <div className="text-sm">Pouco ou nenhum exercício</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="nivelAtividade"
                    value="leve"
                    checked={perfil.nivelAtividade === 'leve'}
                    onChange={(e) => handleInputChange('nivelAtividade', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                    perfil.nivelAtividade === 'leve' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : erros.nivelAtividade
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div>
                      <div className="font-medium">Levemente ativo</div>
                      <div className="text-sm">Exercício leve 1-3 dias/semana</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="nivelAtividade"
                    value="moderado"
                    checked={perfil.nivelAtividade === 'moderado'}
                    onChange={(e) => handleInputChange('nivelAtividade', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                    perfil.nivelAtividade === 'moderado' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.nivelAtividade
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div>
                      <div className="font-medium">Moderadamente ativo</div>
                      <div className="text-sm">Exercício moderado 3-5 dias/semana</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="nivelAtividade"
                    value="ativo"
                    checked={perfil.nivelAtividade === 'ativo'}
                    onChange={(e) => handleInputChange('nivelAtividade', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                    perfil.nivelAtividade === 'ativo' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                      : erros.nivelAtividade
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div>
                      <div className="font-medium">Muito ativo</div>
                      <div className="text-sm">Exercício intenso 6-7 dias/semana</div>
                    </div>
                  </div>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="nivelAtividade"
                    value="extra"
                    checked={perfil.nivelAtividade === 'extra'}
                    onChange={(e) => handleInputChange('nivelAtividade', e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                    perfil.nivelAtividade === 'extra' 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : erros.nivelAtividade
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div>
                      <div className="font-medium">Extremamente ativo</div>
                      <div className="text-sm">Exercício muito intenso diariamente ou trabalho físico</div>
                    </div>
                  </div>
                </label>
              </div>
              {erros.nivelAtividade && (
                <p className="text-red-500 text-sm mt-2">{erros.nivelAtividade}</p>
              )}
            </div>



            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t">
              <Button 
                variant="primary" 
                size="lg"
                onClick={salvarPerfil}
                disabled={salvando}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {salvando ? 'Salvando...' : 'Finalizar Cadastro'}
              </Button>
            </div>

            {/* Mensagem de Sucesso */}
            {salvo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-700">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Perfil cadastrado com sucesso!
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Informações Adicionais */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-emerald-800 mb-4">Por que precisamos dessas informações?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Dados Pessoais</h4>
                <ul className="space-y-1">
                  <li>• <strong>Sexo:</strong> Influencia o metabolismo basal</li>
                  <li>• <strong>Idade:</strong> Afeta as necessidades calóricas</li>
                  <li>• <strong>Altura e Peso:</strong> Calculam o IMC e necessidades energéticas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Objetivos e Atividade</h4>
                <ul className="space-y-1">
                  <li>• <strong>Objetivo:</strong> Define o déficit/superávit calórico</li>
                  <li>• <strong>Nível de Atividade:</strong> Ajusta o gasto energético total</li>
                  <li>• <strong>Personalização:</strong> Recomendações específicas para você</li>
                </ul>
              </div>

            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}