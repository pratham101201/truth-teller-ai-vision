
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ProfileData } from '@/hooks/useProfileData';

interface ProfileInformationProps {
  email: string;
  profileData: ProfileData;
  loading: boolean;
  onUpdateProfile: (data: ProfileData) => void;
  onChange: (data: Partial<ProfileData>) => void;
}

export const ProfileInformation = ({
  email,
  profileData,
  loading,
  onUpdateProfile,
  onChange,
}: ProfileInformationProps) => {
  const [localProfile, setLocalProfile] = useState<ProfileData>(profileData);
  const [isDirty, setIsDirty] = useState(false);
  
  // Update local state when profileData changes from parent
  useEffect(() => {
    console.log('ProfileData updated from parent:', profileData);
    setLocalProfile(profileData);
  }, [profileData]);
  
  // Handle form changes
  const handleChange = (field: keyof ProfileData, value: string) => {
    const updatedProfile = {
      ...localProfile,
      [field]: value
    };
    
    setLocalProfile(updatedProfile);
    onChange({ [field]: value });
  };

  // Check if there are actual changes
  useEffect(() => {
    const hasChanges = 
      localProfile.first_name !== profileData.first_name || 
      localProfile.last_name !== profileData.last_name;
    
    console.log('Change detection:', {
      localProfile,
      profileData,
      hasChanges
    });
    
    setIsDirty(hasChanges);
  }, [localProfile, profileData]);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-sm text-gray-500">Your email address cannot be changed</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName"
              value={localProfile.first_name || ''}
              onChange={(e) => handleChange('first_name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName"
              value={localProfile.last_name || ''}
              onChange={(e) => handleChange('last_name', e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={() => {
              console.log('Save button clicked with profile:', localProfile);
              onUpdateProfile(localProfile);
            }}
            disabled={loading || !isDirty}
            className="bg-truth-600 hover:bg-truth-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
