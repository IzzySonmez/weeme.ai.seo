export interface Report {
  id: string;
  domain: string;
  keyword?: string;
  timestamp: string;
  overview: DomainOverview;
  technical: TechnicalSEO;
  onPage: OnPageSEO;
  serp: SERPAnalysis;
  keywords: KeywordOpportunities;
  growthPlan: GrowthPlan;
}

export interface DomainOverview {
  domainRank: number | null;
  indexedPages: number | null;
  organicKeywords: number | null;
  internationalization: {
    hreflang: string[];
    domains: string[];
    currencies: string[];
  };
}

export interface TechnicalSEO {
  coreWebVitals: {
    lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor' };
  };
  lighthouseScore: number;
  speedRating: 'fast' | 'medium' | 'slow';
  actionItems: string[];
}

export interface OnPageSEO {
  title: { content: string; length: number; issues: string[] };
  metaDescription: { content: string; length: number; issues: string[] };
  h1: { content: string; count: number; issues: string[] };
  robots: string;
  canonical: string;
  schemaTypes: string[];
  hreflangAudit: { issues: string[]; implemented: boolean };
  quickWins: string[];
}

export interface SERPAnalysis {
  topResults: {
    position: number;
    title: string;
    url: string;
    snippet: string;
    domain: string;
  }[];
  featuredSnippets: string[];
  peopleAlsoAsk: string[];
  competitors: {
    domain: string;
    strengths: string[];
    rank: number;
  }[];
  relatedSearches: string[];
}

export interface KeywordOpportunities {
  highIntentKeywords: {
    keyword: string;
    volume: number | null;
    difficulty: number | null;
    intent: string;
  }[];
  suggestedTitles: {
    title: string;
    outline: string[];
    targetKeywords: string[];
  }[];
  serpFeatures: string[];
  international: {
    country: string;
    keywords: string[];
  }[];
}

export interface GrowthPlan {
  thirtyDays: PlanItem[];
  sixtyDays: PlanItem[];
  ninetyDays: PlanItem[];
  kpis: {
    name: string;
    current: string;
    target: string;
    metric: string;
  }[];
}

export interface PlanItem {
  category: 'technical' | 'content' | 'authority';
  task: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
}

export interface ReportProgress {
  step: 1 | 2 | 3 | 4;
  message: string;
  completed: boolean;
}