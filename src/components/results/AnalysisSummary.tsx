
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Shield 
} from 'lucide-react';
import { AnalysisResult } from '@/types/types';

interface AnalysisSummaryProps {
  result: AnalysisResult;
  onReset: () => void;
  showExplanation: boolean;
  setShowExplanation: (show: boolean) => void;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ 
  result, 
  onReset,
  showExplanation,
  setShowExplanation
}) => {
  return (
    <Card className="p-4 border border-slate-200">
      <h3 className="font-bold text-lg mb-3 flex items-center">
        <Shield className="h-4 w-4 mr-2 text-truth-600" />
        Analysis Summary
      </h3>
      
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
          <div className="text-sm text-slate-500">Analysis Time</div>
          <div className="font-medium">{result.analysisTime.toFixed(2)} seconds</div>
        </div>
        
        {result.isDeepfake && result.detectionAreas && (
          <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-sm text-slate-500">Detection Areas</div>
            <div className="font-medium">{result.detectionAreas.length} areas identified</div>
          </div>
        )}
        
        <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
          <div className="text-sm text-slate-500">Analysis ID</div>
          <div className="font-medium overflow-hidden text-ellipsis">
            {result.analysisId || 'AN' + Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
        
        <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
          <div className="text-sm text-slate-500">Timestamp</div>
          <div className="font-medium">
            {result.timestamp || new Date().toLocaleString()}
          </div>
        </div>
        
        <div>
          <Button 
            variant="ghost" 
            className="w-full text-sm hover:bg-truth-50 hover:text-truth-600 justify-start p-3 h-auto"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <Info className="h-4 w-4 mr-2" />
            <span>How do we detect deepfakes?</span>
            {showExplanation ? 
              <ChevronUp className="h-4 w-4 ml-auto" /> : 
              <ChevronDown className="h-4 w-4 ml-auto" />
            }
          </Button>
          
          {showExplanation && (
            <div className="mt-2 text-sm text-slate-600 p-3 bg-slate-50 rounded-md border border-slate-200 animate-slide-up">
              <p className="mb-2">Our AI system analyzes several key indicators of manipulation:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Facial inconsistencies</li>
                <li>Unnatural blinking patterns</li>
                <li>Lighting and shadow discrepancies</li>
                <li>Irregular texture boundaries</li>
                <li>Audio-visual synchronization</li>
              </ul>
              <p className="mt-2">Our models are trained on thousands of examples of both authentic and manipulated media.</p>
            </div>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-truth-200 text-truth-700 hover:bg-truth-50"
          onClick={onReset}
        >
          Analyze Another File
        </Button>
      </div>
    </Card>
  );
};

export default AnalysisSummary;
