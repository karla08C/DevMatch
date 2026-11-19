import { Repository } from '../data/repositories';

export type CategoryFilter = 'todas' | 'negocios' | 'carreira' | 'estudos';
export type DifficultyFilter = 'todas' | 'iniciante' | 'intermediario' | 'avancado';
export type LanguageFilter = 'todas' | 'TypeScript' | 'JavaScript' | 'Python' | 'Ruby' | 'Markdown';

export interface UserProfile {
  level: 'iniciante' | 'junior' | 'pleno' | 'transicao' | 'negocios';
  focus: 'negocios' | 'carreira' | 'estudos';
  stack: string;
}

export interface TrackedItem {
  repoId: string;
  repo: Repository;
  stage: 'planejando' | 'clonado' | 'pr_aberto' | 'concluido';
  notes?: string;
  addedAt: string;
}

export interface LiveGitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
  license?: {
    name: string;
    spdx_id: string;
  } | null;
  updated_at: string;
}
