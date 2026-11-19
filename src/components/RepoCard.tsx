import React, { useState } from 'react';
import { Star, GitFork, ExternalLink, Bookmark, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Repository } from '../data/repositories';

interface RepoCardProps {
  repo: Repository;
  onOpenDetails: (repo: Repository) => void;
  onToggleTrack: (repo: Repository) => void;
  isTracked: boolean;
  onAskAI: (repo: Repository) => void;
}

const formatCompact = (num: number) =>
  new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(num);

const getCategoryLabel = (category: Repository['category']) => {
  switch (category) {
    case 'negocios':
      return 'Negócios';
    case 'carreira':
      return 'Carreira';
    case 'estudos':
      return 'Estudos';
  }
};

const getDifficultyLabel = (diff: Repository['difficulty']) => {
  switch (diff) {
    case 'iniciante':
      return 'Iniciante';
    case 'intermediario':
      return 'Intermediário';
    case 'avancado':
      return 'Avançado';
  }
};

const RepoAvatar: React.FC<{ src: string; owner: string; size?: 'sm' | 'md' }> = ({
  src,
  owner,
  size = 'md',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const sizeClass = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  if (imgFailed || !src) {
    return (
      <div
        className={`${sizeClass} rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 flex items-center justify-center font-display font-semibold text-zinc-600 dark:text-zinc-300 shrink-0 select-none`}
        aria-hidden="true"
      >
        {owner.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={owner}
      referrerPolicy="no-referrer"
      onError={() => setImgFailed(true)}
      className={`${sizeClass} rounded-lg border border-zinc-200/80 dark:border-zinc-800 object-cover shrink-0 bg-zinc-50 dark:bg-zinc-900`}
    />
  );
};

export const RepoCard: React.FC<RepoCardProps> = ({
  repo,
  onOpenDetails,
  onToggleTrack,
  isTracked,
  onAskAI,
}) => {
  const impactText =
    repo.category === 'negocios'
      ? repo.businessImpact
      : repo.category === 'carreira'
      ? repo.careerImpact
      : repo.studyImpact;

  return (
    <article className="group bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-6 transition-all duration-150 ease-out hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-[0_10px_30px_-14px_rgba(24,24,27,0.1)] hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        {/* Quiet Unboxed Metadata Line */}
        <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              {getCategoryLabel(repo.category)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{repo.subCategory}</span>
          </div>

          {repo.ptBrFriendly && (
            <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 whitespace-nowrap shrink-0">
              PT-BR
            </span>
          )}
        </div>

        {/* Header: Avatar + Name + Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <RepoAvatar src={repo.avatarUrl} owner={repo.owner} />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-white truncate">
                <button
                  onClick={() => onOpenDetails(repo)}
                  className="text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:underline truncate max-w-full"
                >
                  {repo.fullName}
                </button>
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium">{repo.language}</span>
                <span aria-hidden="true">·</span>
                <span>{getDifficultyLabel(repo.difficulty)}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-mono tabular-nums">
                  <Star className="w-3 h-3 text-zinc-400" />
                  {formatCompact(repo.stars)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onToggleTrack(repo)}
            aria-label={isTracked ? `Remover ${repo.name} do meu plano` : `Salvar ${repo.name} no meu plano`}
            title={isTracked ? 'Salvo no meu plano' : 'Salvar no meu plano'}
            className={`p-2 rounded-lg transition-colors duration-150 shrink-0 ${
              isTracked
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
                : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {isTracked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
          {repo.description}
        </p>

        {/* Airy Impact Note (no nested box) */}
        <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Por que vale a pena: </span>
            {impactText}
          </p>
        </div>
      </div>

      {/* Lightweight Footer Controls */}
      <div className="mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenDetails(repo)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            <span>Abrir Guia</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>

          <button
            onClick={() => onAskAI(repo)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:text-blue-700 hover:bg-blue-50/70 dark:text-zinc-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10 rounded-md transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>Mentoria IA</span>
          </button>
        </div>

        <a
          href={repo.goodFirstIssuesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors whitespace-nowrap"
        >
          <span>Issues</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </article>
  );
};

export const RepoListRow: React.FC<RepoCardProps> = ({
  repo,
  onOpenDetails,
  onToggleTrack,
  isTracked,
  onAskAI,
}) => {
  return (
    <div className="group bg-white dark:bg-zinc-900/70 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/50 transition-colors duration-150 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        <RepoAvatar src={repo.avatarUrl} owner={repo.owner} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenDetails(repo)}
              className="font-display text-sm font-semibold text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {repo.fullName}
            </button>
            <span className="text-xs text-zinc-400" aria-hidden="true">·</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{getCategoryLabel(repo.category)}</span>
            <span className="text-xs text-zinc-400" aria-hidden="true">·</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{getDifficultyLabel(repo.difficulty)}</span>
            {repo.ptBrFriendly && (
              <>
                <span className="text-xs text-zinc-400" aria-hidden="true">·</span>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">PT-BR</span>
              </>
            )}
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate mt-1">
            {repo.description}
          </p>
        </div>
      </div>

      {/* Right tabular metadata & actions */}
      <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
        <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="w-20 text-right font-medium text-zinc-700 dark:text-zinc-300 hidden lg:inline">
            {repo.language}
          </span>
          <span className="w-16 text-right font-mono tabular-nums inline-flex items-center justify-end gap-1">
            <Star className="w-3 h-3 text-zinc-400" />
            {formatCompact(repo.stars)}
          </span>
          <span className="w-16 text-right font-mono tabular-nums hidden md:inline-flex items-center justify-end gap-1">
            <GitFork className="w-3 h-3 text-zinc-400" />
            {formatCompact(repo.forks)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAskAI(repo)}
            title="Abrir Mentoria IA"
            className="px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-blue-700 hover:bg-blue-50/70 dark:text-zinc-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10 rounded-md transition-colors inline-flex items-center gap-1 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">IA</span>
          </button>

          <button
            onClick={() => onOpenDetails(repo)}
            className="px-2.5 py-1.5 text-xs font-semibold text-zinc-800 hover:text-blue-600 dark:text-zinc-200 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            Guia
          </button>

          <button
            onClick={() => onToggleTrack(repo)}
            aria-label={isTracked ? 'Remover do plano' : 'Salvar no plano'}
            className={`p-1.5 rounded-lg transition-colors ${
              isTracked
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
                : 'text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {isTracked ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
