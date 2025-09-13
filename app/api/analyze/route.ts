import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import * as cheerio from 'cheerio'

const requestSchema = z.object({
  url: z.string().url(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = requestSchema.parse(body)

    // Get PageSpeed Insights data
    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&key=${process.env.GOOGLE_API_KEY}`
    
    const pageSpeedResponse = await fetch(pageSpeedUrl)
    
    if (!pageSpeedResponse.headers.get('content-type')?.includes('application/json')) {
      throw new Error('PageSpeed Insights API returned non-JSON response')
    }

    const pageSpeedData = await pageSpeedResponse.json()

    if (!pageSpeedResponse.ok) {
      throw new Error(pageSpeedData.error?.message || 'PageSpeed Insights API error')
    }

    // Fetch HTML content
    const htmlResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; weeme.ai-bot/1.0)',
      },
    })
    const html = await htmlResponse.text()
    const $ = cheerio.load(html)

    // Extract meta information
    const title = $('title').text().trim()
    const description = $('meta[name="description"]').attr('content') || ''
    const h1 = $('h1').first().text().trim()

    // Check robots.txt and sitemap.xml
    const baseUrl = new URL(url).origin
    
    const robotsResponse = await fetch(`${baseUrl}/robots.txt`)
    const robotsTxt = robotsResponse.status === 200

    const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`)
    const sitemapXml = sitemapResponse.status === 200

    // Extract scores and audits
    const lighthouse = pageSpeedData.lighthouseResult
    const categories = lighthouse.categories
    const audits = lighthouse.audits

    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      best_practices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    }

    const auditData: any = {}
    if (audits['largest-contentful-paint']) {
      auditData.lcp = audits['largest-contentful-paint'].numericValue
    }
    if (audits['cumulative-layout-shift']) {
      auditData.cls = audits['cumulative-layout-shift'].numericValue
    }
    if (audits['total-blocking-time']) {
      auditData.tbt = audits['total-blocking-time'].numericValue
    }

    const payload = {
      url,
      scores,
      audits: auditData,
      meta: {
        title,
        description,
        h1,
      },
      discoverability: {
        robotsTxt,
        sitemapXml,
      },
    }

    // Get AI insights
    const insightsResponse = await fetch(`${request.nextUrl.origin}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ payload }),
    })

    const insights = await insightsResponse.json()

    return NextResponse.json({
      data: payload,
      suggestions: insights.suggestions,
    })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Analysis failed',
        },
      },
      { status: 500 }
    )
  }
}