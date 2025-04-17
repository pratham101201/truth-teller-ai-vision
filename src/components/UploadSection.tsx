
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Image, Video, X, Loader2, Shield, Settings } from 'lucide-react';
import { FileType } from '@/types/types';
import { analyzeMedia } from '@/utils/mockAnalysis';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UploadSectionProps {
  onAnalysisComplete: (result: any, file: File) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalysisComplete }) => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<FileType>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState<"standard" | "enhanced" | "quick">("standard");
  const [detectRegions, setDetectRegions] = useState(true);
  const [sensitivityLevel, setSensitivityLevel] = useState<"low" | "medium" | "high">("medium");
  const [prioritizeAccuracy, setPrioritizeAccuracy] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const progressInterval = useRef<number | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const resetUpload = () => {
    setFile(null);
    setFileType(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateFile = (file: File): boolean => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    
    // Check file size (20MB limit)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 20MB.",
        variant: "destructive"
      });
      return false;
    }
    
    if (validImageTypes.includes(file.type)) {
      setFileType('image');
      return true;
    } else if (validVideoTypes.includes(file.type)) {
      setFileType('video');
      return true;
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or MP4 file.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setAnalyzing(true);
    setProgress(0);

    // Simulate progress with an interval
    progressInterval.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          if (progressInterval.current) clearInterval(progressInterval.current);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      const result = await analyzeMedia(file, {
        analysisType,
        detectRegions,
        sensitivityLevel,
        prioritizeAccuracy
      });
      
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);
      
      // Small delay to show 100% before completing
      setTimeout(() => {
        onAnalysisComplete(result, file);
        toast({
          title: "Analysis complete",
          description: `${result.isDeepfake ? "Deepfake detected" : "No manipulation detected"} with ${Math.round(result.confidenceScore * 100)}% confidence.`,
          variant: result.isDeepfake ? "destructive" : "default"
        });
        setAnalyzing(false);
      }, 500);
    } catch (error) {
      if (progressInterval.current) clearInterval(progressInterval.current);
      setAnalyzing(false);
      setProgress(0);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your media. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <section id="upload" className="py-16 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-truth-50 opacity-50 -z-10"></div>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <div className="p-2 bg-truth-100 rounded-full">
            <Shield className="h-6 w-6 text-truth-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Detect Deepfakes</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Upload an image or video to analyze it for signs of AI manipulation.
            Our advanced algorithms can detect subtle traces of deepfake technology.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-6 shadow-lg border-truth-100">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="upload">Upload Media</TabsTrigger>
              <TabsTrigger value="settings">Analysis Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-0">
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    dragging ? 'border-truth-400 bg-truth-50' : 'border-slate-200'
                  } transition-colors duration-200`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-3 rounded-full bg-truth-100">
                      <Upload className="h-6 w-6 text-truth-600" />
                    </div>
                    <h3 className="text-lg font-medium">Drag and drop your file here</h3>
                    <p className="text-sm text-slate-500 max-w-md">
                      Support for JPG, PNG, and MP4 files. Max file size 20MB.
                    </p>
                    <span className="text-sm text-slate-400">- OR -</span>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="border-truth-200 hover:bg-truth-50 hover:text-truth-600"
                    >
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInput}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.mp4"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">File Ready for Analysis</h3>
                    <Button variant="ghost" size="sm" onClick={resetUpload} disabled={analyzing}>
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>

                  <div className="relative bg-slate-100 rounded-lg overflow-hidden">
                    {fileType === 'image' ? (
                      <img
                        src={filePreview || ''}
                        alt="Preview"
                        className="mx-auto max-h-[300px] object-contain"
                      />
                    ) : fileType === 'video' ? (
                      <video
                        src={filePreview || ''}
                        controls
                        className="mx-auto max-h-[300px] w-full"
                      />
                    ) : null}
                  </div>

                  <div className="flex items-center text-sm text-slate-600 mt-2 justify-between">
                    <span className="flex items-center">
                      {fileType === 'image' ? (
                        <Image className="h-4 w-4 mr-1" />
                      ) : (
                        <Video className="h-4 w-4 mr-1" />
                      )}
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>

                  {analyzing ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing with {analysisType} detection...
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2 py-1 bg-truth-50 rounded-lg text-sm text-slate-600">
                        <span>Analysis type: <span className="font-medium">{analysisType}</span></span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 p-0 hover:bg-transparent">
                              <Settings className="h-4 w-4 text-slate-400" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-4">
                              <h4 className="font-medium">Quick Settings</h4>
                              <div className="space-y-2">
                                <div className="text-sm text-slate-500">Analysis Type</div>
                                <RadioGroup 
                                  defaultValue={analysisType} 
                                  onValueChange={(value) => setAnalysisType(value as "standard" | "enhanced" | "quick")}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="quick" id="quick" />
                                    <Label htmlFor="quick">Quick</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="standard" id="standard" />
                                    <Label htmlFor="standard">Standard</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="enhanced" id="enhanced" />
                                    <Label htmlFor="enhanced">Enhanced</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button 
                        className="w-full bg-truth-600 hover:bg-truth-700 text-white" 
                        onClick={handleAnalyze}
                      >
                        Analyze for Deepfakes
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Analysis Settings</h3>
                  <p className="text-sm text-slate-500">
                    Configure how TruthTeller analyzes your media. Advanced settings can improve accuracy but may take longer.
                  </p>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="font-medium">Analysis Type</div>
                    <RadioGroup 
                      defaultValue={analysisType} 
                      onValueChange={(value) => setAnalysisType(value as "standard" | "enhanced" | "quick")}
                    >
                      <div className="flex items-start space-x-2 pb-2">
                        <RadioGroupItem value="quick" id="r-quick" />
                        <div className="grid gap-1">
                          <Label htmlFor="r-quick">Quick Analysis</Label>
                          <p className="text-sm text-slate-500">Fastest results, basic detection (5-10 seconds)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 pb-2">
                        <RadioGroupItem value="standard" id="r-standard" />
                        <div className="grid gap-1">
                          <Label htmlFor="r-standard">Standard Analysis</Label>
                          <p className="text-sm text-slate-500">Balanced approach with good accuracy (10-20 seconds)</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <RadioGroupItem value="enhanced" id="r-enhanced" />
                        <div className="grid gap-1">
                          <Label htmlFor="r-enhanced">Enhanced Analysis</Label>
                          <p className="text-sm text-slate-500">Most accurate results, deeper analysis (20-40 seconds)</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">Sensitivity Level</div>
                    <RadioGroup 
                      defaultValue={sensitivityLevel} 
                      onValueChange={(value) => setSensitivityLevel(value as "low" | "medium" | "high")}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low">Low (fewer false positives)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium (balanced)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high">High (catch subtle manipulations)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="detect-regions">Detect Manipulation Regions</Label>
                        <p className="text-sm text-slate-500">Highlight specific areas where manipulation is detected</p>
                      </div>
                      <Switch 
                        id="detect-regions" 
                        checked={detectRegions}
                        onCheckedChange={setDetectRegions}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="prioritize-accuracy">Prioritize Accuracy</Label>
                        <p className="text-sm text-slate-500">Takes longer but provides more accurate results</p>
                      </div>
                      <Switch 
                        id="prioritize-accuracy" 
                        checked={prioritizeAccuracy}
                        onCheckedChange={setPrioritizeAccuracy}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-8 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs" onClick={() => resetUpload()}>
                  Reset All Settings
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Resets file selection and all analysis settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
