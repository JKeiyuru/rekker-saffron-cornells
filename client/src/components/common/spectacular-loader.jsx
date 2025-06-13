/* eslint-disable react/no-unknown-property */
import React from 'react';

const SpectacularLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="w-32 h-32 border-2 border-transparent border-t-cyan-400 border-r-cyan-400 rounded-full animate-spin-slow">
          {/* Inner pulsing core */}
          <div className="absolute inset-4 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse-glow">
            {/* Center dot */}
            <div className="absolute inset-6 bg-white rounded-full animate-bounce-gentle flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Orbiting elements */}
        <div className="absolute inset-0 animate-spin-reverse">
          <div className="absolute -top-2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
          <div className="absolute top-1/2 -right-2 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-x-1/2 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 -left-2 w-2 h-2 bg-purple-400 rounded-full transform -translate-y-1/2 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Loading text */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, i) => (
              <span
                key={i}
                className="text-white text-lg font-light animate-bounce"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.5s'
                }}
              >
                {letter}
              </span>
            ))}
            <div className="flex space-x-1 ml-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '1s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.2; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
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
            box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(34, 211, 238, 0.8);
          }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 4s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SpectacularLoader;