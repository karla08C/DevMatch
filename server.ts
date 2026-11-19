import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory cache for GitHub searches to prevent rate limit
const githubCache = new Map<string, { timestamp: number; data: unknown }>();
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

// Initialize Gemini API client on server-side
const aiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (aiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: aiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// GitHub API Proxy with In-Memory Cache
app.get('/api/github/search', async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string) || 'stars:>1000';
    const sort = (req.query.sort as string) || 'stars';
    const order = (req.query.order as string) || 'desc';
    const perPage = Math.min(parseInt((req.query.per_page as string) || '15', 10), 30);
    const page = parseInt((req.query.page as string) || '1', 10);

    const cacheKey = `${q}::${sort}::${order}::${perPage}::${page}`;
    const cached = githubCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.json({ source: 'cache', ...cached.data as object });
    }

    const githubUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      q
    )}&sort=${sort}&order=${order}&per_page=${perPage}&page=${page}`;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Contrib-Hub-Applet',
    };

    const ghRes = await fetch(githubUrl, { headers });

    if (!ghRes.ok) {
      const errorText = await ghRes.text();
      // If rate limited, return 429 with notice
      if (ghRes.status === 403 || ghRes.status === 429) {
        return res.status(429).json({
          error: 'Limite da API pública do GitHub atingido temporariamente.',
          details: errorText,
          isRateLimited: true,
        });
      }
      return res.status(ghRes.status).json({ error: errorText });
    }

    const data = await ghRes.json();
    githubCache.set(cacheKey, { timestamp: Date.now(), data });
    return res.json({ source: 'live', ...data });
  } catch (error) {
    console.error('Error fetching from GitHub API:', error);
    return res.status(500).json({ error: 'Erro ao conectar à API do GitHub.' });
  }
});

// Gemini AI Contribution Advisor Endpoint
app.post('/api/ai/coach', async (req: Request, res: Response) => {
  try {
    if (!aiClient) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor. O modo assistente IA requer uma chave nos Secrets.',
      });
    }

    const { repoName, description, language, category, userLevel, userFocus } = req.body;

    if (!repoName) {
      return res.status(400).json({ error: 'repoName é obrigatório.' });
    }

    const prompt = `
Você é o mentor sênior de engenharia de software e carreiras tech da plataforma "GitHub Contrib Hub".
Analise o repositório open-source abaixo e gere um plano cirúrgico, inspirador e acionável para um desenvolvedor brasileiro contribuir:

Repositório: ${repoName}
Descrição: ${description || 'N/A'}
Linguagem principal: ${language || 'Geral'}
Eixo temático: ${category || 'Negócios / Carreira / Estudos'}
Nível do Desenvolvedor: ${userLevel || 'Iniciante / Júnior'}
Objetivo principal do Dev: ${userFocus || 'Conseguir emprego / Alavancar carreira / Aprender na prática'}

Responda em formato estruturado (Markdown elegante em Português do Brasil), com as seguintes 4 seções claras e objetivas:

### 1. Por que este projeto alavanca sua trajetória
Explique em 2 ou 3 tópicos diretos o impacto real no portfólio, no entendimento de arquitetura ou no ecossistema de negócios/estudos.

### 2. Onde colocar a mão primeiro (Mapa do Código)
Indique como navegar na estrutura do projeto (ex: pastas comuns como \`/docs\`, \`/packages\`, \`/src/components\`, testes ou localização dos scripts).

### 3. Três ideias de contribuição de alto valor
- **Ideia 1 (Rápida / Baixo Risco):** Ex: Tradução para pt-BR, correção de documentação, tipagem TypeScript ou testes unitários.
- **Ideia 2 (Funcionalidade Intermediária):** Ex: Validação de formulário, melhoria de acessibilidade (a11y), componente UI ou otimização de endpoint.
- **Ideia 3 (Destaque / Avançada):** Ex: Criação de template, integração de webhook, melhoria de CI/CD ou novo conector.

### 4. Como vender essa contribuição no LinkedIn e Entrevistas
Um parágrafo de "Storytelling Técnico" pronto para o dev usar na entrevista (como explicar a contribuição com foco em impacto de negócio e boas práticas).
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Você é um mentor técnico e de carreira de elite. Forneça conselhos práticos, realistas, respeitando as boas práticas do GitHub (PR templates, conventional commits, issues). Nunca invente dados irreais.',
      },
    });

    const advice = response.text;
    return res.json({ advice });
  } catch (error: unknown) {
    console.error('Error generating AI contribution advice:', error);
    const errMessage = error instanceof Error ? error.message : 'Erro interno';
    return res.status(500).json({ error: errMessage });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GitHub Contrib Hub server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
