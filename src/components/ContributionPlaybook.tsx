import React, { useState } from 'react';
import { Copy, Check, GitPullRequest, GitCommit } from 'lucide-react';

export const ContributionPlaybook: React.FC = () => {
  const [commitType, setCommitType] = useState('fix');
  const [scope, setScope] = useState('');
  const [message, setMessage] = useState('corrige cálculo de faturamento quando cupom é aplicado');
  const [issueNumber, setIssueNumber] = useState('1042');
  const [copiedKey, setCopiedKey] = useState<'commit' | 'pr' | 'resume' | null>(null);

  const formattedCommit = `git commit -m "${commitType}${scope ? `(${scope})` : ''}: ${message}${
    issueNumber ? ` (#${issueNumber})` : ''
  }"`;

  const prTemplate = `## Descrição das Alterações
${message}.

## Motivação e Contexto
Resolve a issue #${issueNumber || '000'}. Garante integridade dos dados e melhora a experiência de uso.

## Como foi testado
- [x] Testes unitários executados localmente
- [x] Fluxo validado manualmente no navegador
- [x] Linter e formatação verificados

## Checklist
- [x] Diretrizes do CONTRIBUTING.md seguidas
- [x] Sem breaking changes
- [x] Documentação atualizada (quando aplicável)`;

  const resumeSnippet = `Colaborador Open Source — Medusa.js (Headless E-commerce)
- Refatorei a validação de cupons promocionais em TypeScript/Node.js, reduzindo chamadas redundantes a APIs externas.
- Adicionei testes unitários cobrindo cenários de borda em pagamentos transacionais; Pull Request aprovado e integrado à release oficial.`;

  const handleCopy = (text: string, key: 'commit' | 'pr' | 'resume') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Light Editorial Header */}
      <div className="pb-6 border-b border-zinc-200/70 dark:border-zinc-800/80">
        <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
          Playbook Prático · Boas Práticas no GitHub
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-950 dark:text-white tracking-tight text-balance">
          Como ter sua primeira Pull Request aprovada com agilidade
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Mantenedores analisam dezenas de contribuições por semana. Seguir um fluxo limpo de Git, testes e comunicação objetiva destaca seu trabalho imediatamente.
        </p>
      </div>

      {/* 4 Editorial Steps */}
      <section className="space-y-5">
        <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">
          O Fluxo em Quatro Etapas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
            <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-white mb-2">
              01. Escolha a issue e sinalize interesse
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Filtre por{' '}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                good first issue
              </code>{' '}
              ou{' '}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                documentation
              </code>
              . Comente de forma objetiva pedindo atribuição antes de abrir código para evitar retrabalho.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
            <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-white mb-2">
              02. Faça Fork e configure o Upstream
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Clone o seu fork localmente e conecte o repositório original para manter sua base sempre sincronizada:
            </p>
            <div className="mt-3 px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono rounded-lg overflow-x-auto">
              git remote add upstream https://github.com/org/repo.git
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
            <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-white mb-2">
              03. Crie uma branch semântica
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Evite alterar a branch principal diretamente. Use um nome descritivo que referencie a tarefa:
            </p>
            <div className="mt-3 px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-mono rounded-lg overflow-x-auto">
              git checkout -b fix/issue-1042-discount
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl">
            <h3 className="font-display text-base font-semibold text-zinc-950 dark:text-white mb-2">
              04. Valide testes e linter antes do push
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Execute{' '}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                npm test
              </code>{' '}
              e{' '}
              <code className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                npm run lint
              </code>{' '}
              localmente. Pull Requests com pipeline verde recebem revisão muito mais rápido.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Commit & PR Studio */}
      <section className="bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-zinc-950 dark:text-white">
            Gerador de Commit Semântico e Template de PR
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Personalize os campos abaixo para montar o comando Git e a descrição estruturada da sua Pull Request.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Tipo (Conventional)
            </label>
            <select
              value={commitType}
              onChange={(e) => setCommitType(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="fix">fix (Correção)</option>
              <option value="feat">feat (Funcionalidade)</option>
              <option value="docs">docs (Documentação)</option>
              <option value="refactor">refactor (Refatoração)</option>
              <option value="test">test (Testes)</option>
              <option value="style">style (Estilo)</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Escopo
            </label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="checkout"
              className="w-full text-sm px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nº da Issue
            </label>
            <input
              type="text"
              value={issueNumber}
              onChange={(e) => setIssueNumber(e.target.value)}
              placeholder="1042"
              className="w-full text-sm font-mono px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-5">
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Resumo da alteração
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-sm px-3 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-5 pt-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-zinc-400" />
                Comando Git pronto
              </span>
              <button
                onClick={() => handleCopy(formattedCommit, 'commit')}
                className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 inline-flex items-center gap-1.5 font-medium transition-colors"
              >
                {copiedKey === 'commit' ? (
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
              {formattedCommit}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-1.5">
                <GitPullRequest className="w-3.5 h-3.5 text-zinc-400" />
                Template de descrição da Pull Request
              </span>
              <button
                onClick={() => handleCopy(prTemplate, 'pr')}
                className="text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 inline-flex items-center gap-1.5 font-medium transition-colors"
              >
                {copiedKey === 'pr' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar template</span>
                  </>
                )}
              </button>
            </div>
            <pre className="px-4 py-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs rounded-xl whitespace-pre-wrap overflow-x-auto leading-relaxed">
              {prTemplate}
            </pre>
          </div>
        </div>
      </section>

      {/* Storytelling for Resume & LinkedIn */}
      <section className="bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-lg font-semibold text-zinc-950 dark:text-white">
              Como destacar contribuições no Currículo e LinkedIn
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Conecte o código entregue ao impacto de negócio e à qualidade de engenharia.
            </p>
          </div>

          <button
            onClick={() => handleCopy(resumeSnippet, 'resume')}
            className="text-xs font-medium text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
          >
            {copiedKey === 'resume' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Modelo copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar modelo</span>
              </>
            )}
          </button>
        </div>

        <div className="p-5 bg-zinc-50 dark:bg-zinc-950/70 rounded-xl text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
          {resumeSnippet}
        </div>
      </section>
    </div>
  );
};
