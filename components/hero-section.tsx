"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Search, Globe, Target, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGenerateReport: (data: { domain?: string; keyword?: string; type: 'domain' | 'keyword' }) => void;
  isLoading: boolean;
}

export default function HeroSection({ onGenerateReport, isLoading }: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState<'domain' | 'keyword'>('domain');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (activeTab === 'domain') {
      onGenerateReport({ domain: inputValue.trim(), type: 'domain' });
    } else {
      onGenerateReport({ keyword: inputValue.trim(), type: 'keyword' });
    }
  };

  const handleDemo = () => {
    setInputValue('https://www.patagonia.com');
    setActiveTab('domain');
    onGenerateReport({ domain: 'https://www.patagonia.com', type: 'domain' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Weeme<span className="text-blue-600">.ai</span>
            </h1>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            SEO Intelligence Reports
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Get instant, comprehensive SEO analysis with real-time data. 
            Enter any domain or keyword to receive actionable insights in seconds.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Global SERP Data</h3>
            <p className="text-gray-600 text-sm">Real-time search results and competitor analysis from multiple data sources</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Technical Audit</h3>
            <p className="text-gray-600 text-sm">Core Web Vitals, PageSpeed insights, and actionable technical recommendations</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Growth Roadmap</h3>
            <p className="text-gray-600 text-sm">30-60-90 day SEO strategy with keyword opportunities and KPI tracking</p>
          </Card>
        </div>

        {/* Input Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 shadow-xl">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'domain' | 'keyword')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="domain" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Analyze Domain
                </TabsTrigger>
                <TabsTrigger value="keyword" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Research Keyword
                </TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <TabsContent value="domain" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website Domain
                      </label>
                      <Input
                        type="text"
                        placeholder="https://example.com"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-lg p-4"
                        disabled={isLoading}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter a complete URL or domain name
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="keyword" className="mt-0">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Keyword
                      </label>
                      <Input
                        type="text"
                        placeholder="sustainable fashion"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="text-lg p-4"
                        disabled={isLoading}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter a keyword or search phrase to analyze
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    disabled={isLoading || !inputValue.trim()}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDemo}
                    disabled={isLoading}
                    className="px-6 py-6"
                  >
                    Demo
                  </Button>
                </div>
              </form>
            </Tabs>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 mb-4">Powered by industry-leading APIs</p>
          <div className="flex justify-center items-center gap-8 text-gray-400 text-sm">
            <span>Google PageSpeed Insights</span>
            <span>•</span>
            <span>SERP API</span>
            <span>•</span>
            <span>OpenPageRank</span>
            <span>•</span>
            <span>Real-time Crawling</span>
          </div>
        </div>
      </div>
    </div>
  );
}