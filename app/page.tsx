"use client";

import { useState } from 'react';
import HeroSection from '@/components/hero-section';
import ProgressIndicator from '@/components/progress-indicator';
import ReportSection from '@/components/report-section';
import ReportHeader from '@/components/report-header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Report } from '@/lib/types/report';

type AppState = 'input' | 'loading' | 'report' | 'error';

export default function Home() {
  const [state, setState] = useState<AppState>('input');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);

  const progressSteps = [
    'Collecting Data',
    'Analyzing Performance', 
    'Researching Competition',
    'Generating Recommendations'
  ];

  const generateReport = async (data: { domain?: string; keyword?: string; type: 'domain' | 'keyword' }) => {
    setState('loading');
    setCurrentStep(1);
    setError('');

    try {
      // Simulate progress steps
      const stepDuration = 2000; // 2 seconds per step
      
      for (let step = 1; step <= progressSteps.length; step++) {
        setCurrentStep(step);
        
        if (step < progressSteps.length) {
          await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
      }

      const response = await fetch('/api/seo/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate report');
      }

      const reportData = await response.json();
      setReport(reportData);
      setState('report');

    } catch (err) {
      console.error('Report generation failed:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setState('error');
    }
  };

  const handleNewReport = () => {
    setState('input');
    setReport(null);
    setError('');
    setCurrentStep(1);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {state === 'report' && (
        <ReportHeader 
          onNewReport={handleNewReport}
          onExportPDF={handleExportPDF}
        />
      )}

      {state === 'input' && (
        <HeroSection 
          onGenerateReport={generateReport}
          isLoading={false}
        />
      )}

      {state === 'loading' && (
        <div className="container mx-auto px-4 py-16">
          <ProgressIndicator 
            currentStep={currentStep}
            steps={progressSteps}
          />
        </div>
      )}

      {state === 'error' && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <button 
                onClick={handleNewReport}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {state === 'report' && report && (
        <div className="pb-16">
          <ReportSection report={report} />
        </div>
      )}
    </div>
  );
}