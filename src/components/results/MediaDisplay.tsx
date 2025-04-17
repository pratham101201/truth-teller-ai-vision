
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  EyeOff, 
  Download, 
  Share2,
  AlertTriangle
} from 'lucide-react';
import { AnalysisResult } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";

interface MediaDisplayProps {
  result: AnalysisResult;
  mediaFile: File;
  mediaPreview: string;
  showOriginal: boolean;
  setShowOriginal: (show: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ 
  result, 
  mediaFile, 
  mediaPreview, 
  showOriginal, 
  setShowOriginal,
  activeTab,
  setActiveTab
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
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
  );
};

export default MediaDisplay;
