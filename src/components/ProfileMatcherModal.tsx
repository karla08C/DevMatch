import React, { useState, useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Repository } from '../data/repositories';

interface ProfileMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMatches: (matchedRepos: Repository[], summaryText: string) => void;
  allRepos: Repository[];
}

export const ProfileMatcherModal: React.FC<ProfileMatcherModalProps> = ({
  isOpen,
  onClose,
  onApplyMatches,
  allRepos,
}) => {
  const [level, setLevel] = useState<string>('junior');
  const [focus, setFocus] = useState<string>('carreira');
  const [stack, setStack] = useState<string>('typescript');

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleMatch = () => {
    let filtered = [...allRepos];

    if (focus === 'negocios') {
      filtered = filtered.filter((r) => r.category === 'negocios');
    } else if (focus === 'carreira') {
      filtered = filtered.filter((r) => r.category === 'carreira');
    } else if (focus === 'estudos') {
      filtered = filtered.filter((r) => r.category === 'estudos');
    }

    if (stack === 'typescript') {
      filtered.sort(
        (a, b) =>
          (b.language === 'TypeScript' || b.language === 'JavaScript' ? 1 : 0) -
          (a.language === 'TypeScript' || a.language === 'JavaScript' ? 1 : 0)
      );
    } else if (stack === 'python') {
      filtered.sort(
        (a, b) => (b.language === 'Python' ? 1 : 0) - (a.language === 'Python' ? 1 : 0)
      );
    }

    if (level === 'iniciante' || level === 'transicao') {
      filtered.sort((a, b) => (a.difficulty === 'iniciante' ? -1 : 1));
    } else if (level === 'pleno') {
      filtered.sort((a, b) =>
        a.difficulty === 'avancado' || a.difficulty === 'intermediario' ? -1 : 1
      );
    }

    const levelLabel =
      level === 'iniciante'
        ? 'Iniciante'
        : level === 'junior'
        ? 'Júnior'
        : level === 'pleno'
        ? 'Pleno / Sênior'
        : 'Transição de Carreira';

    const focusLabel =
      focus === 'negocios' ? 'Negócios' : focus === 'carreira' ? 'Carreira' : 'Estudos';

    const stackLabel =
      stack === 'typescript'
        ? 'TypeScript / JS'
        : stack === 'python'
        ? 'Python'
        : 'Multi-Stack';

    const summary = `Seleção personalizada para perfil ${levelLabel} · Foco em ${focusLabel} · ${stackLabel}`;

    onApplyMatches(filtered.slice(0, 6), summary);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/35 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="matcher-title"
    >
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
              Recomendação Direcionada
            </p>
            <h2
              id="matcher-title"
              className="font-display text-xl font-semibold text-zinc-950 dark:text-white"
            >
              Encontre os projetos ideais para você
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Escolha seu momento atual e objetivo para filtrarmos as melhores opções.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 sm:px-7 py-6 space-y-6">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2.5">
              01. Qual é o seu momento técnico atual?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'iniciante', label: 'Primeiro PR / Iniciante', desc: 'Issues acolhedoras e fluxo Git' },
                { id: 'junior', label: 'Desenvolvedor Júnior', desc: 'Código real para o portfólio' },
                { id: 'pleno', label: 'Pleno / Sênior', desc: 'Arquitetura e escala' },
                { id: 'transicao', label: 'Transição de Carreira', desc: 'Migrando para tecnologia' },
              ].map((opt) => {
                const active = level === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setLevel(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-150 ${
                      active
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-500'
                        : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <span className="block text-sm font-semibold text-zinc-900 dark:text-white">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2.5">
              02. Qual eixo é prioridade nas próximas semanas?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'negocios', label: 'Negócios', desc: 'SaaS, ERP e CRM' },
                { id: 'carreira', label: 'Carreira', desc: 'Emprego e ATS' },
                { id: 'estudos', label: 'Estudos', desc: 'CS e Algoritmos' },
              ].map((opt) => {
                const active = focus === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFocus(opt.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-150 ${
                      active
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-500'
                        : 'border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                    }`}
                  >
                    <span className="block text-sm font-semibold text-zinc-900 dark:text-white">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3 */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2.5">
              03. Qual stack você prefere?
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'typescript', label: 'TypeScript / JS' },
                { id: 'python', label: 'Python' },
                { id: 'multistack', label: 'Multi-Stack' },
              ].map((opt) => {
                const active = stack === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStack(opt.id)}
                    className={`px-3 py-2.5 rounded-xl border text-center text-xs sm:text-sm transition-all duration-150 ${
                      active
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-500/10 dark:border-blue-500 font-semibold text-blue-700 dark:text-blue-300'
                        : 'border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 font-medium'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-7 py-4 bg-zinc-50/70 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleMatch}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>Ver Projetos Recomendados</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
