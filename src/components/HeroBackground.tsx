
import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-truth-50 to-white opacity-80"></div>
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-truth-100 rounded-full blur-3xl opacity-30 -translate-y-1/4 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-truth-200 rounded-full blur-3xl opacity-20 translate-y-1/4 -translate-x-1/3"></div>
    </div>
  );
};

export default HeroBackground;
