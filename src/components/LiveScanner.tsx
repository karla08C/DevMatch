import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  Bookmark,
  Check,
  Sparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { LiveGitHubRepo } from '../types';
import { Repository } from '../data/repositories';

interface LiveScannerProps {
  onSelectRepoForDetails: (repo: Repository) => void;
  onToggleTrack: (repo: Repository) => void;
  trackedIds: Set<string>;
  onAskAIForLiveRepo: (repo: LiveGitHubRepo) => void;
}

interface ScanPreset {
  id: string;
  label: string;
  query: string;
  category: 'negocios' | 'carreira' | 'estudos';
}

const PRESETS: ScanPreset[] = [
  {
    id: 'business-saas',
    label: 'Negócios & SaaS',
    query: 'topic:business OR topic:erp OR topic:crm OR topic:ecommerce stars:>2500',
    category: 'negocios',
  },
  {
    id: 'career-growth',
    label: 'Carreira & Entrevistas',
    query: 'topic:interview OR topic:resume OR topic:career OR topic:roadmap stars:>2000',
    category: 'carreira',
  },
  {
    id: 'studies-cs',
    label: 'Estudos & Algoritmos',
    query: 'topic:education OR topic:algorithms OR topic:learning stars:>3000',
    category: 'estudos',
  },
  {
    id: 'good-first-issues',
    label: 'Good First Issues',
    query: 'good-first-issues:>10 stars:>1500',
    category: 'carreira',
  },
  {
    id: 'brazil-pt',
    label: 'Comunidade Brasil',
    query: 'brasil OR "portugues" OR "iniciantes" stars:>500',
    category: 'estudos',
  },
];

export const LiveScanner: React.FC<LiveScannerProps> = ({
  onSelectRepoForDetails,
  onToggleTrack,
  trackedIds,
  onAskAIForLiveRepo,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('business-saas');
  const [customQuery, setCustomQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [repos, setRepos] = useState<LiveGitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [sourceInfo, setSourceInfo] = useState<string>('');

  const executeScan = async (queryToRun: string) => {
    setLoading(true);
    setError(null);
    setActiveQuery(queryToRun);

    try {
      const res = await fetch(
        `/api/github/search?q=${encodeURIComponent(queryToRun)}&per_page=16&sort=stars`
      );

      if (!res.ok) {
        const directRes = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(
            queryToRun
          )}&per_page=16&sort=stars`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
            },
          }
        );
        if (!directRes.ok) {
          throw new Error(
            'Limite temporário da API pública do GitHub atingido. Aguarde alguns instantes e tente novamente.'
          );
        }
        const directData = await directRes.json();
        setRepos(directData.items || []);
        setTotalCount(directData.total_count || 0);
        setSourceInfo('GitHub API');
        return;
      }

      const data = await res.json();
      setRepos(data.items || []);
      setTotalCount(data.total_count || 0);
      setSourceInfo(data.source === 'cache' ? 'Cache rápido' : 'Tempo real');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Falha ao realizar varredura no GitHub.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentPreset = PRESETS.find((p) => p.id === selectedPreset);
    if (currentPreset) {
      executeScan(currentPreset.query);
    }
  }, [selectedPreset]);

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    executeScan(customQuery.trim());
  };

  const convertToInternalRepo = (liveRepo: LiveGitHubRepo): Repository => {
    const activePresetObj = PRESETS.find((p) => p.id === selectedPreset);
    const category = activePresetObj?.category || 'estudos';

    return {
      id: liveRepo.full_name.replace('/', '-'),
      fullName: liveRepo.full_name,
      name: liveRepo.name,
      owner: liveRepo.owner.login,
      avatarUrl: liveRepo.owner.avatar_url,
      description: liveRepo.description || 'Repositório público no GitHub.',
      category,
      subCategory: liveRepo.topics?.[0] || 'Open Source',
      stars: liveRepo.stargazers_count,
      forks: liveRepo.forks_count,
      openIssuesCount: liveRepo.open_issues_count,
      language: liveRepo.language || 'Geral',
      tags: liveRepo.topics || [],
      difficulty: liveRepo.stargazers_count > 10000 ? 'intermediario' : 'iniciante',
      businessImpact: 'Compreensão de soluções abertas de alto valor no mercado corporativo.',
      careerImpact: 'Destaque como colaborador em bases de código públicas de grande visibilidade.',
      studyImpact: 'Leitura de código real com padrões de engenharia adotados mundialmente.',
      goodFirstIssuesUrl: `${liveRepo.html_url}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
      contributingUrl: `${liveRepo.html_url}/blob/main/CONTRIBUTING.md`,
      githubUrl: liveRepo.html_url,
      ptBrFriendly: false,
      quickStartCommand: `git clone ${liveRepo.html_url}.git`,
    };
  };

  const formatCompact = (num: number) =>
    new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(num);

  return (
    <div className="space-y-8">
      {/* Light Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-zinc-200/70 dark:border-zinc-800/80">
        <div className="max-w-2xl">
          <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            Busca Direta · API Pública do GitHub
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-950 dark:text-white tracking-tight text-balance">
            Varredura ao Vivo de Repositórios
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Explore projetos ativos em tempo real usando presets estratégicos ou qualquer consulta personalizada.
          </p>
        </div>

        {/* Inline Search Form */}
        <form onSubmit={handleCustomSearchSubmit} className="flex items-center gap-2 w-full lg:w-96 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Buscar no GitHub (ex: fintech python)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !customQuery.trim()}
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Presets + Status Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-zinc-100/90 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id && !customQuery;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  setCustomQuery('');
                }}
                className={`px-3.5 py-1.5 text-xs sm:text-sm rounded-lg transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 font-medium'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          {!loading && totalCount !== null && (
            <span>
              <strong className="font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
                {totalCount.toLocaleString('pt-BR')}
              </strong>{' '}
              resultados{sourceInfo ? ` · ${sourceInfo}` : ''}
            </span>
          )}
          <button
            onClick={() => activeQuery && executeScan(activeQuery)}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Não foi possível concluir a varredura</p>
            <p className="text-xs mt-1 opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Skeleton Loading State matching Card Geometry */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-6 space-y-4 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-44 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-3.5 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
                <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {repos.map((liveRepo) => {
            const internalRepo = convertToInternalRepo(liveRepo);
            const isTracked = trackedIds.has(internalRepo.id);

            return (
              <article
                key={liveRepo.id}
                className="group bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-6 flex flex-col justify-between transition-all duration-150 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_10px_30px_-14px_rgba(24,24,27,0.1)] hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {liveRepo.language || 'Multi-stack'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums inline-flex items-center gap-1">
                          <Star className="w-3 h-3 text-zinc-400" />
                          {formatCompact(liveRepo.stargazers_count)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums inline-flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-zinc-400" />
                          {formatCompact(liveRepo.forks_count)}
                        </span>
                        {liveRepo.license?.spdx_id && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{liveRepo.license.spdx_id}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-white truncate">
                        <button
                          onClick={() => onSelectRepoForDetails(internalRepo)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate max-w-full"
                        >
                          {liveRepo.full_name}
                        </button>
                      </h3>
                    </div>

                    <button
                      onClick={() => onToggleTrack(internalRepo)}
                      aria-label={isTracked ? 'Remover do plano' : 'Salvar no plano'}
                      className={`p-2 rounded-lg transition-colors shrink-0 ${
                        isTracked
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
                          : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      {isTracked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed">
                    {liveRepo.description || 'Repositório open-source disponível para contribuições.'}
                  </p>

                  {liveRepo.topics && liveRepo.topics.length > 0 && (
                    <div className="mt-3.5 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 flex-wrap">
                      {liveRepo.topics.slice(0, 4).map((topic, i) => (
                        <React.Fragment key={topic}>
                          {i > 0 && <span aria-hidden="true">·</span>}
                          <span>{topic}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectRepoForDetails(internalRepo)}
                      className="inline-flex items-center gap-1 font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 transition-colors"
                    >
                      <span>Abrir Guia</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onAskAIForLiveRepo(liveRepo)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 font-medium text-zinc-600 hover:text-blue-700 hover:bg-blue-50/70 dark:text-zinc-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10 rounded-md transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                      <span>Mentoria IA</span>
                    </button>
                  </div>

                  <a
                    href={`${liveRepo.html_url}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    <span>Issues</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
