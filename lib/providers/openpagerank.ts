export interface PageRankResult {
  response: Array<{
    domain: string;
    page_rank_integer: number;
    page_rank_decimal: number;
  }>;
}

export async function getDomainRank(domain: string): Promise<number | null> {
  const apiKey = process.env.OPENPAGERANK_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenPageRank API key not found, returning estimated rank');
    return estimateDomainRank(domain);
  }

  try {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
    
    const response = await fetch(`https://openpagerank.com/api/v1.0/getPageRank?domains[]=${cleanDomain}`, {
      headers: {
        'API-OPR': apiKey,
        'User-Agent': process.env.USER_AGENT || 'WeemeAI-SEOCrawler/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`OpenPageRank API error: ${response.status}`);
    }

    const data: PageRankResult = await response.json();
    
    if (data.response && data.response.length > 0) {
      return data.response[0].page_rank_integer;
    }
    
    return null;
  } catch (error) {
    console.error('OpenPageRank API error:', error);
    return estimateDomainRank(domain);
  }
}

function estimateDomainRank(domain: string): number {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').split('/')[0];
  
  // Simple heuristic based on domain patterns
  const wellKnownDomains = [
    'google.com', 'youtube.com', 'facebook.com', 'amazon.com', 'wikipedia.org',
    'twitter.com', 'instagram.com', 'linkedin.com', 'netflix.com', 'reddit.com'
  ];
  
  if (wellKnownDomains.some(known => cleanDomain.includes(known))) {
    return Math.floor(Math.random() * 10) + 90; // 90-100
  }
  
  const tldBonus = cleanDomain.endsWith('.com') ? 10 : 
                   cleanDomain.endsWith('.org') ? 8 : 
                   cleanDomain.endsWith('.net') ? 6 : 0;
  
  const lengthPenalty = Math.max(0, cleanDomain.length - 15) * 2;
  
  return Math.max(1, Math.min(100, 50 + tldBonus - lengthPenalty + Math.floor(Math.random() * 20)));
}