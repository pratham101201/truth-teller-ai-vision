
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
      const { data, error } = await supabase
        .from('analysis_results')
        .insert([result]);

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
