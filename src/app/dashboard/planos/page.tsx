'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { progressoService } from '@/services/ProgressoService';
import { Plano, PlanoAtivo } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

export default function EscolhaPlanoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedPlano, setSelectedPlano] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [planoAtivo, setPlanoAtivo] = useState<PlanoAtivo | null>(null);

  useEffect(() => {
    if (user?.id) {
      const plano = progressoService.getPlanoAtivo(user.id);
      setPlanoAtivo(plano);
    }
  }, [user]);

  const planos = progressoService.getPlanos();
  const planosDieta = planos.filter(p => p.tipo === 'dieta');
  const planosJejum = planos.filter(p => p.tipo === 'jejum');
  const planosCombinados = planos.filter(p => p.tipo === 'combinado');

  const handleAtivarPlano = async (planoId: string) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      progressoService.ativarPlano(user.id, planoId);
      router.push('/dashboard/perfil');
    } catch (error) {
      console.error('Erro ao ativar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'iniciante': return 'bg-green-100 text-green-800';
      case 'intermediario': return 'bg-yellow-100 text-yellow-800';
      case 'avancado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'dieta': return 'bg-blue-100 text-blue-800';
      case 'jejum': return 'bg-purple-100 text-purple-800';
      case 'combinado': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isPlanoAtivo = (planoId: string) => {
    return planoAtivo?.plano.id === planoId;
  };

  const PlanoCard = ({ plano }: { plano: Plano }) => {
    const ativo = isPlanoAtivo(plano.id);
    
    return (
      <Card className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
        selectedPlano === plano.id ? 'ring-2 ring-emerald-500 bg-emerald-50' : ''
      } ${
        ativo ? 'ring-2 ring-green-500 bg-green-50 border-green-200' : ''
      }`} onClick={() => !ativo && setSelectedPlano(plano.id)}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-xl text-gray-900">{plano.nome}</h3>
          <div className="flex gap-2">
            {ativo && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                ✓ Ativo
              </Badge>
            )}
            <Badge className={getTipoColor(plano.tipo)}>
              {plano.tipo === 'dieta' ? 'Dieta' : plano.tipo === 'jejum' ? 'Jejum' : 'Combinado'}
            </Badge>
            <Badge className={getDificuldadeColor(plano.dificuldade)}>
              {plano.dificuldade}
            </Badge>
          </div>
        </div>
      
      <p className="text-gray-600 mb-4">{plano.descricao}</p>
      
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-2">Duração: {plano.duracao} semanas</div>
        {plano.protocolos && (
          <div className="text-sm text-gray-500 mb-2">
            Protocolos: {plano.protocolos.join(', ')}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Benefícios:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {plano.beneficios.map((beneficio, index) => (
            <li key={index} className="flex items-center">
              <span className="text-emerald-500 mr-2">✓</span>
              {beneficio}
            </li>
          ))}
        </ul>
      </div>
      
        {ativo ? (
          <div className="mt-4">
            <Button 
              disabled
              className="w-full bg-green-600 text-white cursor-not-allowed opacity-75"
            >
              ✓ Plano Ativo
            </Button>
            <p className="text-center text-sm text-green-600 mt-2">
              Semana {planoAtivo?.semanaAtual} de {planoAtivo?.plano.duracao}
            </p>
          </div>
        ) : (
          selectedPlano === plano.id && (
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleAtivarPlano(plano.id);
              }}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Ativando...' : 'Ativar Plano'}
            </Button>
          )
        )}
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Escolha seu Plano</h1>
        <p className="text-gray-600">Selecione o plano que melhor se adapta aos seus objetivos e estilo de vida.</p>
      </div>

      {/* Planos de Dieta */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-blue-500 mr-2">🍽️</span>
          Planos de Dieta
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planosDieta.map((plano) => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>
      </div>

      {/* Planos de Jejum */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-purple-500 mr-2">🌙</span>
          Planos de Jejum
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planosJejum.map((plano) => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>
      </div>

      {/* Planos Combinados */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-orange-500 mr-2">🔥</span>
          Planos Combinados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planosCombinados.map((plano) => (
            <PlanoCard key={plano.id} plano={plano} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mr-4"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}