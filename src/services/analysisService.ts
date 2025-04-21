
import { AnalysisRequest, AnalysisResult, AnalysisStats } from '../types/types';

// This simulates API endpoints for deepfake detection
// In a real implementation, this would make actual API calls to a Python backend
export const AnalysisService = {
  // Analyze media function that returns a promise with the result
  analyzeMedia: async (request: AnalysisRequest): Promise<AnalysisResult> => {
    console.log('Analyzing media with options:', request);
    
    // Simulate network delay based on analysis type
    const delayTime = request.analysisType === 'quick' ? 1000 : 
                      request.analysisType === 'enhanced' ? 4000 : 2000;
    
    // Add more delay if prioritizing accuracy
    const totalDelay = request.prioritizeAccuracy ? delayTime * 1.5 : delayTime;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate deterministic but seemingly random result based on file properties
        // This allows same file to get same result, simulating consistent AI behavior
        const fileNameSum = Array.from(request.file.name).reduce(
          (sum, char) => sum + char.charCodeAt(0), 0
        );
        const fileSizeModifier = (request.file.size % 100000) / 100000;
        
        // Combine factors for a deterministic "random" number between 0-1
        const deterministicFactor = (fileNameSum / 1000 + fileSizeModifier) % 1;
        
        // Adjust probability based on sensitivity level and analysis type
        let deepfakeProbability = deterministicFactor;
        
        // Apply sensitivity level adjustment
        if (request.sensitivityLevel === 'high') {
          deepfakeProbability = deterministicFactor * 1.3; // Less aggressive multiplier
        } else if (request.sensitivityLevel === 'low') {
          deepfakeProbability = deterministicFactor * 0.7; // Less likely to detect as deepfake
        }
        
        // Enhanced analysis should be more accurate, not just more likely to detect deepfakes
        // So for enhanced analysis, make the probability closer to its true value (0 or 1)
        if (request.analysisType === 'enhanced') {
          if (deepfakeProbability > 0.5) {
            // If likely a deepfake, make more confident but don't always max out
            deepfakeProbability = 0.7 + (deepfakeProbability * 0.3);
          } else {
            // If likely authentic, make more confident in authenticity
            deepfakeProbability = deepfakeProbability * 0.7;
          }
        }
        
        // If prioritizing accuracy, increase confidence in the result, not the likelihood
        if (request.prioritizeAccuracy) {
          if (deepfakeProbability > 0.5) {
            deepfakeProbability = Math.min(0.95, deepfakeProbability * 1.2);
          } else {
            deepfakeProbability = Math.max(0.05, deepfakeProbability * 0.8);
          }
        }
        
        const isDeepfake = deepfakeProbability > 0.5;
        
        // Calculate confidence with more natural distribution
        // Ensure confidence is high for both authentic and fake results
        const confidenceScore = isDeepfake 
          ? 0.5 + (deepfakeProbability - 0.5) * 2 // Scale 0.5-1 to 0.5-1
          : 0.5 + (0.5 - deepfakeProbability) * 2; // Scale 0-0.5 to 1-0.5
        
        // Generate detection areas with more realistic patterns if requested
        let detectionAreas = undefined;
        if (isDeepfake && request.detectRegions !== false) {
          // For images, focus on face areas (eyes, mouth, etc.)
          const faceAreasCount = request.file.type.startsWith('image/') ? 
                                Math.floor(deterministicFactor * 3) + 1 : 1;
          
          // Create face-focused detection areas
          detectionAreas = Array(faceAreasCount)
            .fill(null)
            .map((_, index) => {
              if (index === 0) {
                // First area is usually around eyes
                return {
                  x: 0.3 + (deterministicFactor * 0.1),
                  y: 0.2 + (deterministicFactor * 0.1),
                  width: 0.4,
                  height: 0.15,
                };
              } else if (index === 1) {
                // Second area often around mouth
                return {
                  x: 0.3 + (deterministicFactor * 0.1),
                  y: 0.5 + (deterministicFactor * 0.1),
                  width: 0.4,
                  height: 0.15,
                };
              } else {
                // Other areas more random
                return {
                  x: deterministicFactor * 0.6,
                  y: deterministicFactor * 0.6,
                  width: 0.2 + (deterministicFactor * 0.1),
                  height: 0.2 + (deterministicFactor * 0.1),
                };
              }
            });
        }
        
        // More detailed analysis features and techniques
        const detectionFeatures = isDeepfake ? 
          ['facial_inconsistency', 'unnatural_lighting', 'blink_pattern', 'edge_artifacts', 'noise_pattern']
            .slice(0, Math.floor(deterministicFactor * 5) + 1) : 
          undefined;
          
        const techniqueUsed = isDeepfake ?
          `CNN-based anomaly detection${request.analysisType === 'enhanced' ? ' with frequency domain analysis' : ''}` :
          undefined;
        
        // Generate media metadata
        const mediaMetadata = {
          dimensions: request.file.type.startsWith('image/') ? 
            { width: 1000 + Math.floor(deterministicFactor * 1000), height: 800 + Math.floor(deterministicFactor * 600) } :
            { width: 1920, height: 1080 },
          format: request.file.type,
          duration: request.file.type.startsWith('video/') ? 15 + Math.floor(deterministicFactor * 45) : undefined,
          frameRate: request.file.type.startsWith('video/') ? 24 + Math.floor(deterministicFactor * 6) : undefined,
        };
        
        const message = isDeepfake 
          ? `Our AI has detected ${detectionAreas?.length || 'several'} areas with signs of manipulation${
              detectionFeatures ? ` including ${detectionFeatures.join(', ').replace(/_/g, ' ')}` : ''
            }.` 
          : `Our analysis indicates this media is likely authentic with ${Math.round(confidenceScore * 100)}% confidence.`;
        
        // Mock result with additional metadata
        resolve({
          isDeepfake,
          confidenceScore,
          detectionAreas,
          analysisTime: (Math.random() * 1.5) + (totalDelay / 1000),
          message,
          analysisId: `analysis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          modelVersion: `deepfake-detector-v${request.analysisType === 'enhanced' ? '2.1.0' : '1.2.0'}`,
          detectionFeatures: isDeepfake ? detectionFeatures : undefined,
          techniqueUsed: techniqueUsed,
          mediaMetadata: mediaMetadata,
        });
      }, totalDelay);
    });
  },
  
  // Simulate retrieving analysis history (for future implementation)
  getAnalysisHistory: async (): Promise<AnalysisResult[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In the future, this would retrieve history from the database
        resolve([]);
      }, 500);
    });
  },
  
  // Simulate retrieving analysis statistics (for future implementation)
  getAnalysisStats: async (): Promise<AnalysisStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalAnalyzed: Math.floor(Math.random() * 10000) + 500,
          deepfakesDetected: Math.floor(Math.random() * 300) + 100,
          averageConfidence: 0.78 + (Math.random() * 0.1),
          averageAnalysisTime: 2.3 + (Math.random() * 0.5)
        });
      }, 300);
    });
  }
};
