'use client';

import { useAuthApi } from '@/hooks/useAuth';
import { useState } from 'react';

export default function TestApiPage() {
  const { sendProfile, isLoading, error, isAuthenticated, userId } = useAuthApi();
  const [result, setResult] = useState<any>(null);

  const getTestData = () => ({
    nome: "Teste Usuario",
    email: "teste@email.com",
    sexo: "masculino",
    idade: 30,
    altura: 175,
    peso: 70,
    objetivo: "perder_peso",
    nivelAtividade: "moderado",
    timestamp: new Date().toISOString(),
    source: "nutri-fit-app-test"
  });

  const handleTest = async () => {
    const testData = getTestData();
    console.log('=== INICIANDO TESTE ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('userId:', userId);
    console.log('testData:', testData);
    
    try {
      const response = await sendProfile(testData);
      console.log('=== RESULTADO DO TESTE ===', response);
      setResult(response);
    } catch (err) {
      console.error('=== ERRO NO TESTE ===', err);
      setResult({ error: err });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste da API</h1>
      
      <div className="mb-4">
        <p><strong>Autenticado:</strong> {isAuthenticated ? 'Sim' : 'Não'}</p>
        <p><strong>User ID:</strong> {userId || 'Não disponível'}</p>
        <p><strong>Carregando:</strong> {isLoading ? 'Sim' : 'Não'}</p>
        <p><strong>Erro:</strong> {error || 'Nenhum'}</p>
      </div>

      <button 
        onClick={handleTest}
        disabled={isLoading || !isAuthenticated}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {isLoading ? 'Enviando...' : 'Testar API'}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Resultado:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 p-4 bg-yellow-100 rounded">
        <h3 className="font-bold">Dados de Teste (exemplo):</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify({
            nome: "Teste Usuario",
            email: "teste@email.com",
            sexo: "masculino",
            idade: 30,
            altura: 175,
            peso: 70,
            objetivo: "perder_peso",
            nivelAtividade: "moderado",
            timestamp: "[timestamp será gerado ao clicar]",
            source: "nutri-fit-app-test"
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}