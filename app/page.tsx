'use client'

import { useState } from 'react'
import UrlForm from '@/components/UrlForm'
import ReportCard from '@/components/ReportCard'
import ErrorAlert from '@/components/ErrorAlert'
import Loading from '@/components/Loading'

interface AnalysisResult {
  data: {
    url: string
    scores: {
      performance: number
      accessibility: number
      best_practices: number
      seo: number
    }
    audits: {
      lcp?: number
      cls?: number
      tbt?: number
    }
    meta: {
      title: string
      description: string
      h1: string
    }
    discoverability: {
      robotsTxt: boolean
      sitemapXml: boolean
    }
  }
  suggestions: string[]
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (url: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Analysis failed')
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {process.env.NEXT_PUBLIC_APP_NAME || 'weeme.ai'}
          </h1>
          <p className="text-xl text-gray-600">
            AI-powered SEO analysis and insights
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <UrlForm onSubmit={handleAnalyze} disabled={loading} />
        </div>

        {loading && <Loading />}
        {error && <ErrorAlert message={error} />}
        {result && <ReportCard result={result} />}
      </div>
    </main>
  )
}