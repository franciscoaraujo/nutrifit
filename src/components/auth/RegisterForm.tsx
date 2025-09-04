'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Você precisa aceitar os termos de serviço.');
      setLoading(false);
      return;
    }

    try {
      console.log('Tentando registrar usuário...');
      
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };
      
      console.log('Dados do usuário:', { ...userData, password: '[HIDDEN]' });
      
      const success = await register(userData);

      if (success) {
        showSuccess('Conta criada com sucesso! Configure seu perfil para começar.');
        console.log('Redirecionando para configuração de perfil...');
        router.push('/perfil/configuracao');
      } else {
        console.error('Falha no registro');
        setError('Erro ao criar conta. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro durante o registro:', error);
      setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nome"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <Input
            label="Sobrenome"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        
        <Input
          label="Senha"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
        />
        
        <Input
          label="Confirmar Senha"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          fullWidth
        />
        
        <div className="flex items-center">
          <input
            type="checkbox"
            name="acceptTerms"
            id="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
            required
          />
          <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-600">
            Eu aceito os{' '}
            <a href="#" className="text-primary hover:underline">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="text-primary hover:underline">
              Política de Privacidade
            </a>
          </label>
        </div>
        
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Registrando...' : 'Criar Conta'}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Ou continue com
            </span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-gray-400" />
            <span className="ml-2">Google (Em breve)</span>
          </button>
          
          <button
            type="button"
            disabled
            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 text-gray-400" />
            <span className="ml-2">Facebook (Em breve)</span>
          </button>
        </div>
      </div>
    </div>
  );
}