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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleAnalysisComplete = (result: AnalysisResult, file: File) => {
    setAnalysisResult(result);
    setAnalyzedFile(file);
    
    if (!filePreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

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
      
      {!user && (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Unlock All Features</h2>
          <p className="mb-4 text-gray-600 max-w-2xl mx-auto">
            Create an account to save your analysis history, access advanced features, and more.
          </p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-truth-600 hover:bg-truth-700"
          >
            Sign Up Now
          </Button>
        </div>
      )}
      
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
