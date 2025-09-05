'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { progressoService } from '@/services/ProgressoService';
import { useUser } from '@clerk/nextjs';
import { PlanoAtivo } from '@/types/user';

interface RegistrarDietaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RegistrarDietaForm({ onSuccess, onCancel }: RegistrarDietaFormProps) {
  const { user } = useUser();
  const [planoAtivo, setPlanoAtivo] = useState<PlanoAtivo | null>(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user?.id) {
      const plano = progressoService.getPlanoAtivo(user.id);
      setPlanoAtivo(plano);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    // Verificar se a data não é futura
    const dataRegistro = new Date(formData.data);
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    
    if (dataRegistro > hoje) {
      newErrors.data = 'Data não pode ser futura';
    }

    // Verificar se já existe registro para esta data
    if (user?.id) {
      const registrosExistentes = progressoService.getRegistrosDieta(user.id);
      const jaRegistrado = registrosExistentes.some(registro => {
        const dataExistente = new Date(registro.data).toDateString();
        const novaData = new Date(formData.data).toDateString();
        return dataExistente === novaData;
      });
      
      if (jaRegistrado) {
        newErrors.data = 'Já existe um registro para esta data';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    try {
      const data = new Date(formData.data);
      
      progressoService.registrarDiaDieta(
        user.id,
        data,
        formData.observacoes || undefined
      );
      
      // Reset form
      setFormData({
        data: new Date().toISOString().split('T')[0],
        observacoes: ''
      });
      setErrors({});
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao registrar dia de dieta:', error);
      setErrors({ submit: 'Erro ao registrar dia de dieta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  // Verificar se o usuário tem plano alimentar ativo (exceto jejum isolado)
  if (!planoAtivo || planoAtivo.plano.tipo === 'jejum') {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🍽️</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dieta Não Disponível</h2>
          <p className="text-gray-600 mb-4">
            Você precisa ter um plano alimentar ativo para registrar dias de dieta.
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard/planos'}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Escolher Plano Alimentar
          </Button>
        </div>
      </Card>
    );
  }

  const calcularSequenciaAtual = () => {
    if (!user?.id) return 0;
    const registros = progressoService.getRegistrosDieta(user.id);
    return progressoService.getEstatisticasProgresso(user.id).sequenciaAtual;
  };

  const sequenciaAtual = calcularSequenciaAtual();

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrar Dia de Dieta</h2>
        <p className="text-gray-600 mb-3">Registre que você seguiu sua dieta hoje.</p>
        
        {/* Informações do plano ativo */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-800">Plano Ativo</span>
            <Badge className={getTipoColor(planoAtivo.plano.tipo)}>
              {planoAtivo.plano.tipo === 'dieta' ? 'Dieta' : 
               planoAtivo.plano.tipo === 'combinado' ? 'Combinado' : 'Jejum'}
            </Badge>
          </div>
          <div className="text-emerald-700 font-semibold">{planoAtivo.plano.nome}</div>
          <div className="text-emerald-600 text-sm mt-1">
            Semana {planoAtivo.semanaAtual} de {planoAtivo.plano.duracao}
          </div>
        </div>

        {/* Sequência atual */}
        {sequenciaAtual > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">🔥</span>
              <span className="text-blue-700 font-semibold">
                {sequenciaAtual} {sequenciaAtual === 1 ? 'dia consecutivo' : 'dias consecutivos'}
              </span>
            </div>
            <div className="text-blue-600 text-xs mt-1">
              Continue assim para manter sua sequência!
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Data */}
        <div>
          <Label htmlFor="data" className="text-sm font-medium text-gray-700">
            Data *
          </Label>
          <Input
            id="data"
            type="date"
            value={formData.data}
            onChange={(e) => handleInputChange('data', e.target.value)}
            className={`mt-1 ${errors.data ? 'border-red-500' : ''}`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.data && (
            <p className="text-red-500 text-xs mt-1">{errors.data}</p>
          )}
        </div>

        {/* Observações */}
        <div>
          <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
            Observações (opcional)
          </Label>
          <Textarea
            id="observacoes"
            placeholder="Como foi seu dia? Alguma dificuldade ou conquista?"
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            className="mt-1 resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.observacoes.length}/500 caracteres
          </div>
        </div>

        {/* Erro geral */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Registrando...' : 'Registrar Dia'}
          </Button>
        </div>
      </form>

      {/* Dicas */}
      <div className="mt-6 space-y-3">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-green-700 text-xs">
            💡 <strong>Dica:</strong> Registre seu dia mesmo que não tenha sido perfeito. 
            O importante é manter a consistência e aprender com cada experiência.
          </p>
        </div>
        
        {planoAtivo.plano.beneficios.length > 0 && (
          <div className="p-3 bg-emerald-50 rounded-lg">
            <p className="text-emerald-700 text-xs font-semibold mb-1">
              Benefícios do seu plano:
            </p>
            <ul className="text-emerald-600 text-xs space-y-1">
              {planoAtivo.plano.beneficios.slice(0, 2).map((beneficio, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-1">•</span>
                  {beneficio}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}