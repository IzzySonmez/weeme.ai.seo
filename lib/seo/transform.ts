import { Report, TechnicalSEO, OnPageSEO, SERPAnalysis, KeywordOpportunities, GrowthPlan } from '@/lib/types/report';
import { PageSpeedResult, parseCoreWebVitals } from '@/lib/providers/pagespeed';
import { SerpResult } from '@/lib/providers/serp';
import { CrawlResult } from '@/lib/providers/crawl';

export function transformTechnicalSEO(
  pageSpeedMobile: PageSpeedResult | null,
  pageSpeedDesktop: PageSpeedResult | null
): TechnicalSEO {
  const mobileData = pageSpeedMobile ? parseCoreWebVitals(pageSpeedMobile) : null;
  const desktopData = pageSpeedDesktop ? parseCoreWebVitals(pageSpeedDesktop) : null;
  
  const lighthouseScore = pageSpeedMobile?.lighthouseResult?.categories?.performance?.score || 0;
  
  // Use mobile data as primary, fallback to desktop
  const cwv = mobileData || desktopData || {
    lcp: { value: 3000, rating: 'needs-improvement' as const },
    fid: { value: 150, rating: 'needs-improvement' as const },
    cls: { value: 0.15, rating: 'needs-improvement' as const }
  };
  
  const speedRating: 'fast' | 'medium' | 'slow' = 
    lighthouseScore >= 0.9 ? 'fast' : 
    lighthouseScore >= 0.5 ? 'medium' : 'slow';
  
  const actionItems = generateTechnicalActionItems(cwv, lighthouseScore);
  
  return {
    coreWebVitals: cwv,
    lighthouseScore: Math.round(lighthouseScore * 100),
    speedRating,
    actionItems
  };
}

export function transformOnPageSEO(crawlData: CrawlResult | null): OnPageSEO {
  if (!crawlData) {
    return {
      title: { content: '', length: 0, issues: ['Unable to analyze - page not accessible'] },
      metaDescription: { content: '', length: 0, issues: ['Unable to analyze - page not accessible'] },
      h1: { content: '', count: 0, issues: ['Unable to analyze - page not accessible'] },
      robots: 'Unknown',
      canonical: 'Unknown',
      schemaTypes: [],
      hreflangAudit: { issues: ['Unable to analyze - page not accessible'], implemented: false },
      quickWins: []
    };
  }
  
  const titleIssues = analyzeTitleTag(crawlData.title);
  const metaIssues = analyzeMetaDescription(crawlData.metaDescription);
  const h1Issues = analyzeH1Tags(crawlData.h1Tags);
  const hreflangIssues = analyzeHreflang(crawlData.hreflang);
  
  const quickWins = generateQuickWins(titleIssues, metaIssues, h1Issues, crawlData);
  
  return {
    title: {
      content: crawlData.title,
      length: crawlData.title.length,
      issues: titleIssues
    },
    metaDescription: {
      content: crawlData.metaDescription,
      length: crawlData.metaDescription.length,
      issues: metaIssues
    },
    h1: {
      content: crawlData.h1Tags[0] || '',
      count: crawlData.h1Tags.length,
      issues: h1Issues
    },
    robots: crawlData.robots || 'index, follow',
    canonical: crawlData.canonical || 'Not specified',
    schemaTypes: crawlData.schemaTypes,
    hreflangAudit: {
      issues: hreflangIssues,
      implemented: crawlData.hreflang.length > 0
    },
    quickWins
  };
}

export function transformSERPAnalysis(serpData: SerpResult | null, domain: string): SERPAnalysis {
  if (!serpData || !serpData.organic_results) {
    return {
      topResults: [],
      featuredSnippets: [],
      peopleAlsoAsk: [],
      competitors: [],
      relatedSearches: []
    };
  }
  
  const topResults = serpData.organic_results.slice(0, 10).map(result => ({
    position: result.position,
    title: result.title,
    url: result.link,
    snippet: result.snippet,
    domain: result.displayed_link
  }));
  
  const featuredSnippets = serpData.answer_box ? [serpData.answer_box.snippet] : [];
  const peopleAlsoAsk = serpData.people_also_ask?.map(paa => paa.question) || [];
  const relatedSearches = serpData.related_searches?.map(rs => rs.query) || [];
  
  const competitors = identifyCompetitors(topResults, domain);
  
  return {
    topResults,
    featuredSnippets,
    peopleAlsoAsk,
    competitors,
    relatedSearches
  };
}

function analyzeTitleTag(title: string): string[] {
  const issues: string[] = [];
  
  if (!title) {
    issues.push('Missing title tag');
  } else {
    if (title.length < 30) issues.push('Title too short (< 30 characters)');
    if (title.length > 60) issues.push('Title too long (> 60 characters)');
    if (!/[A-Z]/.test(title)) issues.push('Consider capitalizing important words');
  }
  
  return issues;
}

function analyzeMetaDescription(description: string): string[] {
  const issues: string[] = [];
  
  if (!description) {
    issues.push('Missing meta description');
  } else {
    if (description.length < 120) issues.push('Meta description too short (< 120 characters)');
    if (description.length > 160) issues.push('Meta description too long (> 160 characters)');
  }
  
  return issues;
}

function analyzeH1Tags(h1Tags: string[]): string[] {
  const issues: string[] = [];
  
  if (h1Tags.length === 0) {
    issues.push('Missing H1 tag');
  } else if (h1Tags.length > 1) {
    issues.push(`Multiple H1 tags found (${h1Tags.length})`);
  }
  
  return issues;
}

function analyzeHreflang(hreflang: Array<{ lang: string; href: string }>): string[] {
  const issues: string[] = [];
  
  if (hreflang.length === 0) {
    issues.push('No hreflang implementation found');
  } else {
    // Check for self-referencing hreflang
    const hasSelfRef = hreflang.some(hl => hl.lang === 'x-default');
    if (!hasSelfRef) {
      issues.push('Missing x-default hreflang');
    }
  }
  
  return issues;
}

function generateTechnicalActionItems(cwv: any, lighthouseScore: number): string[] {
  const items: string[] = [];
  
  if (cwv.lcp.rating !== 'good') {
    items.push('Optimize Largest Contentful Paint - compress images and improve server response time');
  }
  
  if (cwv.fid.rating !== 'good') {
    items.push('Reduce First Input Delay - minimize JavaScript execution time');
  }
  
  if (cwv.cls.rating !== 'good') {
    items.push('Fix Cumulative Layout Shift - add size attributes to images and ads');
  }
  
  if (lighthouseScore < 0.7) {
    items.push('Enable text compression (gzip/brotli)');
    items.push('Eliminate render-blocking resources');
    items.push('Properly size images');
  }
  
  return items;
}

function generateQuickWins(titleIssues: string[], metaIssues: string[], h1Issues: string[], crawlData: CrawlResult): string[] {
  const wins: string[] = [];
  
  if (titleIssues.length > 0) {
    wins.push('Optimize title tag length and keywords');
  }
  
  if (metaIssues.length > 0) {
    wins.push('Write compelling meta descriptions');
  }
  
  if (h1Issues.length > 0) {
    wins.push('Fix H1 tag structure and content');
  }
  
  if (!crawlData.canonical) {
    wins.push('Add canonical URLs to prevent duplicate content');
  }
  
  if (crawlData.schemaTypes.length === 0) {
    wins.push('Implement structured data markup');
  }
  
  return wins;
}

function identifyCompetitors(results: any[], targetDomain: string): Array<{ domain: string; strengths: string[]; rank: number }> {
  const cleanTargetDomain = targetDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  
  return results
    .filter(result => !result.domain.includes(cleanTargetDomain))
    .slice(0, 3)
    .map(result => ({
      domain: result.domain,
      strengths: [
        `Ranking #${result.position} for target keyword`,
        'Strong domain authority',
        'Optimized content structure'
      ],
      rank: result.position
    }));
}