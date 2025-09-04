'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import Progress from '@/components/ui/Progress';
import { progressoService } from '@/services/ProgressoService';
import { PlanoAtivo } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

export default function GerenciarPlanoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [planoAtivo, setPlanoAtivo] = useState<PlanoAtivo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const plano = progressoService.getPlanoAtivo(user.id);
      setPlanoAtivo(plano);
    }
  }, [user]);

  const handleEncerrarPlano = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      progressoService.desativarPlanoAtual(user.id);
      router.push('/dashboard/perfil');
    } catch (error) {
      console.error('Erro ao encerrar plano:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrocarPlano = () => {
    router.push('/dashboard/planos');
  };

  const calcularProgressoSemanas = () => {
    if (!planoAtivo) return 0;
    
    const dataInicio = new Date(planoAtivo.dataInicio);
    const hoje = new Date();
    const diffTime = hoje.getTime() - dataInicio.getTime();
    const diffSemanas = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return Math.min((diffSemanas / planoAtivo.plano.duracao) * 100, 100);
  };

  const calcularSemanasRestantes = () => {
    if (!planoAtivo) return 0;
    
    const dataInicio = new Date(planoAtivo.dataInicio);
    const hoje = new Date();
    const diffTime = hoje.getTime() - dataInicio.getTime();
    const semanasPassadas = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return Math.max(planoAtivo.plano.duracao - semanasPassadas, 0);
  };

  const formatarDataInicio = (data: Date) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'dieta': return 'bg-blue-100 text-blue-800';
      case 'jejum': return 'bg-purple-100 text-purple-800';
      case 'combinado': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (!planoAtivo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <span className="text-6xl">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nenhum Plano Ativo</h2>
          <p className="text-gray-600 mb-6">
            Você não possui nenhum plano ativo no momento. Escolha um plano para começar sua jornada!
          </p>
          <Button 
            onClick={() => router.push('/dashboard/planos')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Escolher Plano
          </Button>
        </Card>
      </div>
    );
  }

  const progressoSemanas = calcularProgressoSemanas();
  const semanasRestantes = calcularSemanasRestantes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Plano Ativo</h1>
        <p className="text-gray-600">Acompanhe seu progresso e gerencie seu plano atual.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações do Plano */}
        <div className="lg:col-span-2">
          <Card className="p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{planoAtivo.plano.nome}</h2>
                <div className="flex gap-2 mb-4">
                  <Badge className={getTipoColor(planoAtivo.plano.tipo)}>
                    {planoAtivo.plano.tipo === 'dieta' ? 'Dieta' : 
                     planoAtivo.plano.tipo === 'jejum' ? 'Jejum' : 'Combinado'}
                  </Badge>
                  <Badge className={getDificuldadeColor(planoAtivo.plano.dificuldade)}>
                    {planoAtivo.plano.dificuldade}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Iniciado em</div>
                <div className="font-semibold">{formatarDataInicio(planoAtivo.dataInicio)}</div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{planoAtivo.plano.descricao}</p>

            {/* Progresso */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Progresso do Plano</h3>
                <span className="text-sm text-gray-600">
                  {Math.floor(progressoSemanas)}% concluído
                </span>
              </div>
              <Progress value={progressoSemanas} className="mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Semana {planoAtivo.semanaAtual} de {planoAtivo.plano.duracao}</span>
                <span>{semanasRestantes} semanas restantes</span>
              </div>
            </div>

            {/* Protocolos (se aplicável) */}
            {planoAtivo.plano.protocolos && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Protocolos Disponíveis</h3>
                <div className="flex flex-wrap gap-2">
                  {planoAtivo.plano.protocolos.map((protocolo, index) => (
                    <Badge key={index} variant="outline">{protocolo}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Benefícios */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Benefícios</h3>
              <ul className="space-y-2">
                {planoAtivo.plano.beneficios.map((beneficio, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="text-emerald-500 mr-2">✓</span>
                    {beneficio}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Ações e Estatísticas */}
        <div>
          {/* Ações */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Ações</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleTrocarPlano}
                variant="outline"
                className="w-full"
              >
                Trocar Plano
              </Button>
              <Button 
                onClick={handleEncerrarPlano}
                disabled={loading}
                variant="destructive"
                className="w-full"
              >
                {loading ? 'Encerrando...' : 'Encerrar Plano'}
              </Button>
            </div>
          </Card>

          {/* Estatísticas Rápidas */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Duração Total</span>
                <span className="font-semibold">{planoAtivo.plano.duracao} semanas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Semana Atual</span>
                <span className="font-semibold">{planoAtivo.semanaAtual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Progresso</span>
                <span className="font-semibold">{Math.floor(progressoSemanas)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge className="bg-green-100 text-green-800">
                  {planoAtivo.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard/perfil')}
        >
          Voltar ao Perfil
        </Button>
      </div>
    </div>
  );
}