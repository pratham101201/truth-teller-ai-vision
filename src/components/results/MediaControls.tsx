
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Share2, Eye, EyeOff } from 'lucide-react';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";

interface MediaControlsProps {
  handleDownload: () => void;
  handleShare: () => void;
  showOriginal: boolean;
  setShowOriginal: (show: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MediaControls: React.FC<MediaControlsProps> = ({ 
  handleDownload, 
  handleShare, 
  showOriginal, 
  setShowOriginal,
  activeTab,
  setActiveTab
}) => {
  return (
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
  );
};

export default MediaControls;
