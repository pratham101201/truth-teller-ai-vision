
import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Download,
  Share2,
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  ChevronDown,
  ChevronUp,
  Shield
} from 'lucide-react';
import { AnalysisResult } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  // Determine result status and styling
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
    } else if (result.confidenceScore > 0.9) {
      return {
        icon: <CheckCircle className="h-10 w-10 text-verified-DEFAULT" />,
        title: "Likely Authentic",
        description: "Our analysis indicates this media is authentic.",
        bgColor: "bg-verified-light",
        textColor: "text-verified-dark",
        borderColor: "border-verified-DEFAULT"
      };
    } else {
      return {
        icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
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
  }, [result, mediaPreview, mediaFile, showOriginal]);

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
    if (canvasRef.current && result.isDeepfake && result.detectionAreas && !showOriginal) {
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

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Tabs defaultValue="visual" onValueChange={setActiveTab} className="mb-4">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="visual" className="text-sm">Visual Analysis</TabsTrigger>
                  <TabsTrigger value="technical" className="text-sm">Technical Details</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <TabsContent value="visual" className="mt-0">
                <div className="relative bg-slate-100 rounded-lg overflow-hidden mb-4">
                  {result.isDeepfake && result.detectionAreas && result.detectionAreas.length > 0 && !showOriginal ? (
                    mediaFile.type.startsWith('image/') ? (
                      <div className="relative">
                        <canvas 
                          ref={canvasRef} 
                          className="w-full h-auto max-h-[500px] object-contain mx-auto"
                        />
                        <div className="absolute top-2 right-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="secondary" 
                                  className="bg-white/80 hover:bg-white"
                                  onClick={() => setShowOriginal(!showOriginal)}
                                >
                                  {showOriginal ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {showOriginal ? 'Show manipulated areas' : 'Hide manipulated areas'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <video 
                          src={mediaPreview} 
                          controls 
                          className="w-full h-auto max-h-[500px] object-contain mx-auto"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white text-center p-4">
                          <div className="max-w-md">
                            <AlertTriangle className="h-10 w-10 mx-auto mb-3" />
                            <h4 className="text-lg font-medium mb-2">Deepfake Video Detected</h4>
                            <p>Our analysis indicates this video contains manipulated content.</p>
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    mediaFile.type.startsWith('image/') ? (
                      <div className="relative">
                        <img 
                          src={mediaPreview} 
                          alt="Analyzed media" 
                          className="w-full h-auto max-h-[500px] object-contain mx-auto"
                        />
                        {result.isDeepfake && (
                          <div className="absolute top-2 right-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="secondary" 
                                    className="bg-white/80 hover:bg-white"
                                    onClick={() => setShowOriginal(!showOriginal)}
                                  >
                                    {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {showOriginal ? 'Show manipulated areas' : 'Hide manipulated areas'}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full h-auto max-h-[500px] object-contain mx-auto"
                      />
                    )
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={handleDownload} className="flex-1 min-w-[120px]">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={handleShare} className="flex-1 min-w-[120px]">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1 min-w-[120px] bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                          onClick={() => {
                            setShowOriginal(!showOriginal);
                            if (activeTab !== "visual") setActiveTab("visual");
                          }}
                        >
                          {showOriginal ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                          {showOriginal ? "Show Analysis" : "Show Original"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showOriginal ? 'View manipulated areas' : 'View original without highlights'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TabsContent>
              
              <TabsContent value="technical" className="mt-0 space-y-4">
                <Card className="p-4 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-100 rounded-full">
                      <FileText className="h-5 w-5 text-slate-600" />
                    </div>
                    <h3 className="font-medium">Technical Analysis Report</h3>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="detection">
                      <AccordionTrigger className="text-sm font-medium">
                        Detection Features
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <div className="space-y-2 text-slate-600">
                          <p>Our analysis examined the following features:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {result.detectionFeatures ? (
                              result.detectionFeatures.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))
                            ) : (
                              <>
                                <li>Facial consistency analysis</li>
                                <li>Motion and behavior patterns</li>
                                <li>Lighting and shadow consistency</li>
                                <li>Edge detection and artifact analysis</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="technique">
                      <AccordionTrigger className="text-sm font-medium">
                        Analysis Technique
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <div className="space-y-2 text-slate-600">
                          <p>
                            {result.techniqueUsed || 'Our system used a combination of convolutional neural networks and forensic analysis techniques to examine this media.'}
                          </p>
                          <p>
                            Model version: {result.modelVersion || 'TruthTeller v2.3'}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="metadata">
                      <AccordionTrigger className="text-sm font-medium">
                        Media Metadata
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-600">
                          <div>File type:</div>
                          <div className="font-medium">{mediaFile.type}</div>
                          
                          <div>File size:</div>
                          <div className="font-medium">{(mediaFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                          
                          {result.mediaMetadata?.dimensions && (
                            <>
                              <div>Dimensions:</div>
                              <div className="font-medium">
                                {result.mediaMetadata.dimensions.width} × {result.mediaMetadata.dimensions.height}
                              </div>
                            </>
                          )}
                          
                          {result.mediaMetadata?.format && (
                            <>
                              <div>Format:</div>
                              <div className="font-medium">{result.mediaMetadata.format}</div>
                            </>
                          )}
                          
                          {result.mediaMetadata?.frameRate && (
                            <>
                              <div>Frame rate:</div>
                              <div className="font-medium">{result.mediaMetadata.frameRate} fps</div>
                            </>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
                
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" className="text-sm text-slate-500">
                    Download full report
                  </Button>
                </div>
              </TabsContent>
            </div>
            
            <div className="md:col-span-1">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResultsDisplay;
