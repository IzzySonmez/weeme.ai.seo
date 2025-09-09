import { KeywordOpportunities, GrowthPlan, PlanItem } from '@/lib/types/report';

export function generateKeywordOpportunities(domain: string, serpData: any): KeywordOpportunities {
  const baseKeywords = extractKeywordsFromDomain(domain);
  const relatedKeywords = serpData?.related_searches?.map((rs: any) => rs.query) || [];
  
  const highIntentKeywords = [
    ...baseKeywords,
    ...relatedKeywords.slice(0, 5)
  ].slice(0, 10).map((keyword, index) => ({
    keyword,
    volume: estimateVolume(keyword),
    difficulty: estimateDifficulty(keyword),
    intent: determineIntent(keyword)
  }));
  
  const suggestedTitles = generateContentIdeas(highIntentKeywords);
  
  return {
    highIntentKeywords,
    suggestedTitles,
    serpFeatures: ['Featured Snippet', 'People Also Ask', 'Related Searches', 'Local Pack'],
    international: generateInternationalKeywords(domain)
  };
}

export function generateGrowthPlan(technicalIssues: string[], onPageIssues: string[], competitors: any[]): GrowthPlan {
  const thirtyDays: PlanItem[] = [
    {
      category: 'technical',
      task: 'Fix Core Web Vitals issues',
      impact: 'high',
      effort: 'medium'
    },
    {
      category: 'content',
      task: 'Optimize title tags and meta descriptions',
      impact: 'high',
      effort: 'low'
    },
    {
      category: 'technical',
      task: 'Implement structured data markup',
      impact: 'medium',
      effort: 'low'
    }
  ];
  
  const sixtyDays: PlanItem[] = [
    {
      category: 'content',
      task: 'Create 10 high-quality blog posts targeting long-tail keywords',
      impact: 'high',
      effort: 'high'
    },
    {
      category: 'technical',
      task: 'Improve site architecture and internal linking',
      impact: 'medium',
      effort: 'medium'
    },
    {
      category: 'authority',
      task: 'Launch digital PR campaign for backlink acquisition',
      impact: 'high',
      effort: 'high'
    }
  ];
  
  const ninetyDays: PlanItem[] = [
    {
      category: 'authority',
      task: 'Build partnerships with industry influencers',
      impact: 'high',
      effort: 'high'
    },
    {
      category: 'content',
      task: 'Develop comprehensive resource pages',
      impact: 'medium',
      effort: 'medium'
    },
    {
      category: 'technical',
      task: 'Implement advanced tracking and analytics',
      impact: 'medium',
      effort: 'low'
    }
  ];
  
  const kpis = [
    {
      name: 'Core Web Vitals Pass Rate',
      current: '45%',
      target: '90%',
      metric: 'percentage'
    },
    {
      name: 'Indexed Pages',
      current: '150',
      target: '500',
      metric: 'count'
    },
    {
      name: 'Keywords in Top 3',
      current: '12',
      target: '50',
      metric: 'count'
    },
    {
      name: 'Domain Authority',
      current: '35',
      target: '50',
      metric: 'score'
    }
  ];
  
  return {
    thirtyDays,
    sixtyDays,
    ninetyDays,
    kpis
  };
}

function extractKeywordsFromDomain(domain: string): string[] {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  const parts = cleanDomain.split('.')[0].split(/[-_]/);
  
  return parts.filter(part => part.length > 2).map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );
}

function estimateVolume(keyword: string): number {
  // Simple estimation based on keyword characteristics
  const baseVolume = keyword.length < 10 ? 5000 : 
                    keyword.length < 20 ? 2000 : 
                    1000;
  
  const modifiers = ['how to', 'what is', 'best', 'top', 'guide'];
  const hasModifier = modifiers.some(mod => keyword.toLowerCase().includes(mod));
  
  return Math.floor(baseVolume * (hasModifier ? 1.5 : 1) * (Math.random() * 0.5 + 0.75));
}

function estimateDifficulty(keyword: string): number {
  // Simple estimation - shorter keywords tend to be more competitive
  const baseDifficulty = keyword.length < 10 ? 80 : 
                        keyword.length < 20 ? 60 : 
                        40;
  
  return Math.max(1, Math.min(100, baseDifficulty + Math.floor(Math.random() * 20) - 10));
}

function determineIntent(keyword: string): string {
  const commercialTerms = ['buy', 'purchase', 'price', 'cost', 'cheap', 'discount', 'deal'];
  const informationalTerms = ['how to', 'what is', 'why', 'when', 'guide', 'tutorial'];
  const navigationalTerms = ['login', 'sign in', 'official', 'website'];
  
  const lowerKeyword = keyword.toLowerCase();
  
  if (commercialTerms.some(term => lowerKeyword.includes(term))) {
    return 'Commercial';
  } else if (informationalTerms.some(term => lowerKeyword.includes(term))) {
    return 'Informational';
  } else if (navigationalTerms.some(term => lowerKeyword.includes(term))) {
    return 'Navigational';
  } else {
    return 'Mixed';
  }
}

function generateContentIdeas(keywords: any[]): Array<{ title: string; outline: string[]; targetKeywords: string[] }> {
  return keywords.slice(0, 5).map(kw => ({
    title: `The Complete Guide to ${kw.keyword}`,
    outline: [
      `What is ${kw.keyword}?`,
      `Why ${kw.keyword} matters in 2024`,
      `Best practices for ${kw.keyword}`,
      `Common ${kw.keyword} mistakes to avoid`,
      `${kw.keyword} tools and resources`,
      `Future of ${kw.keyword}`
    ],
    targetKeywords: [kw.keyword, `${kw.keyword} guide`, `${kw.keyword} tips`, `best ${kw.keyword}`]
  }));
}

function generateInternationalKeywords(domain: string): Array<{ country: string; keywords: string[] }> {
  const baseKeywords = extractKeywordsFromDomain(domain);
  
  return [
    {
      country: 'United Kingdom',
      keywords: baseKeywords.map(kw => `${kw} UK`)
    },
    {
      country: 'Canada',
      keywords: baseKeywords.map(kw => `${kw} Canada`)
    },
    {
      country: 'Australia',
      keywords: baseKeywords.map(kw => `${kw} Australia`)
    }
  ];
}