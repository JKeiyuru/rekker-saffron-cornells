/* eslint-disable react/no-unknown-property */
import React from 'react';

const SpectacularLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-950 via-rose-900 to-red-950 flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-red-400 rounded-full opacity-20"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative z-10">
        {/* Hexagon container with rotating rings */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Outer hexagon ring */}
          <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#f43f5e', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <polygon 
              points="50,10 90,30 90,70 50,90 10,70 10,30" 
              fill="none" 
              stroke="url(#grad1)" 
              strokeWidth="2"
              className="animate-pulse-stroke"
            />
          </svg>

          {/* Middle rotating ring */}
          <svg className="absolute w-4/5 h-4/5 animate-spin-reverse" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="35" 
              fill="none" 
              stroke="#f43f5e" 
              strokeWidth="2"
              strokeDasharray="10 5"
              className="animate-dash"
            />
          </svg>

          {/* Inner pulsing circle */}
          <div className="absolute w-24 h-24 bg-gradient-to-br from-red-600 to-rose-600 rounded-full animate-pulse-glow flex items-center justify-center">
            {/* Rekker Logo - Animated R */}
            <div className="relative">
              <span className="text-white font-bold text-5xl animate-scale-bounce">R</span>
              {/* Glowing effect behind R */}
              <div className="absolute inset-0 text-white font-bold text-5xl blur-md opacity-50 animate-pulse">R</div>
            </div>
          </div>

          {/* Orbiting dots */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-red-400 rounded-full animate-pulse"
              style={{
                left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 85}px)`,
                top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 85}px)`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Brand name with animated letters */}
        <div className="mt-16 flex justify-center space-x-1">
          {['R', 'E', 'K', 'K', 'E', 'R'].map((letter, i) => (
            <span
              key={i}
              className="text-white text-3xl font-extrabold tracking-wider animate-wave"
              style={{
                animationDelay: `${i * 0.1}s`,
                textShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Loading text */}
        <div className="mt-6 flex justify-center items-center space-x-2">
          <span className="text-red-200 text-sm font-medium tracking-widest">LOADING</span>
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Subtitle */}
        <div className="mt-3 text-center">
          <p className="text-red-300 text-xs tracking-wider animate-fade-in">
            Quality Products, Trusted Brands
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-64 h-1 bg-red-950 rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 animate-progress-bar"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 0.2; 
          }
          50% { 
            transform: translate(20px, -30px) scale(1.2); 
            opacity: 0.4; 
          }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.6),
                        0 0 60px rgba(220, 38, 38, 0.4),
                        inset 0 0 20px rgba(244, 63, 94, 0.3);
          }
          50% { 
            transform: scale(1.08);
            box-shadow: 0 0 50px rgba(220, 38, 38, 0.8),
                        0 0 100px rgba(220, 38, 38, 0.6),
                        inset 0 0 30px rgba(244, 63, 94, 0.5);
          }
        }
        
        @keyframes scale-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        @keyframes wave {
          0%, 100% { 
            transform: translateY(0px);
            opacity: 1;
          }
          50% { 
            transform: translateY(-10px);
            opacity: 0.7;
          }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes progress-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-stroke {
          0%, 100% { 
            stroke-opacity: 1;
            stroke-width: 2;
          }
          50% { 
            stroke-opacity: 0.5;
            stroke-width: 3;
          }
        }

        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-scale-bounce {
          animation: scale-bounce 2s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 2s ease-in-out infinite;
        }

        .animate-progress-bar {
          animation: progress-bar 2s ease-in-out infinite;
        }

        .animate-pulse-stroke {
          animation: pulse-stroke 2s ease-in-out infinite;
        }

        .animate-dash {
          animation: dash 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SpectacularLoader;