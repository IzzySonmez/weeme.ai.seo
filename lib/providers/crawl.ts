import { JSDOM } from 'jsdom';

export interface CrawlResult {
  title: string;
  metaDescription: string;
  h1Tags: string[];
  robots: string;
  canonical: string;
  hreflang: Array<{ lang: string; href: string }>;
  schemaTypes: string[];
  internalLinks: number;
  externalLinks: number;
  images: number;
  loadTime: number;
}

export async function crawlPage(url: string): Promise<CrawlResult | null> {
  try {
    const startTime = Date.now();
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 'WeemeAI-SEOCrawler/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const loadTime = Date.now() - startTime;
    
    return parseHtml(html, url, loadTime);
  } catch (error) {
    console.error(`Crawl error for ${url}:`, error);
    return null;
  }
}

function parseHtml(html: string, url: string, loadTime: number): CrawlResult {
  const dom = new JSDOM(html, { url });
  const document = dom.window.document;
  
  // Extract title
  const titleElement = document.querySelector('title');
  const title = titleElement ? titleElement.textContent?.trim() || '' : '';
  
  // Extract meta description
  const metaDescElement = document.querySelector('meta[name="description"]');
  const metaDescription = metaDescElement ? metaDescElement.getAttribute('content') || '' : '';
  
  // Extract H1 tags
  const h1Elements = document.querySelectorAll('h1');
  const h1Tags = Array.from(h1Elements).map(h1 => h1.textContent?.trim() || '').filter(Boolean);
  
  // Extract robots meta
  const robotsElement = document.querySelector('meta[name="robots"]');
  const robots = robotsElement ? robotsElement.getAttribute('content') || '' : '';
  
  // Extract canonical
  const canonicalElement = document.querySelector('link[rel="canonical"]');
  const canonical = canonicalElement ? canonicalElement.getAttribute('href') || '' : '';
  
  // Extract hreflang
  const hreflangElements = document.querySelectorAll('link[rel="alternate"][hreflang]');
  const hreflang = Array.from(hreflangElements).map(el => ({
    lang: el.getAttribute('hreflang') || '',
    href: el.getAttribute('href') || ''
  }));
  
  // Extract schema.org types
  const schemaElements = document.querySelectorAll('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  
  schemaElements.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || '');
      if (data['@type']) {
        schemaTypes.push(data['@type']);
      } else if (data['@graph']) {
        data['@graph'].forEach((item: any) => {
          if (item['@type']) {
            schemaTypes.push(item['@type']);
          }
        });
      }
    } catch (e) {
      // Ignore parsing errors
    }
  });
  
  // Count links and images
  const domain = new URL(url).hostname;
  const allLinks = document.querySelectorAll('a[href]');
  let internalLinks = 0;
  let externalLinks = 0;
  
  allLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === domain) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    }
  });
  
  const images = document.querySelectorAll('img').length;
  
  return {
    title,
    metaDescription,
    h1Tags,
    robots,
    canonical,
    hreflang,
    schemaTypes: [...new Set(schemaTypes)], // Remove duplicates
    internalLinks,
    externalLinks,
    images,
    loadTime
  };
}

export async function getSitemap(url: string): Promise<string[]> {
  try {
    const domain = new URL(url).origin;
    const sitemapUrl = `${domain}/sitemap.xml`;
    
    const response = await fetch(sitemapUrl, {
      headers: {
        'User-Agent': process.env.USER_AGENT || 'WeemeAI-SEOCrawler/1.0'
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      return [];
    }
    
    const xml = await response.text();
    const dom = new JSDOM(xml, { contentType: 'text/xml' });
    const document = dom.window.document;
    
    const urlElements = document.querySelectorAll('url loc, sitemap loc');
    return Array.from(urlElements)
      .map(el => el.textContent?.trim())
      .filter(Boolean)
      .slice(0, 50); // Limit to first 50 URLs
    
  } catch (error) {
    console.error('Sitemap fetch error:', error);
    return [];
  }
}