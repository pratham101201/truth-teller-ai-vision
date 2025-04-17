
import { AnalysisResult, AnalysisRequest } from '../types/types';
import { AnalysisService } from '../services/analysisService';

// This is a mock function that simulates an API call for analyzing deepfakes
export const analyzeMedia = (file: File, options: Partial<AnalysisRequest> = {}): Promise<AnalysisResult> => {
  // Create a request with default options that can be overridden
  const request: AnalysisRequest = {
    file,
    analysisType: options.analysisType || "standard",
    sensitivityLevel: options.sensitivityLevel || "medium",
    detectRegions: options.detectRegions !== undefined ? options.detectRegions : true,
    prioritizeAccuracy: options.prioritizeAccuracy || false
  };
  
  // Use the analysis service to process the request
  return AnalysisService.analyzeMedia(request);
};

// Function to get analysis history (for future implementation)
export const getAnalysisHistory = (): Promise<AnalysisResult[]> => {
  return AnalysisService.getAnalysisHistory();
};

// Function to get analysis statistics (for future implementation)
export const getAnalysisStats = () => {
  return AnalysisService.getAnalysisStats();
};
