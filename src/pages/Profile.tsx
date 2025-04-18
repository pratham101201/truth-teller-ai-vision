
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from 'lucide-react';

interface ProfileData {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
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
  }, [user, navigate]);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      try {
        // Use type assertion to bypass TypeScript type checking for Supabase
        const { data, error } = await (supabase
          .from('profiles') as any)
          .select('first_name, last_name, avatar_url')
          .eq('id', user?.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching profile:', error);
          // If the error is because the table doesn't exist, we'll just use the empty state
          // but we won't show an error message for this specific case
          if (!error.message.includes('relation "public.profiles" does not exist')) {
            toast({
              title: "Error loading profile",
              description: "There was a problem loading your profile information.",
              variant: "destructive",
            });
          }
        } else if (data) {
          setProfileData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            avatar_url: data.avatar_url
          });
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
        // Silently handle errors here - we'll just use the default empty state
      }
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async () => {
    try {
      setLoading(true);
      
      try {
        // Use type assertion to bypass TypeScript type checking for Supabase
        const { error } = await (supabase
          .from('profiles') as any)
          .upsert({ 
            id: user?.id,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            updated_at: new Date()
          });
        
        if (error) {
          console.error('Error updating profile:', error);
          // Special handling for "table doesn't exist" error
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
        }
      } catch (error) {
        console.error('Error in profile update:', error);
        toast({
          title: "Error updating profile",
          description: "There was a problem with the update operation.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in useEffect
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
                <Card className="p-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={user.email || ''}
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
                          onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={updateProfile}
                        disabled={loading}
                        className="bg-truth-600 hover:bg-truth-700"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="account">
                <Card className="p-6">
                  <h3 className="text-xl font-medium mb-4">Account Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
                      <h4 className="font-medium text-amber-800">Change Password</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        To change your password, please use the "Forgot Password" option on the login screen.
                      </p>
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          toast({
                            title: "Delete Account",
                            description: "This feature is not yet implemented.",
                          });
                        }}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>
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
