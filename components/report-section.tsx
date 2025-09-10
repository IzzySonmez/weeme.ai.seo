"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Zap, 
  Search, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  BarChart3,
  FileText,
  Users,
  Calendar
} from 'lucide-react';
import { Report } from '@/lib/types/report';

interface ReportSectionProps {
  report: Report;
}

export default function ReportSection({ report }: ReportSectionProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SEO Intelligence Report
        </h1>
        <p className="text-gray-600">
          {report.domain} • Generated on {new Date(report.timestamp).toLocaleDateString()}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {report.overview.gscData && (
          <Card>
            <CardContent className="p-4 text-center">
              <Search className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {report.overview.gscData.totalClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">GSC Clicks (90d)</div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="p-4 text-center">
            <Globe className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {report.overview.domainRank || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Domain Rank</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {report.overview.indexedPages?.toLocaleString() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Indexed Pages</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Search className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {report.overview.organicKeywords?.toLocaleString() || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Est. Keywords</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {report.technical.lighthouseScore}
            </div>
            <div className="text-sm text-gray-600">Performance Score</div>
          </CardContent>
        </Card>
      </div>

      {/* GSC Data Section */}
      {report.overview.gscData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-500" />
              Google Search Console Data (Last 90 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {report.overview.gscData.totalClicks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {report.overview.gscData.totalImpressions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {report.overview.gscData.averageCTR.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">Average CTR</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {report.overview.gscData.averagePosition.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Position</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Top Performing Keywords</h4>
              <div className="space-y-2">
                {report.overview.gscData.topKeywords.slice(0, 10).map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <span className="font-medium">{keyword.query}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">{keyword.clicks} clicks</span>
                      <span className="text-blue-600">{keyword.impressions.toLocaleString()} imp.</span>
                      <Badge variant="outline">#{keyword.position.toFixed(1)}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Report Sections */}
      <Accordion type="multiple" defaultValue={["technical", "onpage"]} className="space-y-4">
        
        {/* Technical SEO */}
        <AccordionItem value="technical">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-semibold">Technical SEO</span>
                <Badge variant={report.technical.speedRating === 'fast' ? 'default' : 'secondary'}>
                  {report.technical.speedRating}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 pb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Core Web Vitals */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Core Web Vitals
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Largest Contentful Paint</span>
                          <Badge variant={
                            report.technical.coreWebVitals.lcp.rating === 'good' ? 'default' : 
                            report.technical.coreWebVitals.lcp.rating === 'needs-improvement' ? 'secondary' : 'destructive'
                          }>
                            {report.technical.coreWebVitals.lcp.value}ms
                          </Badge>
                        </div>
                        <Progress 
                          value={Math.min(100, (4000 - report.technical.coreWebVitals.lcp.value) / 40)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">First Input Delay</span>
                          <Badge variant={
                            report.technical.coreWebVitals.fid.rating === 'good' ? 'default' : 
                            report.technical.coreWebVitals.fid.rating === 'needs-improvement' ? 'secondary' : 'destructive'
                          }>
                            {report.technical.coreWebVitals.fid.value}ms
                          </Badge>
                        </div>
                        <Progress 
                          value={Math.min(100, (300 - report.technical.coreWebVitals.fid.value) / 3)} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Cumulative Layout Shift</span>
                          <Badge variant={
                            report.technical.coreWebVitals.cls.rating === 'good' ? 'default' : 
                            report.technical.coreWebVitals.cls.rating === 'needs-improvement' ? 'secondary' : 'destructive'
                          }>
                            {report.technical.coreWebVitals.cls.value.toFixed(3)}
                          </Badge>
                        </div>
                        <Progress 
                          value={Math.min(100, (0.25 - report.technical.coreWebVitals.cls.value) / 0.0025)} 
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Items */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Priority Actions
                    </h4>
                    <div className="space-y-2">
                      {report.technical.actionItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* On-Page SEO */}
        <AccordionItem value="onpage">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-500" />
                <span className="text-lg font-semibold">On-Page SEO</span>
                <Badge variant="secondary">
                  {report.onPage.quickWins.length} Quick Wins
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 pb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* SEO Elements */}
                  <div>
                    <h4 className="font-semibold mb-4">SEO Elements</h4>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Title Tag</span>
                          <Badge variant={report.onPage.title.issues.length === 0 ? 'default' : 'destructive'}>
                            {report.onPage.title.length} chars
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.onPage.title.content || 'No title found'}</p>
                        {report.onPage.title.issues.map((issue, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                            <XCircle className="h-3 w-3" />
                            {issue}
                          </div>
                        ))}
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Meta Description</span>
                          <Badge variant={report.onPage.metaDescription.issues.length === 0 ? 'default' : 'destructive'}>
                            {report.onPage.metaDescription.length} chars
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{report.onPage.metaDescription.content || 'No meta description found'}</p>
                        {report.onPage.metaDescription.issues.map((issue, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                            <XCircle className="h-3 w-3" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Wins */}
                  <div>
                    <h4 className="font-semibold mb-4">Quick Wins</h4>
                    <div className="space-y-2">
                      {report.onPage.quickWins.map((win, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{win}</span>
                        </div>
                      ))}
                    </div>
                    
                    {report.onPage.schemaTypes.length > 0 && (
                      <div className="mt-6">
                        <h5 className="font-medium mb-2">Schema Types Detected</h5>
                        <div className="flex flex-wrap gap-2">
                          {report.onPage.schemaTypes.map((schema, index) => (
                            <Badge key={index} variant="outline">{schema}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* SERP Analysis */}
        <AccordionItem value="serp">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-purple-500" />
                <span className="text-lg font-semibold">SERP & Competition</span>
                <Badge variant="secondary">
                  {report.serp.competitors.length} Competitors
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 pb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Top Results */}
                  <div>
                    <h4 className="font-semibold mb-4">Top SERP Results</h4>
                    <div className="space-y-3">
                      {report.serp.topResults.slice(0, 5).map((result) => (
                        <div key={result.position} className="border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">#{result.position}</Badge>
                            <span className="text-sm text-gray-600">{result.domain}</span>
                          </div>
                          <h5 className="font-medium text-sm mb-1">{result.title}</h5>
                          <p className="text-xs text-gray-600 line-clamp-2">{result.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Competitors & PAA */}
                  <div>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-4">Main Competitors</h4>
                      <div className="space-y-3">
                        {report.serp.competitors.map((competitor, index) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{competitor.domain}</span>
                              <Badge>Rank #{competitor.rank}</Badge>
                            </div>
                            <div className="space-y-1">
                              {competitor.strengths.slice(0, 2).map((strength, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span className="text-xs text-gray-600">{strength}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {report.serp.peopleAlsoAsk.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-4">People Also Ask</h4>
                        <div className="space-y-2">
                          {report.serp.peopleAlsoAsk.slice(0, 4).map((question, index) => (
                            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                              {question}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Growth Plan */}
        <AccordionItem value="growth">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-semibold">Growth Strategy</span>
                <Badge variant="secondary">90-Day Plan</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="px-6 pb-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {/* 30 Days */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      30 Days (Quick Wins)
                    </h4>
                    <div className="space-y-3">
                      {report.growthPlan.thirtyDays.map((task, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{task.category}</Badge>
                            <div className="flex gap-1">
                              <Badge variant={task.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                                {task.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm">{task.task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 60 Days */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      60 Days (Content & Authority)
                    </h4>
                    <div className="space-y-3">
                      {report.growthPlan.sixtyDays.map((task, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{task.category}</Badge>
                            <div className="flex gap-1">
                              <Badge variant={task.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                                {task.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm">{task.task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 90 Days */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      90 Days (Long-term Growth)
                    </h4>
                    <div className="space-y-3">
                      {report.growthPlan.ninetyDays.map((task, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{task.category}</Badge>
                            <div className="flex gap-1">
                              <Badge variant={task.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                                {task.impact} impact
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm">{task.task}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* KPIs */}
                <div>
                  <h4 className="font-semibold mb-4">Success Metrics & KPIs</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {report.growthPlan.kpis.map((kpi, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h5 className="font-medium mb-2">{kpi.name}</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Current: {kpi.current}</span>
                          <span className="text-sm font-medium text-green-600">Target: {kpi.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
}