# MedEasy - Sistema de Prescrição Médica

## Descrição do Projeto

**MedEasy** é um sistema completo de prescrição médica que integra Inteligência Artificial para auxiliar médicos na criação de prescrições, transcrição de consultas e gerenciamento de medicamentos. O sistema oferece sugestões de tratamento baseadas em sintomas consultando a **REMUME 2025-2026** (Relação Municipal de Medicamentos Essenciais de Fortaleza) através do **Google Gemini 2.0 Flash** (primário) e **GPT-4o-mini da OpenAI** (fallback), com ~454 medicamentos organizados em 21 categorias ATC.

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
- **pg / pg-hstore** - Driver PostgreSQL para Node.js
- **MySQL2 3.14.1** - Driver MySQL para Node.js (compatibilidade)
- **JWT (jsonwebtoken 9.0.2)** - Autenticação por token
- **Bcrypt/Bcryptjs** - Criptografia de senhas
- **Multer** - Upload de arquivos de áudio para transcrição
- **CORS 2.8.5** - Middleware para habilitar CORS
- **Google Generative AI** - Integração com IA do Google (Gemini)
- **OpenAI** - Sugestões de tratamento via GPT-4o-mini + transcrição via Whisper

### **Banco de Dados e Serviços Externos**

- **Supabase (PostgreSQL)** - Banco de dados principal com Row Level Security (RLS)
- **Google Gemini 2.0 Flash** - Sugestões de tratamento (primário)
- **OpenAI GPT-4o-mini** - Sugestões de tratamento (fallback)
- **OpenAI Whisper** - Transcrição de áudio (primário)
- **Google Gemini 1.5 Flash** - Transcrição de áudio (fallback)

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
│   ├── prescricao.js        • Prescrições salvas
│   ├── transcription.js     • Transcrições de consultas
│   └── associations.js
│
├── controllers/     → Camada de Lógica de Negócio
│   ├── authController.js            • Processamento de requisições
│   ├── medicamentoController.js     • Validações de negócio
│   ├── adminController.js           • Formatação de respostas
│   ├── prescricaoController.js      • Salvar/listar prescrições
│   └── transcriptionController.js   • Transcrição com Whisper/Gemini
│
├── routes/          → Camada de Roteamento
│   ├── authRoutes.js            • Definição de endpoints
│   ├── medicamentoRoutes.js     • Mapeamento URL → Controller
│   ├── adminRoutes.js           • Aplicação de middlewares
│   ├── iaRoute.js               • Sugestão de tratamento via IA
│   ├── prescricaoRoutes.js      • Prescrições
│   └── transcriptionRoutes.js   • Upload e transcrição de áudio
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
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── CreatePrescription.tsx   • Prescrição com sugestão IA
│   ├── Medications.tsx
│   └── Transcription.tsx        • Transcrição com diarização
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
│   ├── PrescriptionController.ts
│   └── DosageController.ts
│
├── services/        → Comunicação com Backend
│   ├── iaService.ts            • Chamadas à API de IA
│   ├── prescricaoService.ts    • Salvar prescrições
│   └── medicamentoService.ts
│
├── models/          → Definições de Tipos (TypeScript)
│   ├── User.ts
│   ├── Prescription.ts
│   └── DosageCalculation.ts
│
└── types/           → Types e Enums Globais
    └── index.ts
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
- Autenticação via JWT (JSON Web Tokens) armazenado em `sessionStorage`
- Controle de acesso baseado em roles (médicos)
- Validação de CRM para médicos
- Rotas protegidas com middleware de autenticação

### **Gerenciamento de Prescrições**

- Criação de prescrições médicas personalizadas
- Cadastro de informações do paciente (nome, idade)
- Registro de sintomas observados
- Sugestão automática de tratamento via IA com base na REMUME
- **Clique em um medicamento sugerido** para adicioná-lo automaticamente ao campo de tratamento
- **Prescrições salvas no banco de dados** vinculadas ao médico logado
- Impressão de prescrições em formato A4

### **Integração com Inteligência Artificial**

- Sugestões de tratamento baseadas em sintomas consultando a **REMUME 2025-2026**
- Motor primário: **Google Gemini 2.0 Flash**
- Motor de fallback: **GPT-4o-mini (OpenAI)** — ativado automaticamente se o Gemini não estiver disponível
- A IA recebe a lista completa de medicamentos disponíveis e recomenda pelo menos 2 com base nos sintomas
- Cada sugestão inclui: posologia, justificativa clínica, concentração, apresentação e categoria
- Badge "Disponível" / "Verificar" por medicamento

### **Catálogo REMUME 2025-2026**

- **~454 medicamentos** organizados em **21 categorias ATC**
- Informações detalhadas: nome, concentração, apresentação, via de administração
- Categorias com ícone e cor para fácil identificação
- Busca de medicamentos por categoria e faixa etária

### **Transcrição de Consultas**

- Gravação de áudio diretamente no navegador via MediaRecorder API
- Transcrição automática usando **OpenAI Whisper** (primário)
- Fallback para **Google Gemini 1.5 Flash** caso o Whisper não esteja configurado
- **Modo Google Meet com diarização de falantes:**
  - `🩺 Médico` — capturado pelo microfone via `getUserMedia`
  - `👤 Paciente` — capturado pelo áudio da tela via `getDisplayMedia`
- Transcrições salvas no banco vinculadas ao médico

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
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx
│   │
│   ├── controllers/
│   │   ├── AuthController.ts
│   │   ├── PrescriptionController.ts
│   │   └── DosageController.ts
│   │
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Prescription.ts
│   │   └── DosageCalculation.ts
│   │
│   ├── services/
│   │   ├── iaService.ts          # Sugestão de tratamento via IA
│   │   ├── prescricaoService.ts  # Salvar prescrições no banco
│   │   └── medicamentoService.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   ├── views/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CreatePrescription.tsx
│   │   ├── Medications.tsx
│   │   └── Transcription.tsx     # Transcrição com diarização
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── server/                       # Backend (Express + Sequelize)
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── medicamentoController.js
│       │   ├── adminController.js
│       │   ├── prescricaoController.js      # Salvar/listar prescrições
│       │   └── transcriptionController.js   # Whisper + Gemini fallback
│       │
│       ├── middlewares/
│       │   └── authMiddleware.js
│       │
│       ├── models/
│       │   ├── user.js
│       │   ├── medicamento.js
│       │   ├── categoria.js
│       │   ├── posologia.js
│       │   ├── prescricao.js
│       │   ├── transcription.js
│       │   └── associations.js
│       │
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── medicamentoRoutes.js
│       │   ├── adminRoutes.js
│       │   ├── iaRoute.js
│       │   ├── prescricaoRoutes.js
│       │   └── transcriptionRoutes.js
│       │
│       ├── services/
│       │   └── db.js
│       │
│       └── server.js
│
├── database/
│   ├── remume_seed.sql           # ~454 medicamentos REMUME 2025-2026
│   └── prescricoes_migration.sql # Tabela prescricoes + RLS
│
├── electron/
│   └── main.js
│
├── uploads/tmp/                  # Áudios temporários (deletados após transcrição)
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .gitignore
```

---

## Modelos de Dados

### **User (Usuário)**

```typescript
{
  id: number
  name: string
  email: string
  password: string (hash bcrypt)
  role: 'médico'
  crm?: string
}
```

### **Prescription (Prescrição)**

```typescript
{
  id: string (UUID)
  user_id: number
  patient_name: string
  patient_age: string
  symptoms: string
  treatment: string
  ia_suggestion?: string
  created_at: Date
}
```

### **Medicamento**

```javascript
{
  id_medicamento: INTEGER
  nome: STRING
  concentracao: STRING
  apresentacao: STRING
  via_administracao: STRING  // Oral | Parenteral | Tópica | Inalatória | ...
  disponivel: BOOLEAN
  id_categoria: INTEGER (FK → categorias)
}
```

### **Categoria**

```javascript
{
  id_categoria: INTEGER
  nome: STRING
  icone: STRING  // nome do ícone Lucide
  cor: STRING    // hex, ex: '#2196F3'
}
```

### **Posologia (Dosagem)**

```javascript
{
  id_posologia: INTEGER
  dose_mg_kg_min: DECIMAL
  dose_mg_kg_max: DECIMAL
  frequencia_dia: INTEGER
  dose_max_mg_dia: DECIMAL
  formula_calculo: STRING
  observacoes: TEXT
  faixa_idade_min_meses: INTEGER
  faixa_idade_max_meses: INTEGER
  faixa_etaria: STRING
}
```

### **Transcription (Transcrição)**

```javascript
{
  id: UUID
  user_id: INTEGER (FK → users)
  title: STRING
  content: TEXT
  patient_name: STRING
  duration_seconds: INTEGER
  created_at: DATE
}
```

---

## Endpoints da API

### **Autenticação**

```
POST /api/auth/register    # Registrar novo usuário
POST /api/auth/login       # Login de usuário
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
POST /api/ia-suggestion
     Body: { symptoms: string, patientAge?: string }
     # Consulta REMUME e retorna sugestão + lista de medicamentos recomendados
```

### **Prescrições** *(requer auth)*

```
POST /api/prescricoes
     Body: { patient_name, patient_age, symptoms, treatment, ia_suggestion? }
     # Salva prescrição vinculada ao médico logado

GET  /api/prescricoes
     # Lista todas as prescrições do médico logado
```

### **Transcrição** *(requer auth)*

```
POST /api/transcription/transcribe
     Body: multipart/form-data { audio: File }
     # Transcreve áudio via Whisper (ou Gemini como fallback)

POST /api/transcription/save
     Body: { title, content, patientName, durationSeconds }

GET  /api/transcription/list
GET  /api/transcription/:id
DELETE /api/transcription/:id
```

### **Administração**

```
POST /api/medicamentos/admin/*    # Rotas administrativas (protegidas)
```

---

## Configuração e Instalação

### **Pré-requisitos**

- Node.js (v18 ou superior)
- Conta Supabase (PostgreSQL)
- Google AI Studio API Key (Gemini)
- OpenAI API Key (Whisper) — recomendado para transcrição

### **1. Clone o Repositório**

```bash
git clone https://github.com/Victor-Naza/MedEasy.git
cd MedEasy
```

### **2. Configurar Backend**

```bash
cd server
npm install
cp .env.example .env
# Edite server/.env com suas credenciais
```

**Arquivo `server/.env`:**

```env
PORT=5000

JWT_SECRET=troque_esta_chave
JWT_EXPIRES_IN=1d

# Supabase — Settings > API
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=sua_service_role_key

# PostgreSQL — Settings > Database > Connection string > URI
DATABASE_URL=postgresql://postgres:senha@db.xxxx.supabase.co:5432/postgres

# Google Gemini — https://aistudio.google.com/app/apikey
GOOGLE_API_KEY=sua_chave_google

# OpenAI Whisper — https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-sua_chave_openai
```

### **3. Popular o Banco de Dados**

Execute os arquivos SQL no **Supabase SQL Editor**:

```bash
# 1. Categorias e medicamentos REMUME 2025-2026 (~454 itens)
database/remume_seed.sql

# 2. Tabela de prescrições com RLS
database/prescricoes_migration.sql
```

Verificação após o seed:

```sql
SELECT COUNT(*) FROM categorias;    -- deve retornar 21
SELECT COUNT(*) FROM medicamentos;  -- deve retornar ~454
```

### **4. Configurar Frontend**

```bash
cd ..
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
npm run build
npm run preview
```

### **Modo Electron (Desktop)**

```bash
npm run electron
```

---

## Segurança

- Senhas criptografadas com **bcrypt** (10 rounds de salt)
- Autenticação via **JWT** com expiração configurável
- Token armazenado em `sessionStorage` (não persiste entre abas)
- Rotas protegidas com middleware de autenticação
- Controle de acesso baseado em roles
- **Row Level Security (RLS)** habilitado no Supabase para prescrições
- Uploads de áudio limitados a **25 MB** e deletados após transcrição
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
- Botão "Gerar Sugestão IA" consulta a REMUME e retorna medicamentos recomendados
- Clique em um medicamento para adicioná-lo automaticamente ao campo de tratamento
- Prévia da prescrição após salvar
- Opção de impressão em A4
- Dados do médico automaticamente incluídos

### **3. Sugestão de Tratamento por IA**

- Motor primário: **Google Gemini 2.0 Flash**
- Motor de fallback: **GPT-4o-mini (OpenAI)** — ativado automaticamente se o Gemini falhar
- A IA recebe a lista completa da REMUME como contexto e escolhe apenas medicamentos disponíveis
- Retorna pelo menos 2 recomendações com posologia e justificativa clínica
- Cards coloridos por categoria com badges de disponibilidade

### **4. Transcrição com Diarização**

- Modo padrão: grava microfone e transcreve com Whisper
- Modo Google Meet: captura dois fluxos simultâneos
  - Microfone do médico → rótulo `🩺 Médico`
  - Áudio da reunião → rótulo `👤 Paciente`
- Transcrição ordenada cronologicamente com identificação de falante

### **5. Catálogo de Medicamentos**

- Organização por 21 categorias ATC
- Filtro por faixa etária:
  - Recém-nascido, Lactente, Pré-escolar, Escolar, Adolescente, Adulto, Idoso
- Informações completas de cada medicamento
- Visualização de posologias adequadas

### **6. Cálculo de Dosagem**

- Entrada de dados do paciente (peso, idade)
- Cálculo automático baseado em dose/kg e faixa etária
- Dose máxima diária permitida com alertas

---

## Telas e Navegação

1. **/** - Redireciona para login
2. **/login** - Tela de autenticação
3. **/register** - Cadastro de novos usuários
4. **/dashboard** - Dashboard principal (protegida)
5. **/prescription** - Criar prescrição (apenas médicos)
6. **/medications** - Catálogo REMUME
7. **/transcription** - Transcrição de consultas
8. **/dosage** - Cálculo de dosagens (protegida)

---

## Variáveis de Ambiente Necessárias

### **Backend (server/.env)**


| Variável         | Obrigatório | Descrição                           |
| ---------------- | ----------- | ----------------------------------- |
| `PORT`           | Não         | Porta do backend (padrão: 5000)     |
| `JWT_SECRET`     | Sim         | Chave para assinar tokens JWT       |
| `JWT_EXPIRES_IN` | Não         | Expiração dos tokens (padrão: `1d`) |
| `SUPABASE_URL`   | Sim         | URL do projeto Supabase             |
| `SUPABASE_KEY`   | Sim         | Service Role Key do Supabase        |
| `DATABASE_URL`   | Sim         | Connection string PostgreSQL        |
| `GOOGLE_API_KEY` | Sim         | Gemini 2.0 Flash — sugestões de tratamento (primário) |
| `OPENAI_API_KEY` | Sim         | GPT-4o-mini (fallback sugestões) + Whisper (transcrição) |


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

### `**Unrecognized file format` no Whisper**

- O Whisper infere o formato pelo nome do arquivo. O backend renomeia automaticamente o upload com a extensão correta baseada no `Content-Type`. Verifique se o blob gravado está enviando o `mimetype` correto.

### **Erro de conexão com banco de dados**

- Verifique se `DATABASE_URL` está correto no `.env`
- Confirme se o IP está na allowlist do Supabase (Settings > Database)

### **Sugestão IA retorna lista vazia**

- Confirme se o seed foi executado: `SELECT COUNT(*) FROM medicamentos` (deve retornar ~454)

### **Erro na API do Google**

- Confirme se a `GOOGLE_API_KEY` está correta no `.env`
- Verifique se a API Gemini está habilitada no Google AI Studio

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

- Dashboard com estatísticas e gráficos
- Histórico completo de prescrições com filtros
- Sistema de impressão avançado (PDF)
- Integração com sistemas de farmácia
- Prontuário eletrônico do paciente
- Notificações e alertas
- Modo dark/light
- Exportação de relatórios
- App mobile (React Native)

---

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório:
[https://github.com/Victor-Naza/MedEasy/issues](https://github.com/Victor-Naza/MedEasy/issues)

---

**Desenvolvido para auxiliar profissionais da saúde**