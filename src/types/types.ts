
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
}

export type FileType = 'image' | 'video' | null;
