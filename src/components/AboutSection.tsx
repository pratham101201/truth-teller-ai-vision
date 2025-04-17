
import React from 'react';
import { Card } from "@/components/ui/card";
import { Shield, Zap, Lock, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Shield className="h-10 w-10 text-truth-500" />,
    title: "AI-Powered Analysis",
    description: "Our advanced algorithms can detect subtle indicators of manipulation that might be invisible to the human eye."
  },
  {
    icon: <Zap className="h-10 w-10 text-truth-500" />,
    title: "Fast Results",
    description: "Get analysis results in seconds, not minutes, allowing you to quickly verify media authenticity."
  },
  {
    icon: <Lock className="h-10 w-10 text-truth-500" />,
    title: "Privacy First",
    description: "Your uploads are processed securely and never stored on our servers once analysis is complete."
  },
  {
    icon: <Sparkles className="h-10 w-10 text-truth-500" />,
    title: "Cutting-Edge Tech",
    description: "Our detection models are constantly trained on the latest deepfake techniques to stay ahead of manipulators."
  }
];

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-slate-50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Why TruthTeller?</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            In a world where AI-generated media is increasingly sophisticated, 
            verifying authenticity is more important than ever.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div id="how-it-works" className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">How It Works</h2>
          
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-truth-100 hidden md:block"></div>
            
            <div className="space-y-12">
              <div className="md:flex items-center">
                <div className="md:w-1/2 p-4 text-right md:pr-10">
                  <h3 className="text-xl font-bold text-truth-800 mb-2">Upload</h3>
                  <p className="text-slate-600">Upload an image or video that you want to analyze for potential AI manipulation.</p>
                </div>
                <div className="mx-auto md:mx-0 w-10 h-10 rounded-full bg-truth-500 text-white flex items-center justify-center z-10 relative mb-4 md:mb-0">1</div>
                <div className="md:w-1/2 p-4 md:pl-10">
                  <Card className="overflow-hidden">
                    <div className="bg-slate-100 p-4 aspect-video flex items-center justify-center">
                      <Shield className="h-8 w-8 text-truth-300" />
                    </div>
                  </Card>
                </div>
              </div>
              
              <div className="md:flex items-center">
                <div className="md:w-1/2 p-4 md:order-2 md:pl-10">
                  <h3 className="text-xl font-bold text-truth-800 mb-2">Analysis</h3>
                  <p className="text-slate-600">Our AI models scan the media for indicators of manipulation, from inconsistent lighting to pixel-level anomalies.</p>
                </div>
                <div className="mx-auto md:mx-0 w-10 h-10 rounded-full bg-truth-500 text-white flex items-center justify-center z-10 relative mb-4 md:mb-0">2</div>
                <div className="md:w-1/2 p-4 md:order-1 md:pr-10 text-right">
                  <Card className="overflow-hidden">
                    <div className="bg-slate-100 p-4 aspect-video flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-truth-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div className="md:flex items-center">
                <div className="md:w-1/2 p-4 text-right md:pr-10">
                  <h3 className="text-xl font-bold text-truth-800 mb-2">Results</h3>
                  <p className="text-slate-600">Get a detailed report with confidence scores and highlighted areas of concern if manipulation is detected.</p>
                </div>
                <div className="mx-auto md:mx-0 w-10 h-10 rounded-full bg-truth-500 text-white flex items-center justify-center z-10 relative mb-4 md:mb-0">3</div>
                <div className="md:w-1/2 p-4 md:pl-10">
                  <Card className="overflow-hidden">
                    <div className="bg-slate-100 p-4 aspect-video flex items-center justify-center">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="faq" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">How accurate is the deepfake detection?</h3>
              <p className="text-slate-600">Our technology achieves 95%+ accuracy on benchmark datasets. However, as deepfake technology evolves, we continuously update our models to maintain high accuracy.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">What types of manipulations can you detect?</h3>
              <p className="text-slate-600">We can detect facial swaps, synthetic faces, manipulated expressions, voice deepfakes, and various other forms of media manipulation created using AI tools.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Is my data secure?</h3>
              <p className="text-slate-600">Yes. We process all media on secure servers and delete all uploads after analysis is complete. We never store your media for longer than necessary to complete analysis.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I use this for verification in legal proceedings?</h3>
              <p className="text-slate-600">While our technology is highly accurate, for critical legal uses we recommend requesting a certified analysis from our professional services team which includes a detailed report suitable for legal contexts.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
