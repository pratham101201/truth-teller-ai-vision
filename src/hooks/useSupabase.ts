
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnalysisResult } from '@/types/types';

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
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
