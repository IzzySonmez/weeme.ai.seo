'use client'

import ScoreBadge from './ScoreBadge'

interface ReportCardProps {
  result: {
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
}

export default function ReportCard({ result }: ReportCardProps) {
  const { data, suggestions } = result

  const handleExportPdf = async () => {
    try {
      const response = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ report: result }),
      })
      
      if (response.ok) {
        alert('PDF export initiated (stub implementation)')
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
      <div className="border-b pb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Analysis Report</h2>
        <p className="text-gray-600">{data.url}</p>
        <button
          onClick={handleExportPdf}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Export PDF
        </button>
      </div>

      {/* Scores */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <ScoreBadge score={data.scores.performance} />
            <p className="text-sm text-gray-600 mt-2">Performance</p>
          </div>
          <div className="text-center">
            <ScoreBadge score={data.scores.accessibility} />
            <p className="text-sm text-gray-600 mt-2">Accessibility</p>
          </div>
          <div className="text-center">
            <ScoreBadge score={data.scores.best_practices} />
            <p className="text-sm text-gray-600 mt-2">Best Practices</p>
          </div>
          <div className="text-center">
            <ScoreBadge score={data.scores.seo} />
            <p className="text-sm text-gray-600 mt-2">SEO</p>
          </div>
        </div>
      </div>

      {/* Meta Information */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Meta Information</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Title</p>
            <p className="text-gray-900">{data.meta.title || 'No title found'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Meta Description</p>
            <p className="text-gray-900">{data.meta.description || 'No meta description found'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">First H1</p>
            <p className="text-gray-900">{data.meta.h1 || 'No H1 found'}</p>
          </div>
        </div>
      </div>

      {/* Discoverability */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Discoverability</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${data.discoverability.robotsTxt ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">robots.txt</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${data.discoverability.sitemapXml ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">sitemap.xml</span>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      {Object.keys(data.audits).length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.audits.lcp && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">LCP</p>
                <p className="text-lg font-semibold">{(data.audits.lcp / 1000).toFixed(2)}s</p>
              </div>
            )}
            {data.audits.cls && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">CLS</p>
                <p className="text-lg font-semibold">{data.audits.cls.toFixed(3)}</p>
              </div>
            )}
            {data.audits.tbt && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700">TBT</p>
                <p className="text-lg font-semibold">{data.audits.tbt.toFixed(0)}ms</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered Suggestions</h3>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}