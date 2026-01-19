# 🍔 ZAPP - Cardápio Digital para Delivery

<div align="center">

![ZAPP Logo](https://necenbpitqhjjekatnxr.supabase.co/storage/v1/object/sign/Produtos/Utilitarios%20e%20Logos/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hYWYyM2I2ZS1mMmU3LTQyN2UtYjVmOC1iYmU3ZDYzMDBiMjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcm9kdXRvcy9VdGlsaXRhcmlvcyBlIExvZ29zL2xvZ28ucG5nIiwiaWF0IjoxNzU4Njg3MTMwLCJleHAiOjE3OTAyMjMxMzB9.T6BtWnd1aayUz7hzRLFnHDtF1e16k0MLZoCu7iYkFPM)

**Sua solução completa para gerenciamento de pedidos delivery**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/FBprgm/FBprgm)](https://github.com/FBprgm/FBprgm/stargazers)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e.svg)](https://supabase.com)

</div>

---

## 📋 Sobre o Projeto

O **ZAPP** é uma aplicação web moderna e responsiva de cardápio digital desenvolvida especificamente para restaurantes, lanchonetes, cafés e food trucks. A plataforma permite que clientes naveguem pelo menu, façam pedidos diretamente pelo celular e acompanhem o status em tempo real, enquanto os estabelecimentos gerenciam seus produtos e pedidos de forma eficiente.

### 🎯 Problema Resolvido

- **Para clientes:** Experiência lenta e confusa com cardápios físicos, filas de espera e dificuldade para fazer pedidos
- **Para estabelecimentos:** Alto custo com impressão de cardápios, erros de comunicação e falta de organização nos pedidos

### 💡 Solução Oferecida

Uma plataforma digital completa que moderniza o atendimento, reduz custos operacionais e aumenta a satisfação dos clientes através de tecnologia acessível e intuitiva.

---

## ✨ Funcionalidades

### Para Clientes
- 🛒 **Carrinho de Compras** - Adicione múltiplos itens com observações personalizadas
- 📱 **Interface Responsiva** - Perfeito funcionamento em smartphones e desktops
- 🔍 **Visualização de Produtos** - Imagens, preços e descrições detalhadas
- 🎫 **Sistema de Cupons** - Descontos em valor fixo ou percentual
- 💳 **Múltiplas Formas de Pagamento** - Pix, cartão e dinheiro
- 💰 **Cálculo de Troco** - Para pagamentos em dinheiro
- 📦 **Acompanhamento em Tempo Real** - Status do pedido atualizado via Supabase Realtime
- 👤 **Cadastro e Login** - Autenticação segura com Supabase Auth

### Para Administradores
- 📊 **Gerenciamento de Produtos** - CRUD completo de itens do cardápio
- 🏪 **Controle de Estoque** - Atualização automática após pedidos
- 📝 **Histórico de Pedidos** - Visualização completa de todos os pedidos
- 📈 **Relatórios** - Informações sobre vendas e produtos mais pedidos

---

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Propósito |
|------------|-----------|
| **HTML5** | Estrutura semântica das páginas |
| **JavaScript (ES6+)** | Lógica da aplicação e integração com API |
| **TailwindCSS** | Framework CSS utilitário para stylização |
| **AOS (Animate On Scroll)** | Animações suaves de scroll |
| **Google Fonts (Lokanova)** | Tipografia personalizada |

### Backend & Serviços
| Serviço | Propósito |
|---------|-----------|
| **Supabase Auth** | Sistema de autenticação de usuários |
| **Supabase Database** | Banco de dados PostgreSQL gerenciado |
| **Supabase Realtime** | Atualizações em tempo real dos pedidos |
| **hCaptcha** | Proteção contra bots e spam |

### Ferramentas de Desenvolvimento
- **Git** - Controle de versão
- **VS Code** - Editor de código
- **npm/node** - Gerenciamento de dependências

---

## 📁 Estrutura de Arquivos

```
public/
├── index.html          # Página inicial (landing page)
├── home.html           # Cardápio digital e carrinho
├── login.html          # Página de login
├── signup.html         # Página de cadastro
├── redefinir.html      # Recuperação de senha
├── app.js              # Lógica principal do app
├── index.js            # Gerenciamento de sessão
├── login.js            # Lógica de autenticação
├── signup.js           # Lógica de cadastro
├── redefinir.js        # Lógica de recuperação de senha
├── config.js           # Configurações do Supabase
├── tailwind.config.js  # Configuração do TailwindCSS
├── package.json        # Dependências do projeto
├── 404.html            # Página de erro
└── src/
    ├── input.css       # CSS de entrada para Tailwind
    └── output.css      # CSS compilado
```

---

## 🚦 Como Executar Localmente

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Edge)
- Editor de código (VS Code recomendado)
- Node.js e npm (para desenvolvimento com Tailwind)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/FBprgm/FBprgm.git
   cd FBprgm
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação**
   Abra o navegador e acesse: `http://localhost:3000`

### Build para Produção
```bash
npm run build:prod
```

---

## 🔧 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project" e preencha as informações
3. Aguarde a criação do projeto (pode levar alguns minutos)

### 2. Configurar Variáveis de Ambiente

No arquivo `config.js`, atualize as seguintes variáveis:

```javascript
const supabaseUrl = 'https://SEU-PROJECT-ID.supabase.co';
const supabaseAnonKey = 'SUA-ANON-KEY';
```

### 3. Criar Tabelas no Banco de Dados

Execute os seguintes comandos SQL no editor do Supabase:

```sql
-- Tabela de usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    img TEXT,
    estoque INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE pedidos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    celular TEXT NOT NULL,
    endereco TEXT NOT NULL,
    pagamento TEXT NOT NULL,
    troco TEXT,
    total DECIMAL(10,2) NOT NULL,
    email_usuario TEXT,
    status TEXT DEFAULT 'pendente',
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE pedido_itens (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    nome_item TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    quantidade INTEGER NOT NULL,
    observacao TEXT
);

-- Tabela de cupons
CREATE TABLE cupons (
    id SERIAL PRIMARY KEY,
    codigo TEXT UNIQUE NOT NULL,
    desconto DECIMAL(10,2) NOT NULL,
    tipo TEXT CHECK (tipo IN ('valor', 'percentual')),
    ativo BOOLEAN DEFAULT true
);

-- Tabela de clientes (salvar dados para autocomplete)
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    device_id TEXT UNIQUE NOT NULL,
    nome TEXT,
    celular TEXT,
    endereco TEXT
);
```

### 4. Configurar Realtime

No painel do Supabase, vá em:
1. **Database** → **Replication** → **Tables**
2. Habilite replication para a tabela `pedidos`

### 5. Configurar hCaptcha

1. Acesse [hcaptcha.com](https://hcaptcha.com)
2. Crie um novo site
3. Copie o Site Key e adicione nos formulários:
   ```html
   <div class="h-captcha" data-sitekey="SUA-SITE-KEY"></div>
   ```

---

## 📸 Preview das Telas

### Página Inicial
- Landing page moderna com informações sobre o projeto
- Seção "Sobre" com benefícios do app
- Depoimentos de usuários
- Links para redes sociais e contato

### Cardápio Digital
- Header com informações do estabelecimento
- Grid de produtos com imagens e preços
- Modal de descrição detalhada
- Carrinho flutuante com contador

### Carrinho de Compras
- Lista de itens selecionados
- Controles de quantidade (+/-)
- Campo de observação por item
- Cupom de desconto
- Formulário de dados do cliente
- Seleção de forma de pagamento

### Monitoramento
- Botão flutuante para acompanhar pedidos
- Modal com lista de pedidos
- Atualizações em tempo real via Supabase

### Autenticação
- Login com email e senha
- Cadastro com validação
- Recuperação de senha
- Proteção com hCaptcha

---

## 🎨 Design e UI/UX

### Identidade Visual
- **Cores Principais:** Vermelho (#EF4444) e branco
- **Estilo:** Moderno, limpo e intuitivo
- **Animações:** Suaves e não intrusivas (AOS)
- **Responsividade:** Mobile-first approach

### Recursos de Acessibilidade
- Contraste de cores adequado
- Textos descritivos em imagens
- Navegação por teclado
- Animações desativáveis

---

## 🔐 Segurança

- ✅ Autenticação via Supabase Auth
- ✅ Proteção contra CSRF
- ✅ hCaptcha em formulários críticos
- ✅ Validação de dados no cliente e servidor
- ✅ Criptografia de senhas (gerenciado pelo Supabase)

---

## 🤝 Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** (`git checkout -b feature/nova-funcionalidade`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push para a branch** (`git push origin feature/nova-funcionalidade`)
5. **Abra um Pull Request**

### Roadmap de Contribuições
- [ ] Sistema de Pagamento Online
- [ ] App móvel (React Native)
- [ ] Múltiplos estabelecimentos
- [ ] Relatórios e analytics
- [ ] Migração do Beckend para Node.js
- [ ] Sistema de avaliações

---

## 📞 Contato

<div align="center">

**Fabiano Dev** - Desenvolvedor Junior

[![GitHub](https://img.shields.io/badge/GitHub-FBprgm-333?style=for-the-badge)](https://github.com/FBGdev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-FabianoDev-0077b5?style=for-the-badge)](https://www.linkedin.com/in/fabianodev)
[![Instagram](https://img.shields.io/badge/Instagram-zappoficial_-E4405F?style=for-the-badge)](https://www.instagram.com/zappoficial_)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-+5521983304162-25D366?style=for-the-badge)](https://wa.me/+5521983304162)

</div>

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Desenvolvido com ❤️ por Fabiano Dev**

*"Sua jornada começa aqui"*

</div>

