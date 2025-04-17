
import { AnalysisResult } from '../types/types';

// This is a mock function that simulates an API call for analyzing deepfakes
export const analyzeMedia = (file: File): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Generate random result for demonstration purposes
      const isDeepfake = Math.random() > 0.5;
      const confidenceScore = Math.round(Math.random() * 100) / 100;
      
      let detectionAreas = undefined;
      if (isDeepfake) {
        // Generate random detection areas if marked as deepfake
        detectionAreas = Array(Math.floor(Math.random() * 3) + 1)
          .fill(null)
          .map(() => ({
            x: Math.random() * 0.8,
            y: Math.random() * 0.8,
            width: Math.random() * 0.2 + 0.1,
            height: Math.random() * 0.2 + 0.1,
          }));
      }

      resolve({
        isDeepfake,
        confidenceScore,
        detectionAreas,
        analysisTime: Math.random() * 3 + 0.5, // Between 0.5 and 3.5 seconds
        message: isDeepfake 
          ? "Our AI has detected signs of manipulation in this media." 
          : "Our analysis indicates this media is likely authentic.",
      });
    }, 2000); // 2 second delay to simulate processing
  });
};
