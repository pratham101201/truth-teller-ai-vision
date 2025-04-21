
import React from 'react';
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { AnalysisResult } from '@/types/types';

interface ResultStatusProps {
  result: AnalysisResult;
}

const ResultStatus: React.FC<ResultStatusProps> = ({ result }) => {
  // Determine result status and styling with improved thresholds
  // Note: We're now using stricter thresholds to classify results
  const getResultStatus = () => {
    if (result.isDeepfake) {
      return {
        icon: <XCircle className="h-10 w-10 text-fake-DEFAULT" />,
        title: "Deepfake Detected",
        description: "This media shows signs of AI manipulation.",
        bgColor: "bg-fake-light",
        textColor: "text-fake-dark",
        borderColor: "border-fake-DEFAULT"
      };
    // Higher threshold for "Likely Authentic" classification
    } else if (result.confidenceScore > 0.95) {
      return {
        icon: <CheckCircle className="h-10 w-10 text-verified-DEFAULT" />,
        title: "Likely Authentic",
        description: "Our analysis indicates this media is authentic.",
        bgColor: "bg-verified-light",
        textColor: "text-verified-dark",
        borderColor: "border-verified-DEFAULT"
      };
    // Expanded "uncertain" range for medium confidence
    } else if (result.confidenceScore > 0.75) {
      return {
        icon: <Info className="h-10 w-10 text-blue-500" />,
        title: "Probably Authentic",
        description: "Our analysis leans toward authenticity, but we recommend caution.",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        borderColor: "border-blue-300"
      };
    } else {
      return {
        icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
        title: "Analysis Inconclusive",
        description: "We cannot determine with confidence if this media is authentic or manipulated. Exercise caution.",
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
        borderColor: "border-amber-300"
      };
    }
  };

  const status = getResultStatus();

  return (
    <Card className={`p-6 border-l-4 ${status.borderColor} shadow-lg mb-8`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="shrink-0 flex items-center justify-center md:justify-start">
          {status.icon}
        </div>
        <div className="flex-1">
          <h3 className={`text-2xl font-bold ${status.textColor}`}>{status.title}</h3>
          <p className="text-slate-600">{status.description}</p>
          {result.message && (
            <p className="mt-2 text-sm text-slate-500">{result.message}</p>
          )}
        </div>
        <div className="shrink-0 space-y-2">
          <div className="text-center p-3 bg-slate-100 rounded-lg">
            <div className="text-3xl font-bold text-slate-800">
              {Math.round(result.confidenceScore * 100)}%
            </div>
            <div className="text-xs text-slate-500">Confidence Score</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultStatus;

