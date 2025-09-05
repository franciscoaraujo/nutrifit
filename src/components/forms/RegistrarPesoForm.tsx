'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Card from '@/components/ui/Card';
import { progressoService } from '@/services/ProgressoService';
import { useUser } from '@clerk/nextjs';

interface RegistrarPesoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RegistrarPesoForm({ onSuccess, onCancel }: RegistrarPesoFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    data: new Date().toISOString().split('T')[0], // Data atual
    peso: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    if (!formData.peso) {
      newErrors.peso = 'Peso é obrigatório';
    } else {
      const peso = parseFloat(formData.peso);
      if (isNaN(peso) || peso <= 0 || peso > 500) {
        newErrors.peso = 'Peso deve ser um número válido entre 1 e 500 kg';
      }
    }

    // Verificar se a data não é futura
    const dataRegistro = new Date(formData.data);
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999); // Final do dia atual
    
    if (dataRegistro > hoje) {
      newErrors.data = 'Data não pode ser futura';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user?.id) return;

    setLoading(true);
    try {
      const peso = parseFloat(formData.peso);
      const data = new Date(formData.data);
      
      progressoService.registrarPeso(user.id, data, peso);
      
      // Reset form
      setFormData({
        data: new Date().toISOString().split('T')[0],
        peso: ''
      });
      setErrors({});
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao registrar peso:', error);
      setErrors({ submit: 'Erro ao registrar peso. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrar Peso</h2>
        <p className="text-gray-600">Registre seu peso para acompanhar seu progresso.</p>
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
            max={new Date().toISOString().split('T')[0]} // Não permitir datas futuras
          />
          {errors.data && (
            <p className="text-red-500 text-xs mt-1">{errors.data}</p>
          )}
        </div>

        {/* Peso */}
        <div>
          <Label htmlFor="peso" className="text-sm font-medium text-gray-700">
            Peso (kg) *
          </Label>
          <Input
            id="peso"
            type="number"
            step="0.1"
            min="1"
            max="500"
            placeholder="Ex: 75.5"
            value={formData.peso}
            onChange={(e) => handleInputChange('peso', e.target.value)}
            className={`mt-1 ${errors.peso ? 'border-red-500' : ''}`}
          />
          {errors.peso && (
            <p className="text-red-500 text-xs mt-1">{errors.peso}</p>
          )}
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
            {loading ? 'Registrando...' : 'Registrar Peso'}
          </Button>
        </div>
      </form>

      {/* Dica */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <p className="text-blue-700 text-xs">
          💡 <strong>Dica:</strong> Para resultados mais precisos, pese-se sempre no mesmo horário, 
          preferencialmente pela manhã, em jejum e sem roupas pesadas.
        </p>
      </div>
    </Card>
  );
}