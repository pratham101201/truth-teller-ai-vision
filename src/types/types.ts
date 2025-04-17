
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
}

export interface AnalysisRequest {
  file: File;
  analysisType?: "standard" | "enhanced" | "quick";
  sensitivityLevel?: "low" | "medium" | "high";
}

export type FileType = 'image' | 'video' | null;

