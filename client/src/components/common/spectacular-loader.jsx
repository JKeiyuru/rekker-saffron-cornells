/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect } from 'react';

const SpectacularLoader = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Preparing your experience');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const textInterval = setInterval(() => {
      const texts = [
        'Preparing your experience',
        'Loading excellence',
        'Crafting perfection',
        'Almost there'
      ];
      setLoadingText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-950 via-red-950 to-slate-950">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-red-500/20 to-rose-500/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo area with sophisticated animation */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 -m-8">
            <div className="w-32 h-32 border-2 border-red-500/30 rounded-full animate-spin-slow" />
          </div>
          
          {/* Middle pulsing ring */}
          <div className="absolute inset-0 -m-6">
            <div className="w-28 h-28 border-2 border-rose-500/50 rounded-full animate-pulse" />
          </div>

          {/* Logo container */}
          <div className="relative w-16 h-16 bg-gradient-to-br from-red-600 via-rose-600 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/50 animate-float">
            <span className="text-white font-bold text-3xl tracking-wider">R</span>
            
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shine" />
          </div>

          {/* Inner glowing ring */}
          <div className="absolute inset-0 -m-4">
            <div className="w-24 h-24 border border-red-400/60 rounded-full animate-ping-slow" />
          </div>
        </div>

        {/* Brand name with elegant reveal */}
        <div className="flex flex-col items-center space-y-2 overflow-hidden">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-red-400 animate-gradient-x tracking-wider">
            REKKER
          </h1>
          <p className="text-sm text-red-200/60 tracking-widest uppercase animate-fade-in">
            Quality · Trust · Excellence
          </p>
        </div>

        {/* Progress bar with sophisticated design */}
        <div className="w-80 space-y-3">
          <div className="relative h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            
            {/* Progress fill */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-full transition-all duration-300 ease-out shadow-lg shadow-red-500/50"
              style={{ width: `${progress}%` }}
            >
              {/* Glowing tip */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse" />
            </div>
          </div>

          {/* Loading text and percentage */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-red-200/80 animate-pulse">{loadingText}</span>
            <span className="text-red-300 font-semibold tabular-nums">{progress}%</span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-red-400 to-rose-400 animate-bounce"
              style={{
                animationDelay: `${i * 0.16}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/50 pointer-events-none" />

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.4;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(200%) rotate(45deg);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .bg-radial-gradient {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default SpectacularLoader;