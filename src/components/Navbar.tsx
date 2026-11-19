import React from 'react';
import { Compass } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explorar' | 'varredura' | 'playbook' | 'plano';
  setActiveTab: (tab: 'explorar' | 'varredura' | 'playbook' | 'plano') => void;
  onOpenMatcher: () => void;
  onOpenTracker: () => void;
  trackedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenMatcher,
  onOpenTracker,
  trackedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-200/70 dark:bg-zinc-950/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          onClick={() => setActiveTab('explorar')}
          className="font-display font-semibold text-base sm:text-lg tracking-tight text-zinc-950 dark:text-white whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded-md"
        >
          GitHub Contrib Hub
        </button>

        {/* Zone 2: Clean Single-Line Typography Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm" aria-label="Navegação principal">
          <button
            onClick={() => setActiveTab('explorar')}
            className={`relative py-5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-blue-600 ${
              activeTab === 'explorar'
                ? 'text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium'
            }`}
          >
            Curadoria
            {activeTab === 'explorar' && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('varredura')}
            className={`relative py-5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-blue-600 ${
              activeTab === 'varredura'
                ? 'text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium'
            }`}
          >
            Varredura ao Vivo
            {activeTab === 'varredura' && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('playbook')}
            className={`relative py-5 whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:text-blue-600 ${
              activeTab === 'playbook'
                ? 'text-zinc-950 dark:text-white font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium'
            }`}
          >
            Playbook
            {activeTab === 'playbook' && (
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-600 dark:bg-blue-500 rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenTracker}
            className="relative py-5 whitespace-nowrap shrink-0 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 font-medium transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:text-blue-600"
          >
            <span>Meu Plano</span>
            {trackedCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-blue-600 dark:text-blue-400 font-medium">
                {trackedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenMatcher}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 shadow-[0_1px_2px_rgba(37,99,235,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Match de Carreira</span>
          </button>
        </div>
      </div>

      {/* Compact Mobile Sub-Navigation (only on < md) */}
      <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800/80 px-4 overflow-x-auto">
        <div className="flex items-center gap-5 h-10 text-xs">
          <button
            onClick={() => setActiveTab('explorar')}
            className={`whitespace-nowrap shrink-0 font-medium transition-colors ${
              activeTab === 'explorar' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            Curadoria
          </button>
          <button
            onClick={() => setActiveTab('varredura')}
            className={`whitespace-nowrap shrink-0 font-medium transition-colors ${
              activeTab === 'varredura' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            Varredura ao Vivo
          </button>
          <button
            onClick={() => setActiveTab('playbook')}
            className={`whitespace-nowrap shrink-0 font-medium transition-colors ${
              activeTab === 'playbook' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            Playbook
          </button>
          <button
            onClick={onOpenTracker}
            className="whitespace-nowrap shrink-0 font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1"
          >
            <span>Meu Plano</span>
            {trackedCount > 0 && (
              <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400">({trackedCount})</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
