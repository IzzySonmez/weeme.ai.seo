"use client";

import { Button } from '@/components/ui/button';
import { FileText, RotateCcw, Share2 } from 'lucide-react';

interface ReportHeaderProps {
  onNewReport: () => void;
  onExportPDF: () => void;
}

export default function ReportHeader({ onNewReport, onExportPDF }: ReportHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              Weeme<span className="text-blue-600">.ai</span>
            </h1>
            <span className="text-gray-500">SEO Intelligence Reports</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onExportPDF}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </Button>
            
            <Button 
              onClick={onNewReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="h-4 w-4" />
              New Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}