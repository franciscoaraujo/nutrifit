# Integração com APIs Externas usando Clerk

Este documento explica como usar tokens do Clerk para autenticar requisições para APIs externas na aplicação NutriFit.

## Visão Geral

A integração permite que você:
- Obtenha tokens JWT do Clerk
- Use esses tokens para autenticar requisições para APIs externas
- Mantenha a segurança e consistência da autenticação

## Componentes Criados

### 1. ClerkApiService

**Localização:** `src/services/ClerkApiService.ts`

Serviço singleton que gerencia requisições autenticadas para APIs externas.

```typescript
import { clerkApiService } from '@/services/ClerkApiService';

// Fazer uma requisição autenticada
const result = await clerkApiService.makeAuthenticatedRequest('/endpoint', {
  method: 'POST',
  body: { data: 'exemplo' },
  getToken: () => getToken({ template: 'default' })
});
```

### 2. useClerkApi Hook

**Localização:** `src/hooks/useClerkApi.ts`

Hook React que facilita o uso do ClerkApiService em componentes.

```typescript
import { useClerkApi } from '@/hooks/useClerkApi';

function MeuComponente() {
  const { sendProfile, isLoading, error } = useClerkApi();
  
  const handleEnviar = async () => {
    const resultado = await sendProfile({ dados: 'exemplo' });
    console.log(resultado);
  };
  
  return (
    <button onClick={handleEnviar} disabled={isLoading}>
      {isLoading ? 'Enviando...' : 'Enviar'}
    </button>
  );
}
```

## Exemplos de Uso

### Exemplo Básico (seguindo o padrão fornecido)

```typescript
"use client";
import { useAuth } from "@clerk/nextjs";

export default function CallApiButton() {
  const { getToken } = useAuth();

  const callApi = async () => {
    const token = await getToken({ template: "default" });

    const res = await fetch("http://localhost:8080/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ extraInfo: "algum dado do perfil" }),
    });

    const data = await res.json();
    console.log("Resposta da API:", data);
  };

  return <button onClick={callApi}>Enviar Perfil</button>;
}
```

### Exemplo com Hook Customizado

```typescript
import { useClerkApi } from '@/hooks/useClerkApi';

function PerfilComponent() {
  const { sendProfile, isLoading, error, isAuthenticated } = useClerkApi();
  
  if (!isAuthenticated) {
    return <div>Você precisa estar logado</div>;
  }
  
  const handleEnviarPerfil = async () => {
    try {
      const dados = {
        nome: 'João Silva',
        idade: 30,
        objetivo: 'emagrecimento'
      };
      
      const resultado = await sendProfile(dados);
      console.log('Perfil enviado:', resultado);
    } catch (err) {
      console.error('Erro:', err);
    }
  };
  
  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleEnviarPerfil} disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Enviar Perfil'}
      </button>
    </div>
  );
}
```

## Métodos Disponíveis

### ClerkApiService

- `makeAuthenticatedRequest<T>(endpoint, options)` - Requisição genérica autenticada
- `sendUserProfile(profileData, getToken)` - Enviar dados do perfil
- `registerUser(userData, getToken)` - Registrar usuário
- `syncUserData(getToken)` - Sincronizar dados
- `updateUser(userId, userData, getToken)` - Atualizar usuário
- `getUser(userId, getToken)` - Obter dados do usuário

### useClerkApi Hook

- `makeRequest(endpoint, options)` - Requisição genérica
- `sendProfile(profileData)` - Enviar perfil
- `registerUser(userData)` - Registrar usuário
- `syncUserData()` - Sincronizar dados
- `updateUser(userId, userData)` - Atualizar usuário
- `getUser(userId)` - Obter usuário
- `getCurrentToken(template)` - Obter token atual

## Estados e Propriedades

### useClerkApi retorna:

- `isLoading: boolean` - Estado de carregamento
- `error: string | null` - Mensagem de erro
- `isAuthenticated: boolean` - Status de autenticação
- `clearError: () => void` - Limpar erro

## Configuração da API Externa

### URL Base

Por padrão, a URL base é `http://localhost:8080/api`. Para alterar:

```typescript
import { clerkApiService } from '@/services/ClerkApiService';

// Alterar URL base
clerkApiService.setBaseApiUrl('https://minha-api.com/api');
```

### Templates de Token

Você pode usar diferentes templates de token:

```typescript
const token = await getToken({ template: 'custom-template' });
```

## Páginas de Exemplo

### Página Completa de Demonstração

**URL:** `/api-example`
**Arquivo:** `src/app/api-example/page.tsx`

Página completa com exemplos de todas as funcionalidades.

### Integração na Página de Perfil

**URL:** `/perfil`
**Arquivo:** `src/app/perfil/page.tsx`

Exemplo básico integrado na página de perfil existente.

## Tratamento de Erros

```typescript
const { makeRequest, error, clearError } = useClerkApi();

const handleRequest = async () => {
  try {
    const result = await makeRequest('/endpoint', {
      method: 'POST',
      body: { data: 'exemplo' }
    });
    
    if (result) {
      console.log('Sucesso:', result);
    }
  } catch (err) {
    // Erro já está disponível em 'error'
    console.error('Erro capturado:', error);
  }
};

// Limpar erro manualmente
const handleClearError = () => {
  clearError();
};
```

## Segurança

- ✅ Tokens são obtidos automaticamente do Clerk
- ✅ Headers de autorização são configurados automaticamente
- ✅ Verificação de autenticação antes das requisições
- ✅ Tratamento de erros de token inválido/expirado
- ✅ Não exposição de tokens no código cliente

## Próximos Passos

1. Configure sua API externa para aceitar tokens JWT do Clerk
2. Implemente os endpoints necessários na sua API
3. Teste a integração usando as páginas de exemplo
4. Customize os métodos conforme suas necessidades

## Troubleshooting

### Token não disponível
- Verifique se o usuário está autenticado
- Confirme se o template do token está correto

### Erro de CORS
- Configure CORS na sua API externa
- Adicione o domínio da aplicação nas origens permitidas

### Erro 401/403
- Verifique se a API está validando corretamente os tokens do Clerk
- Confirme se o token não expirou