export interface PageSpeedResult {
  lighthouseResult: {
    categories: {
      performance: { score: number };
    };
    audits: {
      'largest-contentful-paint': { displayValue: string; numericValue: number };
      'first-input-delay': { displayValue: string; numericValue: number };
      'cumulative-layout-shift': { displayValue: string; numericValue: number };
    };
  };
  loadingExperience?: {
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS: { category: string; percentile: number };
      FIRST_INPUT_DELAY_MS: { category: string; percentile: number };
      CUMULATIVE_LAYOUT_SHIFT_SCORE: { category: string; percentile: number };
    };
  };
}

export async function getPageSpeedInsights(url: string, strategy: 'mobile' | 'desktop' = 'mobile'): Promise<PageSpeedResult | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.warn('Google API key not found, skipping PageSpeed Insights');
    return null;
  }

  try {
    const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`;
    const params = new URLSearchParams({
      url: url,
      key: apiKey,
      strategy: strategy,
      category: 'PERFORMANCE'
    });

    const response = await fetch(`${endpoint}?${params}`, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 'WeemeAI-SEOCrawler/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PageSpeed Insights error:', error);
    return null;
  }
}

export function parseCoreWebVitals(result: PageSpeedResult) {
  const audits = result.lighthouseResult.audits;
  const fieldData = result.loadingExperience?.metrics;

  const getRating = (value: number, thresholds: [number, number]): 'good' | 'needs-improvement' | 'poor' => {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  };

  return {
    lcp: {
      value: fieldData?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || audits['largest-contentful-paint'].numericValue,
      rating: getRating(
        fieldData?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || audits['largest-contentful-paint'].numericValue,
        [2500, 4000]
      )
    },
    fid: {
      value: fieldData?.FIRST_INPUT_DELAY_MS?.percentile || audits['first-input-delay']?.numericValue || 0,
      rating: getRating(
        fieldData?.FIRST_INPUT_DELAY_MS?.percentile || audits['first-input-delay']?.numericValue || 0,
        [100, 300]
      )
    },
    cls: {
      value: fieldData?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || audits['cumulative-layout-shift'].numericValue,
      rating: getRating(
        fieldData?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || audits['cumulative-layout-shift'].numericValue,
        [0.1, 0.25]
      )
    }
  };
}