
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Download,
  Share2
} from 'lucide-react';
import { AnalysisResult } from '@/types/types';
import { useToast } from '@/components/ui/use-toast';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Determine result status and styling
  const getResultStatus = () => {
    if (result.isDeepfake) {
      return {
        icon: <XCircle className="h-8 w-8 text-fake-DEFAULT" />,
        title: "Deepfake Detected",
        description: "This media shows signs of AI manipulation.",
        bgColor: "bg-fake-light",
        textColor: "text-fake-dark",
        borderColor: "border-fake-DEFAULT"
      };
    } else if (result.confidenceScore > 0.9) {
      return {
        icon: <CheckCircle className="h-8 w-8 text-verified-DEFAULT" />,
        title: "Likely Authentic",
        description: "Our analysis indicates this media is authentic.",
        bgColor: "bg-verified-light",
        textColor: "text-verified-dark",
        borderColor: "border-verified-DEFAULT"
      };
    } else {
      return {
        icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
        title: "Analysis Inconclusive",
        description: "We cannot determine with high confidence if this media is authentic or manipulated.",
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
        borderColor: "border-amber-300"
      };
    }
  };

  const status = getResultStatus();

  // Draw detection areas on canvas if result is a deepfake and has detection areas
  useEffect(() => {
    if (
      canvasRef.current && 
      result.isDeepfake && 
      result.detectionAreas && 
      result.detectionAreas.length > 0 &&
      mediaFile.type.startsWith('image/')
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Draw detection areas
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = Math.max(3, img.width / 100); // Responsive line width
        
        result.detectionAreas.forEach(area => {
          const x = area.x * img.width;
          const y = area.y * img.height;
          const width = area.width * img.width;
          const height = area.height * img.height;
          
          ctx.beginPath();
          ctx.rect(x, y, width, height);
          ctx.stroke();
          
          // Add a semi-transparent overlay
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fillRect(x, y, width, height);
        });
      };
      
      img.src = mediaPreview;
    }
  }, [result, mediaPreview, mediaFile]);

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
    if (canvasRef.current && result.isDeepfake && result.detectionAreas) {
      // Download the analyzed image with detection areas highlighted
      const link = document.createElement('a');
      link.download = `analyzed-${mediaFile.name}`;
      link.href = canvasRef.current.toDataURL();
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
    <section className="py-16 animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <Card className={`p-6 border-l-4 ${status.borderColor} mb-8`}>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="shrink-0">{status.icon}</div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${status.textColor}`}>{status.title}</h3>
                <p className="text-slate-600">{status.description}</p>
              </div>
              <div className="shrink-0 space-y-2">
                <div className="text-center p-2 bg-slate-100 rounded">
                  <div className="text-2xl font-bold text-slate-800">
                    {Math.round(result.confidenceScore * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">Confidence</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="relative bg-slate-100 rounded-lg overflow-hidden mb-4">
                {result.isDeepfake && result.detectionAreas && result.detectionAreas.length > 0 ? (
                  mediaFile.type.startsWith('image/') ? (
                    <canvas 
                      ref={canvasRef} 
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    />
                  ) : (
                    <div className="relative">
                      <video 
                        src={mediaPreview} 
                        controls 
                        className="w-full h-auto max-h-[500px] object-contain mx-auto"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-center p-4">
                        <div>
                          <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                          <p>This video contains detected manipulations</p>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  mediaFile.type.startsWith('image/') ? (
                    <img 
                      src={mediaPreview} 
                      alt="Analyzed media" 
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    />
                  ) : (
                    <video
                      src={mediaPreview}
                      controls
                      className="w-full h-auto max-h-[500px] object-contain mx-auto"
                    />
                  )
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="font-bold text-lg mb-3">Analysis Details</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-sm text-slate-500">Analysis Time</div>
                  <div className="font-medium">{result.analysisTime.toFixed(2)} seconds</div>
                </div>
                
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <div className="text-sm text-slate-500">File Information</div>
                  <div className="font-medium">{mediaFile.name}</div>
                  <div className="text-sm text-slate-500">
                    {mediaFile.type} · {(mediaFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
                
                {result.isDeepfake && result.detectionAreas && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="text-sm text-slate-500">Detection Areas</div>
                    <div className="font-medium">{result.detectionAreas.length} areas identified</div>
                  </div>
                )}
                
                <div>
                  <Button 
                    variant="ghost" 
                    className="text-sm px-0 hover:bg-transparent hover:text-truth-600"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {showExplanation ? "Hide explanation" : "How do we detect deepfakes?"}
                  </Button>
                  
                  {showExplanation && (
                    <div className="mt-2 text-sm text-slate-600 p-3 bg-slate-50 rounded border border-slate-200 animate-slide-up">
                      <p>Our AI system analyzes inconsistencies in facial features, unnatural lighting, irregular blinking, and other telltale signs of manipulation. We use a combination of machine learning models trained on thousands of examples of both authentic and manipulated media.</p>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={onReset}
                >
                  Analyze Another File
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
