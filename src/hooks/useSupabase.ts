
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalysisResult } from '@/types/types';
import { toast } from '@/components/ui/use-toast';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAnalysisResult = async (result: AnalysisResult) => {
    setLoading(true);
    setError(null);

    try {
      // First get the user ID
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      // Extract the properties needed for the analysis_results table
      const analysisData = {
        is_deepfake: result.isDeepfake,
        confidence_score: result.confidenceScore,
        detection_areas: result.detectionAreas || null,
        analysis_time: result.analysisTime,
        message: result.message,
        model_version: result.modelVersion || null,
        detection_features: result.detectionFeatures || null,
        technique_used: result.techniqueUsed || null,
        media_metadata: result.mediaMetadata || null,
        user_id: userId || null
      };

      const { data, error } = await supabase
        .from('analysis_results')
        .insert([analysisData]);

      if (error) throw error;
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error Saving Result',
        description: errorMessage,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    saveAnalysisResult,
    loading,
    error
  };
};
