
import React from 'react';
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
              value={profileData.first_name}
              onChange={(e) => onChange({ first_name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName"
              value={profileData.last_name}
              onChange={(e) => onChange({ last_name: e.target.value })}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={() => onUpdateProfile(profileData)}
            disabled={loading}
            className="bg-truth-600 hover:bg-truth-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
