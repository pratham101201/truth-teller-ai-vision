
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export const AccountSettings = () => {
  return (
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
  );
};
