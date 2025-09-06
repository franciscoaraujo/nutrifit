# Integração Backend - API de Perfil do Usuário

## Visão Geral

Este documento descreve a estrutura de dados que será enviada do frontend para a API externa para criação e atualização de perfis de usuário no sistema NutriFit.

## Endpoint Esperado

```
POST /api/v1/user-profiles
PUT /api/v1/user-profiles/{clerk_user_id}
```

## Estrutura do Payload

O objeto `user_profile` contém todas as informações coletadas no formulário de cadastro, organizadas em seções lógicas:

### 1. Informações Pessoais (`personal_info`)
- **name**: Nome completo do usuário
- **email**: Email principal (sincronizado com Clerk)
- **phone**: Telefone de contato
- **birth_date**: Data de nascimento (formato ISO: YYYY-MM-DD)
- **gender**: Gênero (masculino|feminino|outro)

### 2. Dados Físicos (`physical_data`)
- **height**: Altura em centímetros
- **weight**: Peso atual em quilogramas
- **body_fat_percentage**: Percentual de gordura corporal (opcional)
- **muscle_mass_percentage**: Percentual de massa muscular (opcional)

### 3. Informações de Saúde (`health_info`)
- **activity_level**: Nível de atividade física
  - `sedentario`: Pouca ou nenhuma atividade
  - `leve`: Exercícios leves 1-3 dias/semana
  - `moderado`: Exercícios moderados 3-5 dias/semana
  - `intenso`: Exercícios intensos 6-7 dias/semana
  - `muito_intenso`: Exercícios muito intensos, trabalho físico
- **health_conditions**: Condições de saúde existentes
- **medications**: Medicamentos em uso
- **allergies**: Alergias alimentares ou outras
- **dietary_restrictions**: Restrições alimentares

### 4. Objetivos (`goals`)
- **primary_goal**: Objetivo principal
  - `perder_peso`: Perda de peso
  - `ganhar_massa`: Ganho de massa muscular
  - `manter_peso`: Manutenção do peso atual
  - `melhorar_saude`: Melhoria geral da saúde
- **target_weight**: Peso objetivo em kg
- **timeline**: Prazo para atingir o objetivo
- **specific_goals**: Objetivos específicos detalhados

### 5. Preferências (`preferences`)
- **preferred_meal_times**: Array com horários preferidos das refeições
- **food_preferences**: Preferências alimentares em texto livre
- **cooking_experience**: Experiência culinária (iniciante|intermediario|avancado)
- **budget_range**: Faixa de orçamento (baixo|medio|alto)
- **time_available_cooking**: Tempo disponível para cozinhar (minutos/dia)

### 6. Estilo de Vida (`lifestyle`)
- **work_schedule**: Horário de trabalho
- **sleep_hours**: Horas de sono por noite
- **stress_level**: Nível de estresse (baixo|medio|alto)
- **water_intake**: Consumo de água em litros/dia

### 7. Metadados (`metadata`)
- **clerk_user_id**: ID único do usuário no Clerk (chave primária)
- **created_at**: Timestamp de criação
- **updated_at**: Timestamp da última atualização
- **profile_version**: Versão do perfil para controle de mudanças

## Validações Recomendadas

### Campos Obrigatórios
- `personal_info.name`
- `personal_info.email`
- `physical_data.height`
- `physical_data.weight`
- `health_info.activity_level`
- `goals.primary_goal`
- `metadata.clerk_user_id`

### Validações de Formato
- **birth_date**: Formato ISO 8601 (YYYY-MM-DD)
- **email**: Formato de email válido
- **phone**: Formato de telefone brasileiro
- **height**: Entre 100-250 cm
- **weight**: Entre 30-300 kg
- **percentuais**: Entre 0-100

## Resposta da API

### Sucesso (201/200)
```json
{
  "success": true,
  "message": "Perfil criado/atualizado com sucesso",
  "data": {
    "user_id": "clerk_user_id",
    "profile_id": "generated_profile_id",
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### Erro de Validação (400)
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "physical_data.height",
      "message": "Altura deve estar entre 100 e 250 cm"
    }
  ]
}
```

## Considerações de Implementação

1. **Autenticação**: Usar JWT token do Clerk para validar requisições
2. **Idempotência**: Usar `clerk_user_id` como chave única
3. **Versionamento**: Implementar controle de versão para mudanças futuras
4. **Backup**: Manter histórico de alterações para auditoria
5. **Performance**: Indexar por `clerk_user_id` para consultas rápidas

## Arquivos de Referência

- `API_PROFILE_PAYLOAD.json`: Estrutura completa do payload
- `API_PROFILE_EXAMPLE.json`: Exemplo com dados reais
- `CLERK_API_INTEGRATION.md`: Documentação da integração com Clerk