
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from 'lucide-react';
import { ProfileInformation } from '@/components/profile/ProfileInformation';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { useProfileData, ProfileData } from '@/hooks/useProfileData';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    profileData,
    loading,
    fetchProfile,
    updateProfile
  } = useProfileData(user?.id);
  
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    avatar_url: null
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
  }, [user, navigate, fetchProfile]);

  // Update local form state when profile data is loaded
  useEffect(() => {
    console.log('Profile data updated in Profile.tsx:', profileData);
    setFormData({
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      avatar_url: profileData.avatar_url
    });
  }, [profileData]);

  // Handle changes to profile fields
  const handleProfileChange = (data: Partial<ProfileData>) => {
    console.log('Profile change in Profile.tsx:', data);
    
    // Update the form data state with the changes
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Handle form submission
  const handleUpdateProfile = (data: ProfileData) => {
    console.log('Submitting update with data:', data);
    updateProfile(data);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
              <User className="h-8 w-8 mr-3 text-truth-600" />
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            </div>
            
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileInformation
                  email={user.email || ''}
                  profileData={formData}
                  loading={loading}
                  onUpdateProfile={handleUpdateProfile}
                  onChange={handleProfileChange}
                />
              </TabsContent>
              
              <TabsContent value="account">
                <AccountSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
