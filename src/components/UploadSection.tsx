
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Image, Video, X, Loader2 } from 'lucide-react';
import { FileType } from '@/types/types';
import { analyzeMedia } from '@/utils/mockAnalysis';

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
      const result = await analyzeMedia(file);
      
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);
      
      // Small delay to show 100% before completing
      setTimeout(() => {
        onAnalysisComplete(result, file);
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
    <section id="upload" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Detect Deepfakes</h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Upload an image or video to analyze it for signs of AI manipulation.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto p-6">
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
                    <span>Analyzing...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ) : (
                <Button 
                  className="w-full bg-truth-600 hover:bg-truth-700" 
                  onClick={handleAnalyze}
                >
                  Analyze for Deepfakes
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default UploadSection;
