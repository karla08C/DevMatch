import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Star,
  GitFork,
  ExternalLink,
  Bookmark,
  Check,
  Copy,
  Sparkles,
  Terminal,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Repository } from '../data/repositories';

interface RepoDetailModalProps {
  repo: Repository | null;
  initialTab?: 'guia' | 'impacto' | 'ai';
  onClose: () => void;
  isTracked: boolean;
  onToggleTrack: (repo: Repository) => void;
}

const renderInlineFormatting = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-zinc-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 text-[12px] bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
};

const FormattedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) return <div key={idx} className="h-1" />;

        if (line.startsWith('### ')) {
          return (
            <h4
              key={idx}
              className="font-display text-base font-semibold text-zinc-950 dark:text-white pt-3 first:pt-0"
            >
              {line.replace(/^###\s+/, '')}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3
              key={idx}
              className="font-display text-lg font-semibold text-zinc-950 dark:text-white pt-3 first:pt-0"
            >
              {line.replace(/^##\s+/, '')}
            </h3>
          );
        }
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1">
              <span className="text-blue-500 mt-2 w-1 h-1 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
              <p className="flex-1">{renderInlineFormatting(line.slice(2))}</p>
            </div>
          );
        }

        return <p key={idx}>{renderInlineFormatting(line)}</p>;
      })}
    </div>
  );
};

export const RepoDetailModal: React.FC<RepoDetailModalProps> = ({
  repo,
  initialTab = 'guia',
  onClose,
  isTracked,
  onToggleTrack,
}) => {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'guia' | 'impacto' | 'ai'>(initialTab);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  const fetchAiCoach = useCallback(async (targetRepo: Repository) => {
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: targetRepo.fullName,
          description: targetRepo.description,
          language: targetRepo.language,
          category: targetRepo.category,
          userLevel: 'Júnior a Pleno',
          userFocus: 'Alavancar Carreira, Negócios e Estudos',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao consultar a mentoria de IA.');
      }

      setAiAdvice(data.advice);
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : 'Falha ao conectar com o serviço de IA.');
    } finally {
      setAiLoading(false);
    }
  }, []);

  // Reset modal state whenever repo or initialTab changes
  useEffect(() => {
    if (!repo) return;
    setActiveTab(initialTab);
    setAiAdvice(null);
    setAiError(null);
    setImgFailed(false);
    setCopiedCmd(false);

    if (initialTab === 'ai') {
      fetchAiCoach(repo);
    }
  }, [repo, initialTab, fetchAiCoach]);

  // Close on Escape
  useEffect(() => {
    if (!repo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [repo, onClose]);

  if (!repo) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleOpenAiTab = () => {
    setActiveTab('ai');
    if (!aiAdvice && !aiLoading) {
      fetchAiCoach(repo);
    }
  };

  const categoryLabel =
    repo.category === 'negocios'
      ? 'Negócios'
      : repo.category === 'carreira'
      ? 'Carreira'
      : 'Estudos';

  return (
    <div
      className="fixed inset-0 z-50 bg-zinc-950/35 backdrop-blur-xs flex justify-end transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="repo-modal-title"
    >
      <div
        className="bg-white dark:bg-zinc-900 border-l border-zinc-200/80 dark:border-zinc-800 w-full max-w-2xl h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            {imgFailed || !repo.avatarUrl ? (
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center font-display font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
                {repo.owner.slice(0, 2).toUpperCase()}
              </div>
            ) : (
              <img
                src={repo.avatarUrl}
                alt={repo.owner}
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-12 h-12 rounded-xl border border-zinc-200/80 dark:border-zinc-800 object-cover shrink-0 bg-zinc-50"
              />
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-blue-600 dark:text-blue-400">{categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{repo.subCategory}</span>
              </div>
              <h2
                id="repo-modal-title"
                className="font-display text-xl font-semibold text-zinc-950 dark:text-white mt-0.5 truncate"
              >
                {repo.fullName}
              </h2>
              <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">{repo.language}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-zinc-400" />
                  {repo.stars.toLocaleString('pt-BR')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums inline-flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5 text-zinc-400" />
                  {repo.forks.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleTrack(repo)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                isTracked
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                  : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200'
              }`}
            >
              {isTracked ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isTracked ? 'Salvo' : 'Salvar'}</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Fechar detalhes"
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Clean Tab Bar */}
        <div className="px-6 sm:px-8 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center gap-6 text-sm bg-zinc-50/60 dark:bg-zinc-900/60">
          <button
            onClick={() => setActiveTab('guia')}
            className={`relative py-3.5 transition-colors whitespace-nowrap ${
              activeTab === 'guia'
                ? 'text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
            }`}
          >
            Passo a Passo
            {activeTab === 'guia' && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('impacto')}
            className={`relative py-3.5 transition-colors whitespace-nowrap ${
              activeTab === 'impacto'
                ? 'text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
            }`}
          >
            Impacto Estratégico
            {activeTab === 'impacto' && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={handleOpenAiTab}
            className={`relative py-3.5 transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Mentoria IA</span>
            {activeTab === 'ai' && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {activeTab === 'guia' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  Visão Geral
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              {/* Light, Crisp Quick Start Terminal Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                    Setup Local Rápido
                  </span>
                  <button
                    onClick={() => copyToClipboard(repo.quickStartCommand)}
                    className="text-xs font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCmd ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-xs rounded-xl overflow-x-auto">
                  {repo.quickStartCommand}
                </div>
              </div>

              {/* Clean Whitespace Checklist */}
              <div>
                <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-4">
                  Roteiro para sua primeira contribuição
                </h3>
                <ol className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  <li className="py-3.5 first:pt-0 flex items-start gap-3.5 text-sm">
                    <span className="font-mono text-xs text-zinc-400 pt-0.5 tabular-nums">01.</span>
                    <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      <span className="font-medium text-zinc-900 dark:text-white">Leia as diretrizes: </span>
                      Consulte o{' '}
                      <a
                        href={repo.contributingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs"
                      >
                        CONTRIBUTING.md
                      </a>{' '}
                      para padrões de branch, linter e testes exigidos pelos mantenedores.
                    </div>
                  </li>
                  <li className="py-3.5 flex items-start gap-3.5 text-sm">
                    <span className="font-mono text-xs text-zinc-400 pt-0.5 tabular-nums">02.</span>
                    <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      <span className="font-medium text-zinc-900 dark:text-white">Escolha uma issue ativa: </span>
                      Explore tarefas rotuladas como{' '}
                      <a
                        href={repo.goodFirstIssuesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-xs"
                      >
                        good first issue
                      </a>{' '}
                      e comente solicitando atribuição antes de começar.
                    </div>
                  </li>
                  <li className="py-3.5 flex items-start gap-3.5 text-sm">
                    <span className="font-mono text-xs text-zinc-400 pt-0.5 tabular-nums">03.</span>
                    <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      <span className="font-medium text-zinc-900 dark:text-white">Fork e branch semântica: </span>
                      Crie um fork no seu perfil e trabalhe em uma branch dedicada (ex:{' '}
                      <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                        fix/issue-123
                      </code>
                      ).
                    </div>
                  </li>
                  <li className="py-3.5 pb-0 flex items-start gap-3.5 text-sm">
                    <span className="font-mono text-xs text-zinc-400 pt-0.5 tabular-nums">04.</span>
                    <div className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                      <span className="font-medium text-zinc-900 dark:text-white">Submeta a Pull Request: </span>
                      Descreva o contexto, o que mudou e como validar a solução com evidências claras.
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'impacto' && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              <div className="py-5 first:pt-0">
                <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-white mb-1.5">
                  01. Impacto em Negócios
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {repo.businessImpact}
                </p>
              </div>

              <div className="py-5">
                <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-white mb-1.5">
                  02. Impacto na Carreira e Empregabilidade
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {repo.careerImpact}
                </p>
              </div>

              <div className="py-5 pb-0">
                <h3 className="font-display text-sm font-semibold text-zinc-950 dark:text-white mb-1.5">
                  03. Impacto nos Estudos e Arquitetura
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {repo.studyImpact}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              {aiLoading && (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-3" />
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    Analisando o repositório e montando seu plano personalizado...
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Identificando pontos de entrada, ideias de PR e narrativa para entrevistas.
                  </p>
                </div>
              )}

              {aiError && !aiLoading && (
                <div className="p-5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-sm">
                  <div className="flex items-center gap-2 font-semibold mb-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Não foi possível gerar a mentoria agora</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">{aiError}</p>
                  <button
                    onClick={() => fetchAiCoach(repo)}
                    className="mt-4 px-3.5 py-1.5 text-xs bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              )}

              {aiAdvice && !aiLoading && <FormattedMarkdown content={aiAdvice} />}
            </div>
          )}
        </div>

        {/* Clean Sticky Footer */}
        <div className="px-6 sm:px-8 py-4 bg-zinc-50/70 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <a
              href={repo.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Abrir no GitHub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={repo.goodFirstIssuesUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/90 dark:border-zinc-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Ver Good First Issues</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
