'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faUser, faVenus, faMars, faRuler, faWeight, faBullseye, faRunning, faSave } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

interface PerfilData {
  sexo: 'feminino' | 'masculino' | '';
  idade: string;
  altura: string;
  peso: string;
  objetivo: 'emagrecimento' | 'manutencao' | 'ganho_massa' | '';
  nivelAtividade: 'sedentario' | 'leve' | 'moderado' | 'ativo' | 'extra' | '';
}

export default function ConfiguracaoPerfilPage() {
  const [perfil, setPerfil] = useState<PerfilData>({
    sexo: '',
    idade: '',
    altura: '',
    peso: '',
    objetivo: '',
    nivelAtividade: ''
  });
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const handleInputChange = (campo: keyof PerfilData, valor: string) => {
    setPerfil(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const salvarPerfil = async () => {
    if (!perfil.sexo || !perfil.idade || !perfil.altura || !perfil.peso || !perfil.objetivo || !perfil.nivelAtividade) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    
    // Simular salvamento
    setTimeout(() => {
      setSalvando(false);
      setSalvo(true);
      setTimeout(() => setSalvo(false), 3000);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800 font-serif flex items-center gap-3">
              <FontAwesomeIcon icon={faCog} className="text-emerald-600" />
              Configuração de Perfil
            </h1>
            <p className="text-gray-600 mt-2">Configure suas informações pessoais para receber recomendações personalizadas</p>
          </div>
        </div>

        {/* Formulário de Perfil */}
        <Card className="p-8">
          <h2 className="text-xl font-bold text-emerald-800 mb-8 flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="text-emerald-600" />
            Informações Pessoais
          </h2>
          
          <div className="space-y-8">
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
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <FontAwesomeIcon icon={faMars} className="text-xl" />
                    <span className="font-medium">Masculino</span>
                  </div>
                </label>
              </div>
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
                />
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
                />
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
                  min="30"
                  max="300"
                />
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
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div className="font-medium">Ganho de Massa</div>
                    <div className="text-xs mt-1">Ganhar peso/músculo</div>
                  </div>
                </label>
              </div>
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
                      : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-300'
                  }`}>
                    <div>
                      <div className="font-medium">Extremamente ativo</div>
                      <div className="text-sm">Exercício muito intenso diariamente ou trabalho físico</div>
                    </div>
                  </div>
                </label>
              </div>
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
                {salvando ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </div>

            {/* Mensagem de Sucesso */}
            {salvo && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-700">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faSave} className="mr-2" />
                  Configurações salvas com sucesso!
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