
import { AnalysisResult, AnalysisRequest } from '../types/types';
import { AnalysisService } from '../services/analysisService';

// This is a mock function that simulates an API call for analyzing deepfakes
export const analyzeMedia = (file: File): Promise<AnalysisResult> => {
  // Create a standard request with default options
  const request: AnalysisRequest = {
    file,
    analysisType: "standard",
    sensitivityLevel: "medium"
  };
  
  // Use the analysis service to process the request
  return AnalysisService.analyzeMedia(request);
};

