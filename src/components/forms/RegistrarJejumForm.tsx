'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Card from '@/components/ui/Card';
import { progressoService } from '@/services/ProgressoService';
import { useAuth } from '@/hooks/useAuth';
import { PlanoAtivo } from '@/types/user';

interface RegistrarJejumFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RegistrarJejumForm({ onSuccess, onCancel }: RegistrarJejumFormProps) {
  const { user } = useAuth();
  const [planoAtivo, setPlanoAtivo] = useState<PlanoAtivo | null>(null);
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0],
    horaInicio: '',
    horaFim: '',
    protocolo: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [duracaoCalculada, setDuracaoCalculada] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      const plano = progressoService.getPlanoAtivo(user.id);
      setPlanoAtivo(plano);
      
      // Se há protocolos disponíveis, definir o primeiro como padrão
      if (plano?.plano.protocolos && plano.plano.protocolos.length > 0) {
        setFormData(prev => ({ ...prev, protocolo: plano.plano.protocolos![0] }));
      }
    }
  }, [user]);

  useEffect(() => {
    // Calcular duração quando horários mudarem
    if (formData.horaInicio && formData.horaFim) {
      const duracao = calcularDuracao(formData.horaInicio, formData.horaFim);
      setDuracaoCalculada(duracao);
    } else {
      setDuracaoCalculada(null);
    }
  }, [formData.horaInicio, formData.horaFim]);

  const calcularDuracao = (horaInicio: string, horaFim: string): number => {
    const [horaIni, minIni] = horaInicio.split(':').map(Number);
    const [horaFim_, minFim] = horaFim.split(':').map(Number);
    
    const inicioMinutos = horaIni * 60 + minIni;
    let fimMinutos = horaFim_ * 60 + minFim;
    
    // Se hora fim é menor que início, assumir que passou para o próximo dia
    if (fimMinutos < inicioMinutos) {
      fimMinutos += 24 * 60;
    }
    
    return (fimMinutos - inicioMinutos) / 60;
  };

  const formatarDuracao = (horas: number): string => {
    const horasInteiras = Math.floor(horas);
    const minutos = Math.round((horas - horasInteiras) * 60);
    
    if (minutos === 0) {
      return `${horasInteiras}h`;
    }
    return `${horasInteiras}h ${minutos}min`;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = 'Hora de início é obrigatória';
    }

    if (!formData.horaFim) {
      newErrors.horaFim = 'Hora de fim é obrigatória';
    }

    if (!formData.protocolo) {
      newErrors.protocolo = 'Protocolo é obrigatório';
    }

    // Verificar se a data não é futura
    const dataRegistro = new Date(formData.data);
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    
    if (dataRegistro > hoje) {
      newErrors.data = 'Data não pode ser futura';
    }

    // Verificar duração mínima
    if (duracaoCalculada !== null && duracaoCalculada < 12) {
      newErrors.duracao = 'Jejum deve ter pelo menos 12 horas';
    }

    // Verificar duração máxima
    if (duracaoCalculada !== null && duracaoCalculada > 72) {
      newErrors.duracao = 'Jejum não deve exceder 72 horas';
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
      
      progressoService.registrarJejum(
        user.id,
        data,
        formData.horaInicio,
        formData.horaFim,
        formData.protocolo
      );
      
      // Reset form
      setFormData({
        data: new Date().toISOString().split('T')[0],
        horaInicio: '',
        horaFim: '',
        protocolo: planoAtivo?.plano.protocolos?.[0] || ''
      });
      setErrors({});
      setDuracaoCalculada(null);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao registrar jejum:', error);
      setErrors({ submit: 'Erro ao registrar jejum. Tente novamente.' });
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

  // Verificar se o usuário tem plano de jejum ativo
  if (!planoAtivo || (planoAtivo.plano.tipo !== 'jejum' && planoAtivo.plano.tipo !== 'combinado')) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <div className="text-center">
          <span className="text-4xl mb-4 block">🌙</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Jejum Não Disponível</h2>
          <p className="text-gray-600 mb-4">
            Você precisa ter um plano de jejum ativo para registrar jejuns.
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard/planos'}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Escolher Plano de Jejum
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrar Jejum</h2>
        <p className="text-gray-600">Registre seu jejum para acompanhar seu progresso.</p>
        <div className="mt-2 text-sm text-emerald-600">
          Plano ativo: <strong>{planoAtivo.plano.nome}</strong>
        </div>
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

        {/* Hora de Início */}
        <div>
          <Label htmlFor="horaInicio" className="text-sm font-medium text-gray-700">
            Hora de Início *
          </Label>
          <Input
            id="horaInicio"
            type="time"
            value={formData.horaInicio}
            onChange={(e) => handleInputChange('horaInicio', e.target.value)}
            className={`mt-1 ${errors.horaInicio ? 'border-red-500' : ''}`}
          />
          {errors.horaInicio && (
            <p className="text-red-500 text-xs mt-1">{errors.horaInicio}</p>
          )}
        </div>

        {/* Hora de Fim */}
        <div>
          <Label htmlFor="horaFim" className="text-sm font-medium text-gray-700">
            Hora de Fim *
          </Label>
          <Input
            id="horaFim"
            type="time"
            value={formData.horaFim}
            onChange={(e) => handleInputChange('horaFim', e.target.value)}
            className={`mt-1 ${errors.horaFim ? 'border-red-500' : ''}`}
          />
          {errors.horaFim && (
            <p className="text-red-500 text-xs mt-1">{errors.horaFim}</p>
          )}
        </div>

        {/* Protocolo */}
        <div>
          <Label htmlFor="protocolo" className="text-sm font-medium text-gray-700">
            Tipo de Protocolo *
          </Label>
          <Select value={formData.protocolo} onValueChange={(value) => handleInputChange('protocolo', value)}>
            <SelectTrigger className={`mt-1 ${errors.protocolo ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Selecione o protocolo" />
            </SelectTrigger>
            <SelectContent>
              {planoAtivo.plano.protocolos?.map((protocolo) => (
                <SelectItem key={protocolo} value={protocolo}>
                  {protocolo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.protocolo && (
            <p className="text-red-500 text-xs mt-1">{errors.protocolo}</p>
          )}
        </div>

        {/* Duração Calculada */}
        {duracaoCalculada !== null && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-700 text-sm">
              <strong>Duração calculada:</strong> {formatarDuracao(duracaoCalculada)}
            </p>
          </div>
        )}

        {/* Erro de duração */}
        {errors.duracao && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errors.duracao}</p>
          </div>
        )}

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
            {loading ? 'Registrando...' : 'Registrar Jejum'}
          </Button>
        </div>
      </form>

      {/* Dica */}
      <div className="mt-6 p-3 bg-purple-50 rounded-lg">
        <p className="text-purple-700 text-xs">
          💡 <strong>Dica:</strong> Registre seu jejum logo após completá-lo para não esquecer 
          dos horários exatos. Isso ajuda a manter um histórico preciso.
        </p>
      </div>
    </Card>
  );
}