# MedEasy - Sistema de Prescrição Médica

## Descrição do Projeto

**MedEasy** é um sistema completo de prescrição médica que integra Inteligência Artificial para auxiliar médicos na criação de prescrições, cálculo de dosagens e gerenciamento de medicamentos. O sistema oferece sugestões de tratamento baseadas em sintomas através da API do Google Gemini.

---

## Tecnologias Utilizadas

### **Frontend**

- **React 18.3.1** - Biblioteca JavaScript para construção da interface
- **TypeScript 5.5.3** - Superset do JavaScript com tipagem estática
- **Vite 6.3.4** - Build tool e dev server extremamente rápido
- **React Router DOM 6.22.3** - Gerenciamento de rotas
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **Lucide React 0.344.0** - Biblioteca de ícones
- **React Hook Form 7.51.0** - Gerenciamento de formulários
- **Zod 3.22.4** - Validação de esquemas TypeScript-first

### **Backend**

- **Node.js** - Ambiente de execução JavaScript
- **Express 4.17.1 / 5.1.0** - Framework web para Node.js
- **Sequelize 6.37.7** - ORM para Node.js
- **MySQL2 3.14.1** - Driver MySQL para Node.js
- **JWT (jsonwebtoken 9.0.2)** - Autenticação por token
- **Bcrypt/Bcryptjs** - Criptografia de senhas
- **CORS 2.8.5** - Middleware para habilitar CORS
- **Google Generative AI** - Integração com IA do Google (Gemini)

### **Outras Tecnologias**

- **Electron** - Framework para criar aplicações desktop
- **Concurrently** - Executar múltiplos comandos simultaneamente
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## Arquitetura do Projeto

O MedEasy utiliza uma **arquitetura em camadas moderna**, inspirada em MVC mas adaptada para aplicações web full-stack com separação frontend/backend.

### **Backend - REST API com Arquitetura em Camadas**

O backend segue um padrão **Model-Controller-Routes-Services** que se assemelha ao MVC tradicional, mas otimizado para APIs REST:

```
Backend (server/)
├── models/          → Camada de Dados (Sequelize ORM)
│   ├── user.js              • Definição de esquemas do banco
│   ├── medicamento.js       • Relacionamentos entre tabelas
│   ├── categoria.js         • Validações de dados
│   ├── posologia.js
│   └── associations.js
│
├── controllers/     → Camada de Lógica de Negócio
│   ├── authController.js        • Processamento de requisições
│   ├── medicamentoController.js • Validações de negócio
│   └── adminController.js       • Formatação de respostas
│
├── routes/          → Camada de Roteamento
│   ├── authRoutes.js        • Definição de endpoints
│   ├── medicamentoRoutes.js • Mapeamento URL → Controller
│   ├── adminRoutes.js       • Aplicação de middlewares
│   └── iaRoute.js
│
├── services/        → Camada de Serviços
│   └── db.js                • Lógica reutilizável
│                            • Conexão com banco
│                            • Integrações externas
│
└── middlewares/     → Camada de Middleware
    └── authMiddleware.js    • Autenticação JWT
                             • Validações globais
```

**Fluxo de Requisição no Backend:**

```
Cliente → Routes → Middleware → Controller → Model → Database
                                    ↓
                                 Services
                                    ↓
                              Resposta JSON
```

### **Frontend - Component-Based Architecture (React)**

O frontend utiliza uma **arquitetura baseada em componentes** com organização inspirada em MVC, mas adaptada para o ecossistema React:

```
Frontend (src/)
├── views/           → Páginas/Telas (equivalente a "Views")
│   ├── Login.tsx           • Componentes de página completa
│   ├── Register.tsx        • Roteamento principal
│   ├── Dashboard.tsx       • Composição de componentes
│   ├── CreatePrescription.tsx
│   └── Medications.tsx
│
├── components/      → Componentes Reutilizáveis
│   ├── Layout.tsx          • UI components compartilhados
│   └── ProtectedRoute.tsx  • Lógica de apresentação isolada
│
├── contexts/        → Gerenciamento de Estado Global
│   └── AuthContext.tsx     • React Context API
│                           • Estado compartilhado
│                           • Lógica de autenticação
│
├── controllers/     → Lógica de Controle (Frontend)
│   ├── AuthController.ts       • Orquestração de ações
│   ├── PrescriptionController.ts • Validações client-side
│   └── DosageController.ts
│
├── services/        → Comunicação com Backend
│   ├── iaService.ts        • Chamadas à API
│   └── medicamentoService.ts • Serialização de dados
│
├── models/          → Definições de Tipos (TypeScript)
│   ├── User.ts             • Interfaces e tipos
│   ├── Prescription.ts     • Contratos de dados
│   └── DosageCalculation.ts • Não são models de BD
│
└── types/           → Types e Enums Globais
    └── index.ts            • Definições TypeScript
```

**Fluxo de Dados no Frontend:**

```
User Interface (Views) → Controllers → Services → Backend API
         ↓                                            ↓
    Components ← Contexts (State Management) ← Response
```

### **Diferenças do MVC Tradicional**

| Aspecto         | MVC Tradicional        | MedEasy                     |
| --------------- | ---------------------- | --------------------------- |
| **View**        | Backend renderiza HTML | Frontend React renderiza UI |
| **Comunicação** | Server-side rendering  | REST API (JSON)             |
| **Estado**      | Sessão no servidor     | Context API + JWT           |
| **Separação**   | Monolítico             | Frontend/Backend separados  |
| **Roteamento**  | Server-side            | Client-side (React Router)  |

### **Padrões Arquiteturais Utilizados**

- **Separation of Concerns** - Cada camada tem responsabilidade única
- **RESTful API** - Comunicação padronizada HTTP
- **Dependency Injection** - Services independentes
- **Middleware Pattern** - Interceptação de requisições
- **Repository Pattern** - Abstração de acesso a dados (Sequelize)
- **Context Pattern** - Gerenciamento de estado (React)
- **Component Pattern** - UI modular e reutilizável

### **Benefícios da Arquitetura**

- **Escalabilidade** - Frontend e backend podem escalar independentemente
- **Manutenibilidade** - Código organizado e fácil de localizar
- **Testabilidade** - Camadas isoladas facilitam testes unitários
- **Reusabilidade** - Componentes e services reutilizáveis
- **Segurança** - Separação clara de responsabilidades
- **Performance** - SPA com carregamento otimizado

---

## Funcionalidades Principais

### **Autenticação e Autorização**

- Sistema de login e registro de usuários
- Autenticação via JWT (JSON Web Tokens)
- Controle de acesso baseado em roles (médicos)
- Validação de CRM para médicos
- Rotas protegidas com middleware de autenticação

### **Gerenciamento de Prescrições**

- Criação de prescrições médicas personalizadas
- Cadastro de informações do paciente (nome, idade)
- Registro de sintomas observados
- Sugestão automática de tratamento via IA
- Histórico de prescrições por médico
- Impressão de prescrições

### **Integração com Inteligência Artificial**

- Sugestões de tratamento baseadas em sintomas usando **Google Gemini 2.0 Flash**
- Análise inteligente de sintomas
- Recomendações de medicamentos e tratamentos
- Assistência médica auxiliada por IA

### **Gestão de Medicamentos**

- Catálogo completo de medicamentos organizados por categorias
- Busca de medicamentos por categoria e faixa etária
- Informações detalhadas sobre medicamentos:
  - Nome e princípio ativo
  - Via de administração
  - Concentração e apresentação
  - Unidade de dosagem
- Filtros por faixa etária do paciente

### **Cálculo de Dosagens**

- Cálculo automático de dosagens baseado em:
  - Peso do paciente
  - Idade/faixa etária
  - Medicamento específico
- Dosagens mínimas e máximas (mg/kg)
- Frequência de administração (doses por dia)
- Dose máxima diária permitida
- Fórmulas de cálculo personalizadas
- Observações e restrições importantes

### **Painel do Médico (Dashboard)**

- Visão geral das prescrições realizadas
- Acesso rápido às funcionalidades principais
- Interface intuitiva e responsiva

### **Interface Responsiva**

- Design moderno com Tailwind CSS
- Adaptável a diferentes tamanhos de tela
- Experiência de usuário otimizada

---

## Estrutura do Projeto

```
MedEasy/
│
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # Componentes React reutilizáveis
│   │   ├── Layout.tsx           # Layout principal da aplicação
│   │   └── ProtectedRoute.tsx   # Componente de rota protegida
│   │
│   ├── contexts/                 # Context API do React
│   │   └── AuthContext.tsx      # Contexto de autenticação
│   │
│   ├── controllers/              # Controllers do frontend
│   │   ├── AuthController.ts    # Lógica de autenticação
│   │   ├── PrescriptionController.ts
│   │   └── DosageController.ts
│   │
│   ├── middlewares/              # Middlewares do frontend
│   │   └── authMiddleware.ts    # Validação de autenticação
│   │
│   ├── models/                   # Modelos de dados do frontend
│   │   ├── User.ts
│   │   ├── Prescription.ts
│   │   └── DosageCalculation.ts
│   │
│   ├── services/                 # Serviços de integração
│   │   ├── iaService.ts         # Integração com IA
│   │   └── medicamentoService.ts
│   │
│   ├── types/                    # Definições TypeScript
│   │   └── index.ts             # Interfaces e enums
│   │
│   ├── views/                    # Páginas da aplicação
│   │   ├── Login.tsx            # Tela de login
│   │   ├── Register.tsx         # Tela de registro
│   │   ├── Dashboard.tsx        # Dashboard principal
│   │   ├── CreatePrescription.tsx  # Criar prescrição
│   │   └── Medications.tsx      # Listagem de medicamentos
│   │
│   ├── App.tsx                   # Componente raiz
│   ├── main.tsx                  # Ponto de entrada
│   └── index.css                 # Estilos globais
│
├── server/                       # Backend (Express + Sequelize)
│   └── src/
│       ├── controllers/          # Controllers do backend
│       │   ├── authController.js        # Autenticação
│       │   ├── medicamentoController.js # Medicamentos
│       │   └── adminController.js       # Admin
│       │
│       ├── middlewares/          # Middlewares do backend
│       │   └── authMiddleware.js
│       │
│       ├── models/               # Modelos Sequelize (banco de dados)
│       │   ├── user.js
│       │   ├── medicamento.js
│       │   ├── categoria.js
│       │   ├── posologia.js
│       │   └── associations.js   # Associações entre models
│       │
│       ├── routes/               # Rotas da API
│       │   ├── authRoutes.js
│       │   ├── medicamentoRoutes.js
│       │   ├── adminRoutes.js
│       │   └── iaRoute.js
│       │
│       ├── services/             # Serviços do backend
│       │   └── db.js            # Configuração do banco
│       │
│       └── server.js             # Servidor Express
│
├── electron/                     # Configuração do Electron
│   └── main.js
│
├── index.html                    # HTML principal
├── package.json                  # Dependências do frontend
├── vite.config.ts               # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind
├── tsconfig.json                # Configuração do TypeScript
└── .gitignore
```

---

## Modelos de Dados

### **User (Usuário)**

```typescript
{
  id: string
  name: string
  email: string
  password: string (hash)
  role: 'médico'
  crm?: string (Registro médico)
}
```

### **Prescription (Prescrição)**

```typescript
{
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  symptoms: string;
  treatment: string;
  date: string;
  doctorId: string;
  doctorName: string;
  doctorCrm: string;
}
```

### **Medicamento**

```javascript
{
  id_medicamento: INTEGER;
  nome: STRING;
  principio_ativo: STRING;
  via_administracao: STRING;
  concentracao: STRING;
  apresentacao: STRING;
  unidade_dose: STRING;
  id_categoria: INTEGER;
}
```

### **Categoria**

```javascript
{
  id_categoria: INTEGER;
  nome: STRING;
  icone: STRING;
  cor: STRING;
}
```

### **Posologia (Dosagem)**

```javascript
{
  id_posologia: INTEGER;
  dose_mg_kg_min: DECIMAL;
  dose_mg_kg_max: DECIMAL;
  frequencia_dia: INTEGER;
  dose_max_mg_dia: DECIMAL;
  formula_calculo: STRING;
  observacoes: TEXT;
  faixa_idade_min_meses: INTEGER;
  faixa_idade_max_meses: INTEGER;
  faixa_etaria: STRING;
}
```

### **DosageCalculation (Cálculo de Dosagem)**

```typescript
{
  id: string;
  medicationName: string;
  calculation: string;
  result: string;
  date: string;
  userId: string;
}
```

---

## Endpoints da API

### **Autenticação**

```
POST /api/auth/register          # Registrar novo usuário
POST /api/auth/login             # Login de usuário
```

### **Medicamentos**

```
GET  /api/medicamentos/categorias/:faixaEtaria
     # Buscar categorias por faixa etária

GET  /api/medicamentos/categoria/:categoriaId/:faixaEtaria
     # Buscar medicamentos por categoria e faixa etária

POST /api/medicamentos/calcular-dosagem
     # Calcular dosagem de medicamento
```

### **Inteligência Artificial**

```
POST /api/ia-suggestion          # Obter sugestão de tratamento via IA
     Body: { symptoms: string }
```

### **Administração**

```
POST /api/medicamentos/admin/*   # Rotas administrativas (protegidas)
```

---

## Configuração e Instalação

### **Pré-requisitos**

- Node.js (v16 ou superior)
- MySQL (v8 ou superior)
- NPM ou Yarn
- Conta Google Cloud com API Key para Gemini

### **1. Clone o Repositório**

```bash
git clone https://github.com/Victor-Naza/MedEasy.git
cd MedEasy
```

### **2. Configurar Backend**

```bash
# Navegar para a pasta do servidor
cd server

# Instalar dependências
npm install

# Criar arquivo .env
# Copie o conteúdo abaixo e ajuste com suas credenciais
```

**Arquivo `.env` do servidor:**

```env
# Porta do servidor
PORT=5000

# Banco de dados MySQL
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=medeasy_db
DB_DIALECT=mysql

# JWT Secret (use uma string aleatória e segura)
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Google Gemini API
GOOGLE_API_KEY=sua_chave_api_do_google_aqui
```

### **3. Configurar Banco de Dados**

```sql
-- Criar banco de dados
CREATE DATABASE medeasy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- O Sequelize criará as tabelas automaticamente ao iniciar o servidor
```

### **4. Configurar Frontend**

```bash
# Voltar para a raiz do projeto
cd ..

# Instalar dependências
npm install
```

---

## Como Executar

### **Modo Desenvolvimento**

#### **Opção 1: Executar Frontend e Backend Separadamente**

**Terminal 1 - Backend:**

```bash
cd server
npm start
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`  
O backend estará disponível em: `http://localhost:5000`

#### **Opção 2: Executar Simultaneamente**

```bash
npm run electron:dev
```

### **Modo Produção**

```bash
# Build do frontend
npm run build

# Executar aplicação
npm run preview
```

### **Modo Electron (Desktop)**

```bash
# Executar como aplicação desktop
npm run electron
```

---

## Segurança

- Senhas criptografadas com **bcrypt** (10 rounds de salt)
- Autenticação via **JWT** com expiração de 24 horas
- Validação de CRM para médicos
- Rotas protegidas com middleware de autenticação
- Controle de acesso baseado em roles
- Validação de entrada com **Zod**
- Proteção CORS configurada

---

## Funcionalidades Detalhadas

### **1. Sistema de Login e Registro**

- Campos obrigatórios: nome, email, senha
- Para médicos: campo CRM adicional
- Validação de email único
- Hash seguro de senhas
- Geração automática de token JWT

### **2. Criação de Prescrição**

- Formulário com campos:
  - Nome do paciente
  - Idade do paciente
  - Sintomas observados
  - Tratamento prescrito
- Botão "Gerar com IA" para sugestões automáticas
- Prévia da prescrição antes de salvar
- Opção de impressão
- Dados do médico automaticamente incluídos

### **3. Sugestão de Tratamento por IA**

- Integração com Google Gemini 2.0 Flash
- Análise de sintomas descritos
- Sugestão de medicamentos apropriados
- Recomendações de dosagem e frequência
- Orientações gerais de tratamento

### **4. Catálogo de Medicamentos**

- Organização por categorias (antibióticos, analgésicos, etc.)
- Filtro por faixa etária:
  - Recém-nascido
  - Lactente
  - Pré-escolar
  - Escolar
  - Adolescente
  - Adulto
  - Idoso
- Informações completas de cada medicamento
- Visualização de posologias adequadas

### **5. Cálculo de Dosagem**

- Entrada de dados do paciente (peso, idade)
- Seleção do medicamento
- Cálculo automático baseado em:
  - Dose por kg de peso
  - Faixa etária
  - Dose máxima permitida
- Exibição de:
  - Dose calculada
  - Frequência de administração
  - Dose diária total
  - Observações importantes

---

## Telas e Navegação

1. **/** - Redireciona para login
2. **/login** - Tela de autenticação
3. **/register** - Cadastro de novos usuários
4. **/dashboard** - Dashboard principal (protegida)
5. **/prescription** - Criar prescrição (apenas médicos)
6. **/dosage** - Cálculo de dosagens (protegida)

---

## Variáveis de Ambiente Necessárias

### **Backend (server/.env)**

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=medeasy_db
DB_DIALECT=mysql
JWT_SECRET=chave_secreta_jwt
GOOGLE_API_KEY=chave_api_google_gemini
```

---

## Scripts Disponíveis

### **Frontend**

```bash
npm run dev           # Inicia servidor de desenvolvimento
npm run build         # Build para produção
npm run lint          # Executa linter
npm run preview       # Preview do build de produção
npm run electron      # Executa aplicação Electron
npm run electron:dev  # Dev mode com Electron
```

### **Backend**

```bash
npm start             # Inicia servidor Express
```

---

## Troubleshooting

### **Erro de conexão com banco de dados**

- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Verifique se o banco de dados foi criado

### **Erro na API do Google**

- Confirme se a `GOOGLE_API_KEY` está correta no `.env`
- Verifique se a API está habilitada no Google Cloud Console
- Verifique os limites de uso da API

### **Erro JWT_SECRET não encontrado**

- Certifique-se de que o arquivo `.env` existe na pasta `server/`
- Verifique se a variável `JWT_SECRET` está definida

### **Porta já em uso**

- Altere a `PORT` no arquivo `.env`
- Ou finalize o processo que está usando a porta

---

## Autor

**Victor Naza**  
GitHub: [@Victor-Naza](https://github.com/Victor-Naza)

---

## Licença

Este projeto é de uso educacional e foi desenvolvido como projeto integrador.

---

## Próximas Funcionalidades (Roadmap)

- [ ] Dashboard com estatísticas e gráficos
- [ ] Histórico completo de prescrições
- [ ] Sistema de impressão avançado (PDF)
- [ ] Integração com sistemas de farmácia
- [ ] Prontuário eletrônico do paciente
- [ ] Notificações e alertas
- [ ] Modo dark/light
- [ ] Exportação de relatórios
- [ ] Integração com outros modelos de IA
- [ ] App mobile (React Native)

---

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório:  
https://github.com/Victor-Naza/MedEasy/issues

---

**Desenvolvido para auxiliar profissionais da saúde**
