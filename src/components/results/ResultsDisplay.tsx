
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { AnalysisResult } from '@/types/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

// Import our new components
import ResultStatus from './ResultStatus';
import MediaDisplay from './MediaDisplay';
import MediaControls from './MediaControls';
import TechnicalDetails from './TechnicalDetails';
import AnalysisSummary from './AnalysisSummary';

interface ResultsDisplayProps {
  result: AnalysisResult;
  mediaFile: File;
  mediaPreview: string;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  mediaFile, 
  mediaPreview, 
  onReset 
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("visual");
  const { toast } = useToast();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Deepfake Analysis Result',
        text: `Media analysis result: ${result.isDeepfake ? 'Deepfake detected' : 'Likely authentic'} with ${result.confidenceScore * 100}% confidence.`,
        url: window.location.href,
      })
      .catch(() => {
        toast({
          title: "Sharing failed",
          description: "Could not share the results.",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: "Link copied",
            description: "Analysis result URL copied to clipboard.",
          });
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Could not copy the URL to clipboard.",
          });
        });
    }
  };

  const handleDownload = () => {
    if (result.isDeepfake && result.detectionAreas && !showOriginal) {
      // Download the analyzed image with detection areas highlighted
      const link = document.createElement('a');
      link.download = `analyzed-${mediaFile.name}`;
      
      // If we have a canvas element with detection areas, use that
      const canvasElement = document.querySelector('canvas');
      if (canvasElement) {
        link.href = canvasElement.toDataURL();
      } else {
        // Fallback to the original image
        link.href = mediaPreview;
      }
      link.click();
    } else {
      // Just download the original file
      const link = document.createElement('a');
      link.download = mediaFile.name;
      link.href = mediaPreview;
      link.click();
    }
  };

  return (
    <section className="py-12 md:py-16 animate-fade-in">
      <div className="container px-4 md:px-6">
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="mb-6 -ml-2 text-slate-600 hover:text-truth-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Analyze another file
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <ResultStatus result={result} />

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Tabs defaultValue="visual" onValueChange={setActiveTab} className="mb-4">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="visual" className="text-sm">Visual Analysis</TabsTrigger>
                  <TabsTrigger value="technical" className="text-sm">Technical Details</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <TabsContent value="visual" className="mt-0">
                <MediaDisplay 
                  result={result}
                  mediaFile={mediaFile}
                  mediaPreview={mediaPreview}
                  showOriginal={showOriginal}
                  setShowOriginal={setShowOriginal}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                
                <MediaControls 
                  handleDownload={handleDownload}
                  handleShare={handleShare}
                  showOriginal={showOriginal}
                  setShowOriginal={setShowOriginal}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </TabsContent>
              
              <TabsContent value="technical" className="mt-0 space-y-4">
                <TechnicalDetails result={result} mediaFile={mediaFile} />
                
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-sm text-slate-500">
                    Download full report
                  </Button>
                </div>
              </TabsContent>
            </div>
            
            <div className="md:col-span-1">
              <AnalysisSummary result={result} onReset={onReset} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
