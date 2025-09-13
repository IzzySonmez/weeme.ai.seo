import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { payload } = await request.json()

    // Check if we should use OpenAI
    if (process.env.OPENAI_API_KEY && process.env.LLM_PROVIDER !== 'emergent') {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an SEO expert. Analyze the provided website data and give 3-5 specific, actionable SEO improvement suggestions.',
              },
              {
                role: 'user',
                content: `Analyze this website data: ${JSON.stringify(payload)}`,
              },
            ],
            max_tokens: 500,
          }),
        })

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json()
          const suggestions = openaiData.choices[0]?.message?.content
            ?.split('\n')
            .filter((line: string) => line.trim().length > 0)
            .slice(0, 5) || getStubSuggestions(payload)

          return NextResponse.json({ suggestions })
        }
      } catch (error) {
        console.error('OpenAI API error:', error)
        // Fall through to stub suggestions
      }
    }

    // Return stub suggestions
    return NextResponse.json({
      suggestions: getStubSuggestions(payload),
    })

  } catch (error) {
    console.error('Insights error:', error)
    return NextResponse.json({
      suggestions: [
        'Improve page loading speed',
        'Optimize meta descriptions',
        'Add structured data markup',
        'Improve mobile responsiveness',
        'Enhance content quality',
      ],
    })
  }
}

function getStubSuggestions(payload: any): string[] {
  const suggestions: string[] = []

  if (payload.scores.performance < 80) {
    suggestions.push('Optimize images and reduce file sizes to improve page loading speed')
  }

  if (payload.scores.seo < 90) {
    suggestions.push('Improve SEO by adding proper meta descriptions and title tags')
  }

  if (!payload.meta.description || payload.meta.description.length < 120) {
    suggestions.push('Write compelling meta descriptions between 120-160 characters')
  }

  if (!payload.discoverability.robotsTxt) {
    suggestions.push('Add a robots.txt file to help search engines crawl your site')
  }

  if (!payload.discoverability.sitemapXml) {
    suggestions.push('Create and submit an XML sitemap to improve discoverability')
  }

  if (payload.audits.cls && payload.audits.cls > 0.1) {
    suggestions.push('Reduce Cumulative Layout Shift by adding size attributes to images')
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Great job! Your site is performing well. Consider adding structured data markup for enhanced search results.',
      'Monitor your Core Web Vitals regularly to maintain good performance.',
      'Create high-quality, relevant content to improve search rankings.'
    )
  }

  return suggestions.slice(0, 5)
}