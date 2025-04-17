
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, Shield, AlertTriangle } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-sky-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full text-truth-600">
            <Shield className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">AI Deepfake Detection</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl">
            Verify media authenticity with <span className="text-truth-600">AI-powered</span> detection
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl">
            In a world of increasing digital manipulation, TruthTeller helps you 
            identify AI-generated deepfakes with cutting-edge technology.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="bg-truth-600 hover:bg-truth-700 text-white">
              Upload Media
            </Button>
            <Button size="lg" variant="outline" className="border-truth-300 text-truth-700">
              Learn More
            </Button>
          </div>
          
          <div className="pt-8 flex flex-col items-center">
            <div className="flex items-center gap-6 mb-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-verified-DEFAULT mr-2"></div>
                <span className="text-sm text-slate-700">Authentic</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-fake-DEFAULT mr-2"></div>
                <span className="text-sm text-slate-700">Manipulated</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-3 h-3 text-amber-500 mr-2" />
                <span className="text-sm text-slate-700">Uncertain</span>
              </div>
            </div>
            
            <a href="#upload" className="flex items-center text-truth-600 hover:text-truth-700 mt-8 animate-pulse-slow">
              <span className="mr-2">Get Started</span>
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
