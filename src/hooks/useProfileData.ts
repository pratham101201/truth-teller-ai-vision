
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export interface ProfileData {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export const useProfileData = (userId: string | undefined) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    avatar_url: null
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (error && !error.message.includes('relation "public.profiles" does not exist')) {
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile information.",
          variant: "destructive",
        });
      } else if (data) {
        setProfileData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newData: Partial<ProfileData>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId,
          ...newData,
          updated_at: new Date()
        });

      if (error) {
        if (error.message.includes('relation "public.profiles" does not exist')) {
          toast({
            title: "Database setup required",
            description: "The profiles table needs to be created. Please follow the setup instructions.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error updating profile",
            description: "There was a problem updating your profile.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        setProfileData(prev => ({ ...prev, ...newData }));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    profileData,
    setProfileData,
    loading,
    fetchProfile,
    updateProfile
  };
};
