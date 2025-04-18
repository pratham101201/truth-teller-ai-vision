
import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { AnalysisResult } from '@/types/types';
import { toast } from '@/components/ui/use-toast';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAnalysisResult = async (result: AnalysisResult) => {
    setLoading(true);
    setError(null);

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Please add your Supabase credentials to the environment variables.');
      toast({
        title: 'Supabase Not Configured',
        description: 'This is a development preview. Connect your Supabase project to enable data storage.',
        variant: 'destructive',
      });
      setLoading(false);
      return null;
    }

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
    error,
    isConfigured: isSupabaseConfigured()
  };
};
