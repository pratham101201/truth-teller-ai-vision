
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      if (!userId) return;
      
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile information.",
          variant: "destructive",
        });
      } else if (data) {
        console.log('Profile data loaded:', data);
        setProfileData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          avatar_url: data.avatar_url
        });
      } else {
        console.log('No profile data found for user');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newData: Partial<ProfileData>) => {
    try {
      setLoading(true);
      if (!userId) return;
      
      console.log('Updating profile with data:', newData);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId,
          ...newData,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error updating profile",
          description: "There was a problem updating your profile.",
          variant: "destructive",
        });
      } else {
        console.log('Profile updated successfully');
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        
        // Update local state with the new data
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
