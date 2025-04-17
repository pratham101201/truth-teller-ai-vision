
export interface AnalysisResult {
  isDeepfake: boolean;
  confidenceScore: number;
  detectionAreas?: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  analysisTime: number;
  message: string;
  analysisId?: string; // For future database integration
  timestamp?: string; // For future database integration
  modelVersion?: string; // For future AI model versioning
  detectionFeatures?: string[]; // What specific features were analyzed (eyes, mouth, etc.)
  techniqueUsed?: string; // What type of detection technique was used
  mediaMetadata?: {
    dimensions?: { width: number; height: number };
    duration?: number; // For videos
    format?: string;
    frameRate?: number; // For videos
  };
}

export interface AnalysisRequest {
  file: File;
  analysisType?: "standard" | "enhanced" | "quick";
  sensitivityLevel?: "low" | "medium" | "high";
  detectRegions?: boolean; // Whether to detect specific regions
  prioritizeAccuracy?: boolean; // Whether to prioritize accuracy over speed
}

export type FileType = 'image' | 'video' | null;

export interface AnalysisStats {
  totalAnalyzed: number;
  deepfakesDetected: number;
  averageConfidence: number;
  averageAnalysisTime: number;
}
