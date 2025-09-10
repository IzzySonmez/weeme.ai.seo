export interface GSCSearchAnalytics {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCKeywordData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCResult {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  topKeywords: GSCKeywordData[];
  topPages: GSCPageData[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export async function getGSCData(
  domain: string, 
  accessToken: string,
  startDate: string = '2024-01-01',
  endDate: string = new Date().toISOString().split('T')[0]
): Promise<GSCResult | null> {
  try {
    const siteUrl = domain.startsWith('http') ? domain : `https://${domain}`;
    const encodedSiteUrl = encodeURIComponent(siteUrl);
    
    // Get search analytics data
    const analyticsResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['query'],
          rowLimit: 25000,
          startRow: 0
        })
      }
    );

    if (!analyticsResponse.ok) {
      throw new Error(`GSC API error: ${analyticsResponse.status}`);
    }

    const analyticsData = await analyticsResponse.json();
    
    // Get page performance data
    const pagesResponse = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ['page'],
          rowLimit: 1000,
          startRow: 0
        })
      }
    );

    const pagesData = pagesResponse.ok ? await pagesResponse.json() : { rows: [] };

    // Process the data
    const keywordRows = analyticsData.rows || [];
    const pageRows = pagesData.rows || [];

    const totalClicks = keywordRows.reduce((sum: number, row: any) => sum + row.clicks, 0);
    const totalImpressions = keywordRows.reduce((sum: number, row: any) => sum + row.impressions, 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averagePosition = keywordRows.length > 0 
      ? keywordRows.reduce((sum: number, row: any) => sum + row.position, 0) / keywordRows.length 
      : 0;

    const topKeywords: GSCKeywordData[] = keywordRows
      .slice(0, 50)
      .map((row: any) => ({
        query: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr * 100,
        position: row.position
      }));

    const topPages: GSCPageData[] = pageRows
      .slice(0, 20)
      .map((row: any) => ({
        page: row.keys[0],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr * 100,
        position: row.position
      }));

    return {
      totalClicks,
      totalImpressions,
      averageCTR,
      averagePosition,
      topKeywords,
      topPages,
      dateRange: {
        startDate,
        endDate
      }
    };

  } catch (error) {
    console.error('GSC API error:', error);
    return null;
  }
}

export async function getGSCSites(accessToken: string): Promise<string[]> {
  try {
    const response = await fetch(
      'https://www.googleapis.com/webmasters/v3/sites',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GSC Sites API error: ${response.status}`);
    }

    const data = await response.json();
    return data.siteEntry?.map((site: any) => site.siteUrl) || [];

  } catch (error) {
    console.error('GSC Sites API error:', error);
    return [];
  }
}

export function generateGoogleAuthUrl(): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    throw new Error('Google OAuth credentials not configured');
  }

  const scope = 'https://www.googleapis.com/auth/webmasters.readonly';
  const responseType = 'code';
  const accessType = 'offline';
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    response_type: responseType,
    access_type: accessType,
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
} | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
        code
      })
    });

    if (!response.ok) {
      throw new Error(`Token exchange error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Token exchange error:', error);
    return null;
  }
}