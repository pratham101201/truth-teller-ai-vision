
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="w-full py-4 border-b border-slate-200 bg-white">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-truth-600" />
          <span className="font-bold text-xl text-truth-900">TruthTeller</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#about" className="text-slate-700 hover:text-truth-600 transition-colors">
            About
          </a>
          <a href="#how-it-works" className="text-slate-700 hover:text-truth-600 transition-colors">
            How It Works
          </a>
          <a href="#faq" className="text-slate-700 hover:text-truth-600 transition-colors">
            FAQ
          </a>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button className="bg-truth-600 hover:bg-truth-700 text-white">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
