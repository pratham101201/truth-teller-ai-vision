
import React, { createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';

interface SupabaseContextType {
  supabase: typeof supabase;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseClient = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabaseClient must be used within a SupabaseProvider');
  }
  return context.supabase;
};
