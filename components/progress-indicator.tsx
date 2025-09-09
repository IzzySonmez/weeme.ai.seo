"use client";

import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function ProgressIndicator({ currentStep, steps }: ProgressIndicatorProps) {
  const progressSteps: ProgressStep[] = steps.map((step, index) => ({
    id: index + 1,
    title: step,
    description: getStepDescription(step),
    completed: index < currentStep - 1,
    active: index === currentStep - 1
  }));

  const progressPercentage = ((currentStep - 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Generating Your SEO Report</h3>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="space-y-4">
          {progressSteps.map((step) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : step.active ? (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  step.completed ? 'text-green-700' : 
                  step.active ? 'text-blue-700' : 'text-gray-500'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm ${
                  step.completed ? 'text-green-600' : 
                  step.active ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function getStepDescription(step: string): string {
  switch (step.toLowerCase()) {
    case 'collecting data':
      return 'Fetching PageSpeed insights, SERP data, and crawling your website';
    case 'analyzing performance':
      return 'Evaluating Core Web Vitals, technical SEO factors, and on-page elements';
    case 'researching competition':
      return 'Analyzing competitors, keyword opportunities, and market positioning';
    case 'generating recommendations':
      return 'Creating actionable insights and growth strategies';
    default:
      return 'Processing your request...';
  }
}