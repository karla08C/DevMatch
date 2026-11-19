import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Trash2, Bookmark } from 'lucide-react';
import { TrackedItem } from '../types';
import { CONTRIBUTION_STAGES } from '../data/repositories';

interface TrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trackedItems: TrackedItem[];
  onUpdateStage: (repoId: string, stage: TrackedItem['stage']) => void;
  onUpdateNotes: (repoId: string, notes: string) => void;
  onRemoveItem: (repoId: string) => void;
  onOpenDetails: (item: TrackedItem) => void;
}

export const TrackerDrawer: React.FC<TrackerDrawerProps> = ({
  isOpen,
  onClose,
  trackedItems,
  onUpdateStage,
  onUpdateNotes,
  onRemoveItem,
  onOpenDetails,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const generateMarkdownReport = () => {
    let md = `# Meu Plano de Contribuições Open Source\n\n`;
    md += `*Gerado em ${new Date().toLocaleDateString('pt-BR')} pelo GitHub Contrib Hub*\n\n`;

    CONTRIBUTION_STAGES.forEach((stage) => {
      const itemsInStage = trackedItems.filter((i) => i.stage === stage.id);
      md += `## ${stage.name.replace(' 🎉', '')} (${itemsInStage.length})\n\n`;
      if (itemsInStage.length === 0) {
        md += `_Nenhum projeto nesta etapa._\n\n`;
      } else {
        itemsInStage.forEach((item) => {
          md += `### [${item.repo.fullName}](${item.repo.githubUrl})\n`;
          md += `- **Eixo:** ${item.repo.category} · ${item.repo.subCategory}\n`;
          md += `- **Linguagem:** ${item.repo.language} · Stars: ${item.repo.stars.toLocaleString('pt-BR')}\n`;
          md += `- **Descrição:** ${item.repo.description}\n`;
          md += `- **Good First Issues:** [Abrir no GitHub](${item.repo.goodFirstIssuesUrl})\n`;
          if (item.notes?.trim()) {
            md += `- **Anotações:** ${item.notes.trim()}\n`;
          }
          md += `\n`;
        });
      }
    });

    return md;
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const downloadMarkdown = () => {
    const md = generateMarkdownReport();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `meu-plano-contribuicoes-${new Date().toISOString().slice(0, 10)}.md`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedCount = trackedItems.filter((i) => i.stage === 'concluido').length;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/35 backdrop-blur-xs flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
    >
      <div
        className="bg-white dark:bg-zinc-900 border-l border-zinc-200/80 dark:border-zinc-800 w-full max-w-xl h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 sm:px-7 pt-6 pb-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
              Roadmap Pessoal
            </p>
            <h2
              id="tracker-title"
              className="font-display text-xl font-semibold text-zinc-950 dark:text-white"
            >
              Meu Plano de Contribuições
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              <span className="font-mono tabular-nums font-medium text-zinc-800 dark:text-zinc-200">
                {trackedItems.length} {trackedItems.length === 1 ? 'repositório' : 'repositórios'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {completedCount} {completedCount === 1 ? 'concluído' : 'concluídos'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar meu plano"
            className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Bar */}
        {trackedItems.length > 0 && (
          <div className="px-6 sm:px-7 py-3 bg-zinc-50/70 dark:bg-zinc-900/70 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">
              Exportar para Notion ou GitHub
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdown}
                className="px-3 py-1.5 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white rounded-lg border border-zinc-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-800 inline-flex items-center gap-1.5 font-medium transition-colors"
              >
                {copiedMd ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Markdown</span>
                  </>
                )}
              </button>
              <button
                onClick={downloadMarkdown}
                className="px-3 py-1.5 text-zinc-700 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white rounded-lg border border-zinc-200/90 dark:border-zinc-700 bg-white dark:bg-zinc-800 inline-flex items-center gap-1.5 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Baixar .md</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Stages */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-7 py-6 space-y-7">
          {trackedItems.length === 0 ? (
            <div className="py-16 text-center">
              <Bookmark className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
              <p className="font-display text-base font-semibold text-zinc-900 dark:text-white">
                Seu plano ainda está vazio
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Salve repositórios na Curadoria ou na Varredura ao Vivo para acompanhar suas pull requests por etapa.
              </p>
            </div>
          ) : (
            CONTRIBUTION_STAGES.map((stage) => {
              const stageItems = trackedItems.filter((i) => i.stage === stage.id);
              const cleanStageName = stage.name.replace(' 🎉', '');

              return (
                <div key={stage.id} className="space-y-3">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {cleanStageName}
                    </span>
                    <span className="font-mono text-zinc-400 tabular-nums">
                      {stageItems.length}
                    </span>
                  </div>

                  {stageItems.length === 0 ? (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 py-1">
                      Nenhum repositório nesta etapa.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {stageItems.map((item) => (
                        <div
                          key={item.repoId}
                          className="p-4 bg-zinc-50/70 dark:bg-zinc-950/50 border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <button
                                onClick={() => onOpenDetails(item)}
                                className="font-display text-sm font-semibold text-zinc-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left truncate block max-w-full"
                              >
                                {item.repo.fullName}
                              </button>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {item.repo.language} · {item.repo.subCategory}
                              </p>
                            </div>

                            <button
                              onClick={() => onRemoveItem(item.repoId)}
                              aria-label={`Remover ${item.repo.name}`}
                              className="text-zinc-400 hover:text-rose-600 transition-colors p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Inline editable note */}
                          <input
                            type="text"
                            value={item.notes || ''}
                            onChange={(e) => onUpdateNotes(item.repoId, e.target.value)}
                            placeholder="Adicionar nota ou nº da issue (ex: Issue #412 - tradução pt-BR)..."
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
                          />

                          {/* Interactive Stage Buttons */}
                          <div className="flex items-center gap-1 flex-wrap pt-1">
                            {CONTRIBUTION_STAGES.map((s) => {
                              const isCurrent = item.stage === s.id;
                              return (
                                <button
                                  key={s.id}
                                  onClick={() =>
                                    onUpdateStage(item.repoId, s.id as TrackedItem['stage'])
                                  }
                                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap ${
                                    isCurrent
                                      ? 'bg-blue-600 text-white font-semibold'
                                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700 hover:border-zinc-300'
                                  }`}
                                >
                                  {s.badgeLabel}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-7 py-4 bg-zinc-50/70 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
