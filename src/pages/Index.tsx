
import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import UploadSection from '../components/UploadSection';
import ResultsDisplay from '../components/results';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import HeroBackground from '../components/HeroBackground';
import { AnalysisResult } from '@/types/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult, file: File) => {
    setAnalysisResult(result);
    setAnalyzedFile(file);
    
    // If we don't already have a file preview, create one
    if (!filePreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Scroll to results
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setAnalyzedFile(null);
    setFilePreview(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {user ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Welcome, {user.email}</h2>
            <p>You are currently logged in.</p>
            {session && (
              <div className="mt-4">
                <p>Session Details:</p>
                <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
            <Button onClick={() => navigate('/auth')}>
              Go to Login/Signup
            </Button>
          </div>
        )}
      </div>
      
      <div className="relative overflow-hidden">
        <HeroBackground />
        {analysisResult && analyzedFile && filePreview ? (
          <ResultsDisplay 
            result={analysisResult} 
            mediaFile={analyzedFile}
            mediaPreview={filePreview}
            onReset={resetAnalysis}
          />
        ) : (
          <>
            <Hero />
            <UploadSection onAnalysisComplete={handleAnalysisComplete} />
          </>
        )}
      </div>
      
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
