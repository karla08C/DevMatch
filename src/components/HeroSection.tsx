import React from 'react';
import { Radio, ArrowUpRight, Compass } from 'lucide-react';
import { CategoryFilter } from '../types';

interface AxisCounts {
  todas: number;
  negocios: number;
  carreira: number;
  estudos: number;
}

interface HeroSectionProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  onOpenLiveScan: () => void;
  onOpenMatcher: () => void;
  axisCounts: AxisCounts;
  activeTab: 'explorar' | 'varredura' | 'playbook' | 'plano';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenLiveScan,
  onOpenMatcher,
  axisCounts,
  activeTab,
}) => {
  const axes: { id: CategoryFilter; label: string; hint: string; count: number }[] = [
    { id: 'todas', label: 'Todos os Eixos', hint: 'Curadoria completa', count: axisCounts.todas },
    { id: 'negocios', label: 'Negócios', hint: 'ERP, CRM e E-commerce', count: axisCounts.negocios },
    { id: 'carreira', label: 'Carreira', hint: 'Portfólio e Entrevistas', count: axisCounts.carreira },
    { id: 'estudos', label: 'Estudos', hint: 'CS e Arquitetura', count: axisCounts.estudos },
  ];

  // When on secondary views (Live Scanner or Playbook), show a lighter, minimal contextual header
  if (activeTab !== 'explorar') {
    return null;
  }

  return (
    <section className="relative bg-gradient-to-b from-white via-[#FAFAFC] to-[#FAFAFC] dark:from-zinc-900/50 dark:via-zinc-950 dark:to-zinc-950 border-b border-zinc-200/70 dark:border-zinc-800/70">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-10 pb-8 lg:pt-14 lg:pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          {/* Editorial Headline Block */}
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
              Curadoria Open-Source · Negócios, Carreira e Estudos
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-semibold text-zinc-950 dark:text-white tracking-tight leading-[1.12] text-balance">
              Contribua em projetos do GitHub com retorno real.
            </h1>
            <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl">
              Repositórios ativos selecionados por impacto comercial, peso no currículo e profundidade técnica — prontos para sua próxima pull request.
            </p>
          </div>

          {/* Lightweight Right Action Cluster */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenMatcher}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-lg transition-all duration-150 whitespace-nowrap shadow-[0_1px_3px_rgba(37,99,235,0.25)]"
            >
              <Compass className="w-4 h-4" />
              <span>Encontrar Meu Match</span>
            </button>
            <button
              onClick={onOpenLiveScan}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 dark:text-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200/90 dark:border-zinc-800 rounded-lg transition-colors duration-150 whitespace-nowrap"
            >
              <Radio className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <span>Varredura ao Vivo</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Sleek Axis Switcher */}
        <div className="mt-9 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filtrar por eixo temático"
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-zinc-100/90 dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800/80"
          >
            {axes.map((axis) => {
              const isActive = activeCategory === axis.id;
              return (
                <button
                  key={axis.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelectCategory(axis.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm rounded-lg transition-all duration-150 flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 font-medium'
                  }`}
                >
                  <span>{axis.label}</span>
                  <span
                    className={`font-mono text-[11px] tabular-nums ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {axis.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <span>Issues Good First Issue</span>
            <span aria-hidden="true">·</span>
            <span>Comunidade PT-BR e Global</span>
            <span aria-hidden="true">·</span>
            <span>Mentoria IA sob demanda</span>
          </div>
        </div>
      </div>
    </section>
  );
};
