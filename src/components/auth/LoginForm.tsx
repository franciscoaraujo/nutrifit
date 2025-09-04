'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { localStorageService } from '@/services/LocalStorageService';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createTestUser = () => {
    try {
      const testUser = {
        id: 'test-user-123',
        name: 'Usuário Teste',
        email: 'teste@email.com',
        password: '123456',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Verificar se o usuário já existe
      const existingUser = localStorageService.findUserByEmail(testUser.email);
      
      if (!existingUser) {
        // Adicionar usuário
        localStorageService.addUser(testUser);
        localStorageService.setUserData(testUser.id, testUser);
        showSuccess('Usuário de teste criado! Email: teste@email.com, Senha: 123456');
      } else {
        showSuccess('Usuário de teste já existe! Email: teste@email.com, Senha: 123456');
      }
      
      // Preencher o formulário automaticamente
      setFormData({
        email: 'teste@email.com',
        password: '123456',
        rememberMe: false
      });
    } catch (error) {
      console.error('Erro ao criar usuário de teste:', error);
      showError('Erro ao criar usuário de teste');
    }
  };

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

    try {
      const success = await login(formData.email, formData.password);

      if (success) {
        showSuccess('Login realizado com sucesso!');
        
        // Verificar se há uma URL de redirecionamento
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || '/dashboard';
        
        router.push(redirectUrl);
      } else {
        setError('Credenciais inválidas. Por favor, tente novamente.');
        showError('Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro interno. Tente novamente mais tarde.');
      showError('Erro interno. Tente novamente mais tarde.');
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
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
        />
        
        <div className="space-y-2">
          <Input
            label="Senha"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
          />
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
            </label>
            
            <a
              href="#"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Esqueceu a senha?
            </a>
          </div>
        </div>
        
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        
        <Button 
          type="button" 
          variant="secondary" 
          fullWidth 
          onClick={createTestUser}
          className="mt-2"
        >
          Criar Usuário de Teste
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