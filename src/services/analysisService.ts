import { AnalysisRequest, AnalysisResult } from '../types/types';

// This simulates API endpoints for deepfake detection
// In a real implementation, this would make actual API calls to a Python backend
export const AnalysisService = {
  // Analyze media function that returns a promise with the result
  analyzeMedia: async (request: AnalysisRequest): Promise<AnalysisResult> => {
    console.log('Analyzing media with options:', request);
    
    // Simulate network delay based on analysis type
    const delayTime = request.analysisType === 'quick' ? 1000 : 
                      request.analysisType === 'enhanced' ? 4000 : 2000;
    
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
        
        // Adjust probability based on sensitivity level
        let deepfakeProbability = deterministicFactor;
        if (request.sensitivityLevel === 'high') {
          deepfakeProbability = deterministicFactor * 1.5; // More likely to detect as deepfake
        } else if (request.sensitivityLevel === 'low') {
          deepfakeProbability = deterministicFactor * 0.7; // Less likely to detect as deepfake
        }
        
        const isDeepfake = deepfakeProbability > 0.5;
        
        // Calculate confidence with more natural distribution
        const baseConfidence = (deterministicFactor * 0.5) + 0.5; // Between 0.5 and 1.0
        const confidenceScore = isDeepfake 
          ? baseConfidence
          : 1 - (baseConfidence * 0.5); // Higher confidence for authentic media
        
        // Generate detection areas with more realistic patterns
        let detectionAreas = undefined;
        if (isDeepfake) {
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
        
        // More detailed analysis messages
        const detectionFeatures = isDeepfake ? 
          ['facial_inconsistency', 'unnatural_lighting', 'blink_pattern']
            .slice(0, Math.floor(deterministicFactor * 3) + 1) : 
          undefined;
        
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
          analysisTime: (Math.random() * 1.5) + (delayTime / 1000),
          message,
          analysisId: `analysis-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString(),
          modelVersion: "deepfake-detector-v1.2.0",
          detectionFeatures: isDeepfake ? detectionFeatures : undefined,
        });
      }, delayTime);
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
  }
};
