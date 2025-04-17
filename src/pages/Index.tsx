
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import UploadSection from '../components/UploadSection';
import ResultsDisplay from '../components/ResultsDisplay';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import HeroBackground from '../components/HeroBackground';
import { AnalysisResult } from '@/types/types';

const Index = () => {
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
