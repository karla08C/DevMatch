# GitHub Contrib Hub

[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-2563EB.svg)](https://opensource.org/licenses/Apache-2.0)

Plataforma web de curadoria e varredura de projetos open-source no GitHub com foco estratégico em **Negócios**, **Carreira** e **Estudos**. Projetada para ajudar pessoas desenvolvedoras a encontrarem repositórios com alto retorno prático, entenderem onde começar e organizarem suas Pull Requests com clareza.

---

## Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Como Contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## Visão Geral

Contribuir em projetos open-source é uma das formas mais eficazes de ganhar experiência real em código de produção, fortalecer o portfólio e aprofundar fundamentos técnicos. O **GitHub Contrib Hub** organiza essa jornada em três eixos:

1. **Negócios (Business, SaaS, ERP, CRM & E-commerce):** Projetos corporativos reais como `medusajs/medusa`, `frappe/erpnext`, `twentyhq/twenty`, `calcom/cal.com`, `chatwoot/chatwoot`, `formbricks/formbricks` e `documenso/documenso`.
2. **Carreira (Empregabilidade, ATS & Entrevistas):** Repositórios de alto impacto no currículo e preparação técnica, como `freeCodeCamp/freeCodeCamp`, `kamranahmedse/developer-roadmap`, `AmruthPillai/Reactive-Resume` e `yangshun/tech-interview-handbook`.
3. **Estudos (Ciência da Computação, Algoritmos & Arquitetura):** Bases sólidas como `ossu/computer-science`, `donnemartin/system-design-primer`, `gothinkster/realworld`, `codecrafters-io/build-your-own-x` e `trekhleb/javascript-algorithms`.

---

## Funcionalidades

- **Curadoria Estruturada com Modo Grade e Lista:** Filtros combináveis por eixo temático, linguagem, nível de dificuldade, busca textual, comunidades amigáveis a PT-BR e ordenação por estrelas, forks ou nome.
- **Varredura ao Vivo no GitHub:** Consulta direta à API pública do GitHub com presets estratégicos (*Negócios & SaaS*, *Carreira & Entrevistas*, *Estudos & Algoritmos*, *Good First Issues*, *Comunidade Brasil*) e busca personalizada, apoiada por cache em memória de 15 minutos no backend.
- **Match Inteligente de Carreira:** Questionário rápido em 3 passos (momento técnico, prioridade e stack) que filtra o catálogo para os repositórios mais indicados para o seu perfil.
- **Painel de Detalhes & Mentoria IA:** Slide-over com comando de setup local copiável, checklist de primeira contribuição, análise de impacto nos 3 eixos e mentoria sob demanda via Gemini API (`gemini-3.8-flash`) no servidor.
- **Playbook de Contribuição:** Fluxo em 4 etapas, gerador interativo de **Conventional Commits**, template de Pull Request em Markdown e modelo pronto para destacar contribuições no LinkedIn e currículo.
- **Meu Plano (Roadmap Pessoal):** Acompanhamento persistido em `localStorage` com etapas (*A Explorar*, *Ambiente Configurado*, *PR Aberto* e *PR Aceito*), anotações por repositório e exportação em `.md` (cópia rápida ou download).
- **Tema Claro e Escuro:** Interface leve em tema claro por padrão, com alternância para modo escuro salva localmente.

---

## Stack Tecnológica

| Camada | Tecnologias |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React |
| **Tipografia** | Bricolage Grotesque (Display), DM Sans (UI/Corpo), JetBrains Mono (Dados/Código) |
| **Backend** | Node.js, Express 4, `tsx`, Proxy da GitHub Search API com cache em memória |
| **IA (Server-Side)** | `@google/genai` (`gemini-3.8-flash`) |

---

## Estrutura do Projeto

```text
.
├── index.html                           # Ponto de entrada HTML e fontes
├── server.ts                            # Servidor Express + Vite middleware + API routes
├── package.json                         # Scripts e dependências
├── vite.config.ts                       # Configuração do Vite + Tailwind v4
├── .env.example                         # Modelo de variáveis de ambiente
└── src/
    ├── main.tsx                         # Bootstrap do React
    ├── index.css                        # Tailwind CSS v4, @custom-variant dark e tokens tipográficos
    ├── App.tsx                          # Estado global, filtros, tema e orquestração de telas
    ├── types/
    │   └── index.ts                     # Interfaces TypeScript (filtros, tracker, GitHub API)
    ├── data/
    │   └── repositories.ts              # Base curada de repositórios e etapas do plano
    └── components/
        ├── Navbar.tsx                   # Navegação superior responsiva
        ├── HeroSection.tsx              # Cabeçalho editorial e seletor de eixos com contadores
        ├── RepoCard.tsx                 # Card editorial e linha compacta (Modo Lista)
        ├── RepoDetailModal.tsx          # Painel lateral com guia local, impacto e Mentoria IA
        ├── LiveScanner.tsx              # Varredura ao vivo na API pública do GitHub
        ├── ProfileMatcherModal.tsx      # Modal de Match Inteligente de Carreira
        ├── ContributionPlaybook.tsx     # Guia de PRs e gerador de commits semânticos
        └── TrackerDrawer.tsx            # Roadmap pessoal com notas e exportação Markdown
```

---

## Como Rodar Localmente

### Pré-requisitos

- **Node.js** 20+
- **npm** (ou gerenciador equivalente)

### Passo a passo

1. **Clone o repositório:**

```bash
git clone https://github.com/SEU-USUARIO/github-contrib-hub.git
cd github-contrib-hub
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua chave `GEMINI_API_KEY` (necessária apenas para o recurso de **Mentoria IA**; a curadoria, varredura ao vivo, playbook e roadmap funcionam normalmente sem ela).

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Acesse a aplicação em `http://localhost:3000`.

### Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor Express + Vite em modo desenvolvimento na porta `3000` |
| `npm run build` | Gera o bundle de produção do frontend em `dist/` |
| `npm start` | Executa o servidor full-stack (`server.ts`) |
| `npm run lint` | Executa checagem de tipos TypeScript (`tsc --noEmit`) |

---

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `GEMINI_API_KEY` | Opcional* | Chave de API do Google Gemini usada exclusivamente no servidor (`/api/ai/coach`). |
| `PORT` | Opcional | Porta HTTP do servidor (padrão: `3000`). |
| `NODE_ENV` | Opcional | Defina como `production` para servir os arquivos estáticos de `dist/`. |

*\*Obrigatória apenas se desejar utilizar o endpoint de Mentoria IA.*

---

## Endpoints da API

### `GET /api/github/search`

Proxy para a Search API do GitHub com cache em memória (TTL de 15 minutos) para reduzir chamadas repetidas e evitar bloqueios por rate limit.

- **Query params:** `q`, `sort` (padrão: `stars`), `order` (padrão: `desc`), `per_page` (máx. `30`), `page`.
- **Exemplo:** `GET /api/github/search?q=topic:erp+stars:>2000&per_page=10`

### `POST /api/ai/coach`

Gera um plano personalizado de contribuição em Markdown para o repositório selecionado.

- **Body (JSON):**
  ```json
  {
    "repoName": "medusajs/medusa",
    "description": "Motor de comércio digital headless em TypeScript/Node",
    "language": "TypeScript",
    "category": "negocios",
    "userLevel": "Júnior a Pleno",
    "userFocus": "Alavancar Carreira e Negócios"
  }
  ```

---

## Como Contribuir

Contribuições são muito bem-vindas! Você pode sugerir novos repositórios para a curadoria, melhorar filtros, corrigir bugs ou aprimorar a documentação.

1. Faça um **Fork** deste repositório.
2. Crie uma branch descritiva a partir da `main`:
   ```bash
   git checkout -b feat/novo-repositorio-negocios
   ```
3. Utilize mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat(curadoria): adiciona novo projeto open-source de CRM"
   ```
4. Execute a verificação de tipos antes de enviar:
   ```bash
   npm run lint
   ```
5. Envie sua branch e abra uma **Pull Request** descrevendo o contexto e como testar sua alteração.

---

## Licença

Este projeto está licenciado sob a licença **Apache-2.0**. Consulte os detalhes em [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
