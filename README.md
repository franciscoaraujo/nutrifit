# NutriFit 🥗💪

Um aplicativo web moderno para acompanhamento nutricional e fitness, desenvolvido com Next.js e TypeScript.

## 📋 Sobre o Projeto

O NutriFit é uma plataforma completa para quem busca uma vida mais saudável, oferecendo ferramentas para:

- **Acompanhamento de Dietas**: Explore diferentes tipos de dietas com descrições detalhadas
- **Dashboard de Evolução**: Registre medidas corporais e acompanhe seu progresso com fotos
- **Configuração de Perfil**: Personalize suas informações para recomendações específicas
- **Receitas Saudáveis**: Descubra receitas nutritivas e saborosas
- **Planos de Treinamento**: Acesse rotinas de exercícios personalizadas

## 🚀 Tecnologias Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: FontAwesome
- **Autenticação**: NextAuth.js
- **Desenvolvimento**: ESLint, PostCSS

## 🎯 Funcionalidades Principais

### 🍽️ Dietas
- Catálogo de diferentes tipos de dietas (Low Carb, Mediterrânea, Vegana, etc.)
- Descrições detalhadas com benefícios e características
- Interface visual atrativa com ícones temáticos

### 📊 Dashboard de Evolução
- Registro de medidas corporais (braços, busto, cintura, quadril, coxas)
- Captura de fotos de progresso
- Histórico visual de medidas e fotos
- Dicas de como medir corretamente

### ⚙️ Configuração de Perfil
- Dados pessoais (sexo, idade, altura, peso)
- Definição de objetivos (emagrecimento, manutenção, ganho de massa)
- Níveis de atividade física (sedentário a extremamente ativo)
- Interface intuitiva com seleção visual

### 🍳 Receitas
- Coleção de receitas saudáveis
- Categorização por tipo de dieta
- Instruções detalhadas de preparo

### 🏋️ Treinamentos
- Planos de exercícios personalizados
- Rotinas para diferentes níveis de condicionamento
- Instruções detalhadas dos exercícios

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd nutri-fit
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   Edite o arquivo `.env.local` com suas configurações:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=seu-secret-aqui
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard de evolução
│   ├── dietas/            # Catálogo de dietas
│   ├── perfil/            # Configurações de perfil
│   ├── receitas/          # Receitas saudáveis
│   └── treinamentos/      # Planos de treinamento
├── components/            # Componentes reutilizáveis
│   ├── auth/             # Componentes de autenticação
│   ├── layout/           # Layout e navegação
│   └── ui/               # Componentes de interface
├── providers/            # Context providers
└── types/                # Definições de tipos TypeScript
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado em:

- **Cores Principais**: Tons de verde esmeralda (#10b981, #059669)
- **Tipografia**: Font Serif para títulos, Sans-serif para texto
- **Componentes**: Cards, botões e inputs padronizados
- **Responsividade**: Design mobile-first com Tailwind CSS

## 📱 Responsividade

O NutriFit é totalmente responsivo, oferecendo uma experiência otimizada em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1280px+)

## 🔒 Autenticação

O sistema utiliza NextAuth.js para gerenciamento de autenticação, suportando:
- Login com credenciais
- Sessões seguras
- Proteção de rotas

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros Provedores
O projeto é compatível com qualquer provedor que suporte Next.js:
- Netlify
- Railway
- Heroku
- AWS

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Scripts Disponíveis

```bash
npm run dev          # Inicia o servidor de desenvolvimento
npm run build        # Gera a build de produção
npm run start        # Inicia o servidor de produção
npm run lint         # Executa o linter
npm run lint:fix     # Corrige problemas do linter automaticamente
```

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](link-para-issues) com:
- Descrição detalhada do problema
- Passos para reproduzir
- Screenshots (se aplicável)
- Informações do ambiente (OS, browser, etc.)

## 📈 Roadmap

- [ ] Integração com APIs de nutrição
- [ ] Sistema de notificações
- [ ] Modo offline
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com wearables
- [ ] Sistema de gamificação

## 📞 Suporte

Para suporte e dúvidas:
- 📧 Email: suporte@nutrifit.com
- 💬 Discord: [Link do servidor]
- 📱 WhatsApp: [Número de contato]

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <p>Desenvolvido com ❤️ para uma vida mais saudável</p>
  <p>© 2024 NutriFit. Todos os direitos reservados.</p>
</div>
