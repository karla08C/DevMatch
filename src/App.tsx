import React, { useState, useEffect, useMemo } from 'react';
import { Search, Moon, Sun, BookOpen, LayoutGrid, List, Sparkles, X } from 'lucide-react';
import { CURATED_REPOSITORIES, Repository } from './data/repositories';
import {
  CategoryFilter,
  DifficultyFilter,
  LanguageFilter,
  TrackedItem,
  LiveGitHubRepo,
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RepoCard, RepoListRow } from './components/RepoCard';
import { RepoDetailModal } from './components/RepoDetailModal';
import { LiveScanner } from './components/LiveScanner';
import { ProfileMatcherModal } from './components/ProfileMatcherModal';
import { ContributionPlaybook } from './components/ContributionPlaybook';
import { TrackerDrawer } from './components/TrackerDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorar' | 'varredura' | 'playbook' | 'plano'>(
    'explorar'
  );

  // Filters & view mode for Curated Catalog
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('todas');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyFilter>('todas');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageFilter>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyPtBr, setOnlyPtBr] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'nome'>('stars');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Drawers
  const [selectedRepoForModal, setSelectedRepoForModal] = useState<Repository | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'guia' | 'impacto' | 'ai'>('guia');
  const [isMatcherOpen, setIsMatcherOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);

  // Profile Match filter state
  const [matchedRepoIds, setMatchedRepoIds] = useState<string[] | null>(null);
  const [matchSummaryBanner, setMatchSummaryBanner] = useState<string | null>(null);

  // Default to ultra-light mode, with user-controlled dark toggle
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('github_contrib_theme');
      if (savedTheme) return savedTheme === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('github_contrib_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('github_contrib_theme', 'light');
    }
  }, [isDark]);

  // Tracked roadmap items persisted in localStorage
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>(() => {
    try {
      const saved = localStorage.getItem('github_contrib_tracked_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    const initialMedusa = CURATED_REPOSITORIES.find((r) => r.id === 'medusa');
    const initialFCC = CURATED_REPOSITORIES.find((r) => r.id === 'freecodecamp');
    const defaults: TrackedItem[] = [];
    if (initialMedusa) {
      defaults.push({
        repoId: initialMedusa.id,
        repo: initialMedusa,
        stage: 'planejando',
        addedAt: new Date().toISOString(),
      });
    }
    if (initialFCC) {
      defaults.push({
        repoId: initialFCC.id,
        repo: initialFCC,
        stage: 'clonado',
        addedAt: new Date().toISOString(),
      });
    }
    return defaults;
  });

  useEffect(() => {
    try {
      localStorage.setItem('github_contrib_tracked_v1', JSON.stringify(trackedItems));
    } catch (e) {
      console.error('Failed to save tracked items:', e);
    }
  }, [trackedItems]);

  const trackedIds = useMemo(() => new Set(trackedItems.map((i) => i.repoId)), [trackedItems]);

  const axisCounts = useMemo(
    () => ({
      todas: CURATED_REPOSITORIES.length,
      negocios: CURATED_REPOSITORIES.filter((r) => r.category === 'negocios').length,
      carreira: CURATED_REPOSITORIES.filter((r) => r.category === 'carreira').length,
      estudos: CURATED_REPOSITORIES.filter((r) => r.category === 'estudos').length,
    }),
    []
  );

  const handleToggleTrack = (repo: Repository) => {
    setTrackedItems((prev) => {
      if (prev.some((i) => i.repoId === repo.id)) {
        return prev.filter((i) => i.repoId !== repo.id);
      }
      return [
        ...prev,
        {
          repoId: repo.id,
          repo,
          stage: 'planejando',
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const handleUpdateStage = (repoId: string, stage: TrackedItem['stage']) => {
    setTrackedItems((prev) =>
      prev.map((item) => (item.repoId === repoId ? { ...item, stage } : item))
    );
  };

  const handleUpdateNotes = (repoId: string, notes: string) => {
    setTrackedItems((prev) =>
      prev.map((item) => (item.repoId === repoId ? { ...item, notes } : item))
    );
  };

  const handleRemoveTracked = (repoId: string) => {
    setTrackedItems((prev) => prev.filter((item) => item.repoId !== repoId));
  };

  const openRepoModal = (repo: Repository, tab: 'guia' | 'impacto' | 'ai' = 'guia') => {
    setModalInitialTab(tab);
    setSelectedRepoForModal(repo);
  };

  const filteredRepos = useMemo(() => {
    const baseList = matchedRepoIds
      ? CURATED_REPOSITORIES.filter((r) => matchedRepoIds.includes(r.id))
      : CURATED_REPOSITORIES;

    return baseList
      .filter((repo) => {
        if (selectedCategory !== 'todas' && repo.category !== selectedCategory) return false;
        if (selectedDifficulty !== 'todas' && repo.difficulty !== selectedDifficulty) return false;
        if (selectedLanguage !== 'todas' && repo.language !== selectedLanguage) return false;
        if (onlyPtBr && !repo.ptBrFriendly) return false;
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesName = repo.fullName.toLowerCase().includes(query);
          const matchesDesc = repo.description.toLowerCase().includes(query);
          const matchesSub = repo.subCategory.toLowerCase().includes(query);
          const matchesTags = repo.tags.some((t) => t.toLowerCase().includes(query));
          if (!matchesName && !matchesDesc && !matchesSub && !matchesTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stars - a.stars;
        if (sortBy === 'forks') return b.forks - a.forks;
        return a.name.localeCompare(b.name);
      });
  }, [
    matchedRepoIds,
    selectedCategory,
    selectedDifficulty,
    selectedLanguage,
    onlyPtBr,
    searchQuery,
    sortBy,
  ]);

  const handleApplyMatches = (matchedRepos: Repository[], summaryText: string) => {
    setMatchedRepoIds(matchedRepos.map((r) => r.id));
    setMatchSummaryBanner(summaryText);
    setSelectedCategory('todas');
    setSelectedDifficulty('todas');
    setSelectedLanguage('todas');
    setOnlyPtBr(false);
    setSearchQuery('');
    setActiveTab('explorar');
  };

  const clearAllFilters = () => {
    setSelectedCategory('todas');
    setSelectedDifficulty('todas');
    setSelectedLanguage('todas');
    setOnlyPtBr(false);
    setSearchQuery('');
    setMatchedRepoIds(null);
    setMatchSummaryBanner(null);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
      selectedCategory !== 'todas' ||
      selectedDifficulty !== 'todas' ||
      selectedLanguage !== 'todas' ||
      onlyPtBr ||
      matchedRepoIds
  );

  const handleAskAIForLiveRepo = (liveRepo: LiveGitHubRepo) => {
    const convertedRepo: Repository = {
      id: liveRepo.full_name.replace('/', '-'),
      fullName: liveRepo.full_name,
      name: liveRepo.name,
      owner: liveRepo.owner.login,
      avatarUrl: liveRepo.owner.avatar_url,
      description: liveRepo.description || 'Repositório público no GitHub.',
      category: 'estudos',
      subCategory: liveRepo.topics?.[0] || 'Open Source',
      stars: liveRepo.stargazers_count,
      forks: liveRepo.forks_count,
      openIssuesCount: liveRepo.open_issues_count,
      language: liveRepo.language || 'Geral',
      tags: liveRepo.topics || [],
      difficulty: 'intermediario',
      businessImpact: 'Compreensão de soluções em produção.',
      careerImpact: 'Destaque como colaborador open source.',
      studyImpact: 'Leitura de código real e boas práticas.',
      goodFirstIssuesUrl: `${liveRepo.html_url}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
      contributingUrl: `${liveRepo.html_url}/blob/main/CONTRIBUTING.md`,
      githubUrl: liveRepo.html_url,
      ptBrFriendly: false,
      quickStartCommand: `git clone ${liveRepo.html_url}.git`,
    };
    openRepoModal(convertedRepo, 'ai');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMatcher={() => setIsMatcherOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        trackedCount={trackedItems.length}
      />

      {/* Airy Editorial Hero (shown on Curadoria view) */}
      <HeroSection
        activeTab={activeTab}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('explorar');
          setMatchedRepoIds(null);
          setMatchSummaryBanner(null);
        }}
        onOpenLiveScan={() => setActiveTab('varredura')}
        onOpenMatcher={() => setIsMatcherOpen(true)}
        axisCounts={axisCounts}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* Match Summary Notification Bar */}
        {matchSummaryBanner && activeTab === 'explorar' && (
          <div className="mb-7 px-5 py-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-500/10 border border-blue-200/70 dark:border-blue-500/20 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-blue-950 dark:text-blue-100">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-medium">{matchSummaryBanner}</span>
            </div>
            <button
              onClick={() => {
                setMatchedRepoIds(null);
                setMatchSummaryBanner(null);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 dark:text-blue-300 dark:hover:text-white shrink-0 transition-colors whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>Mostrar todos</span>
            </button>
          </div>
        )}

        {/* View 1: Curated Catalog */}
        {activeTab === 'explorar' && (
          <div className="space-y-6">
            {/* Sleek Frameless / Single-Row Filter Strip */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por nome, stack ou tema (ex: erp, react, ats)..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  aria-label="Filtrar por linguagem"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as LanguageFilter)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="todas">Linguagem: Todas</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Markdown">Markdown</option>
                </select>

                <select
                  aria-label="Filtrar por nível"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyFilter)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="todas">Nível: Todos</option>
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>

                <button
                  type="button"
                  onClick={() => setOnlyPtBr(!onlyPtBr)}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                    onlyPtBr
                      ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30'
                      : 'bg-white text-zinc-700 border-zinc-200/80 hover:border-zinc-300 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800'
                  }`}
                >
                  {onlyPtBr ? 'PT-BR ativo' : 'Apenas PT-BR'}
                </button>

                <select
                  aria-label="Ordenar projetos"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'stars' | 'forks' | 'nome')}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="stars">Ordenar: Estrelas</option>
                  <option value="forks">Ordenar: Forks</option>
                  <option value="nome">Ordenar: A–Z</option>
                </select>

                {/* Grid / List View Switcher */}
                <div className="inline-flex items-center p-0.5 bg-zinc-100/90 dark:bg-zinc-900 border border-zinc-200/70 dark:border-zinc-800 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Visualização em grade"
                    title="Visualização em grade"
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    aria-label="Visualização em lista"
                    title="Visualização em lista"
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                        : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quiet Count & Clear Row */}
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <p>
                Exibindo{' '}
                <span className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-white">
                  {filteredRepos.length}
                </span>{' '}
                de{' '}
                <span className="font-mono tabular-nums">{CURATED_REPOSITORIES.length}</span>{' '}
                projetos
              </p>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Empty State or Populated Grid / List */}
            {filteredRepos.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-8">
                <BookOpen className="w-9 h-9 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                <h3 className="font-display text-base font-semibold text-zinc-900 dark:text-white">
                  Nenhum projeto corresponde aos filtros atuais
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                  Limpe a busca ou tente outra combinação de linguagem e nível.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-5 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Mostrar todos os projetos
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRepos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    onOpenDetails={(r) => openRepoModal(r, 'guia')}
                    onToggleTrack={handleToggleTrack}
                    isTracked={trackedIds.has(repo.id)}
                    onAskAI={(r) => openRepoModal(r, 'ai')}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredRepos.map((repo) => (
                  <RepoListRow
                    key={repo.id}
                    repo={repo}
                    onOpenDetails={(r) => openRepoModal(r, 'guia')}
                    onToggleTrack={handleToggleTrack}
                    isTracked={trackedIds.has(repo.id)}
                    onAskAI={(r) => openRepoModal(r, 'ai')}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: Live GitHub Scanner */}
        {activeTab === 'varredura' && (
          <LiveScanner
            onSelectRepoForDetails={(r) => openRepoModal(r, 'guia')}
            onToggleTrack={handleToggleTrack}
            trackedIds={trackedIds}
            onAskAIForLiveRepo={handleAskAIForLiveRepo}
          />
        )}

        {/* View 3: Contribution Playbook */}
        {activeTab === 'playbook' && <ContributionPlaybook />}
      </main>

      {/* Quiet, Light Footer */}
      <footer className="border-t border-zinc-200/70 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 py-7 text-xs text-zinc-500 dark:text-zinc-400 transition-colors">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-zinc-900 dark:text-white">
              GitHub Contrib Hub
            </span>
            <span aria-hidden="true">·</span>
            <span>Curadoria Open-Source para Negócios, Carreira e Estudos</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="inline-flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Tema Claro' : 'Tema Escuro'}</span>
            </button>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              GitHub.com
            </a>
          </div>
        </div>
      </footer>

      {/* Slide-Over Details & AI Mentor */}
      <RepoDetailModal
        repo={selectedRepoForModal}
        initialTab={modalInitialTab}
        onClose={() => setSelectedRepoForModal(null)}
        isTracked={selectedRepoForModal ? trackedIds.has(selectedRepoForModal.id) : false}
        onToggleTrack={handleToggleTrack}
      />

      {/* Profile Matcher Modal */}
      <ProfileMatcherModal
        isOpen={isMatcherOpen}
        onClose={() => setIsMatcherOpen(false)}
        onApplyMatches={handleApplyMatches}
        allRepos={CURATED_REPOSITORIES}
      />

      {/* Personal Roadmap Slide-Over */}
      <TrackerDrawer
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        trackedItems={trackedItems}
        onUpdateStage={handleUpdateStage}
        onUpdateNotes={handleUpdateNotes}
        onRemoveItem={handleRemoveTracked}
        onOpenDetails={(item) => {
          setIsTrackerOpen(false);
          openRepoModal(item.repo, 'guia');
        }}
      />
    </div>
  );
}
