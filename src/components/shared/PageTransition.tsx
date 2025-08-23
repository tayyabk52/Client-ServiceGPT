import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  isTransitioning: boolean;
  onTransitionComplete: () => void;
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  isTransitioning, 
  onTransitionComplete, 
  children 
}) => {
  const [stage, setStage] = useState<'idle' | 'zooming' | 'sliding' | 'complete'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      setStage('zooming');
      
      // Stage 1: Luxury zoom with elegant timing
      setTimeout(() => {
        setStage('sliding');
      }, 1200);
      
      // Stage 2: Premium slide transition
      setTimeout(() => {
        setStage('complete');
        onTransitionComplete();
      }, 2800);
    }
  }, [isTransitioning, onTransitionComplete]);

  useEffect(() => {
    // Add custom 3D transition styles
    const style = document.createElement('style');
    style.textContent = `
      /* Luxury 3D Transition Effects */
      @keyframes luxuryZoom {
        0% {
          transform: perspective(1500px) scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px);
          filter: blur(0px) brightness(1) saturate(1);
          box-shadow: 0 0 0 rgba(59, 130, 246, 0);
        }
        50% {
          transform: perspective(1500px) scale(0.98) rotateX(-2deg) rotateY(1deg) translateZ(-20px);
          filter: blur(0.5px) brightness(0.95) saturate(1.1);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
        }
        100% {
          transform: perspective(1500px) scale(0.92) rotateX(-3deg) rotateY(2deg) translateZ(-60px);
          filter: blur(1px) brightness(0.85) saturate(1.2);
          box-shadow: 0 40px 100px rgba(59, 130, 246, 0.25);
        }
      }
      
      @keyframes luxurySlideOut {
        0% {
          transform: perspective(1500px) translateX(0%) translateZ(-60px) rotateY(2deg) scale(0.92);
          opacity: 1;
          filter: blur(1px) brightness(0.85) saturate(1.2);
        }
        30% {
          transform: perspective(1500px) translateX(-15%) translateZ(-120px) rotateY(-8deg) scale(0.85);
          opacity: 0.8;
          filter: blur(2px) brightness(0.7) saturate(1.3);
        }
        100% {
          transform: perspective(1500px) translateX(-100%) translateZ(-200px) rotateY(-25deg) scale(0.6);
          opacity: 0;
          filter: blur(5px) brightness(0.5) saturate(1.5);
        }
      }
      
      @keyframes luxurySlideIn {
        0% {
          transform: perspective(1500px) translateX(100%) translateZ(-200px) rotateY(25deg) scale(0.6);
          opacity: 0;
          filter: blur(5px) brightness(0.5) saturate(1.5);
        }
        30% {
          transform: perspective(1500px) translateX(15%) translateZ(-120px) rotateY(8deg) scale(0.85);
          opacity: 0.8;
          filter: blur(2px) brightness(0.7) saturate(1.3);
        }
        100% {
          transform: perspective(1500px) translateX(0%) translateZ(0px) rotateY(0deg) scale(1);
          opacity: 1;
          filter: blur(0px) brightness(1) saturate(1);
        }
      }
      
      @keyframes luxuryParticleFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg) scale(1);
          opacity: 0.3;
        }
        25% {
          transform: translateY(-20px) rotate(90deg) scale(1.2);
          opacity: 0.6;
        }
        50% {
          transform: translateY(-30px) rotate(180deg) scale(1.5);
          opacity: 0.8;
        }
        75% {
          transform: translateY(-20px) rotate(270deg) scale(1.2);
          opacity: 0.6;
        }
      }
      
      @keyframes luxuryGradientShift {
        0% {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8));
        }
        25% {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(59, 130, 246, 0.15), rgba(0, 0, 0, 0.7));
        }
        50% {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.6));
        }
        75% {
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.2), rgba(0, 0, 0, 0.7));
        }
        100% {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8));
        }
      }
      
      @keyframes particleFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
          opacity: 0.2;
        }
        50% {
          transform: translateY(-15px) rotate(180deg);
          opacity: 0.5;
        }
      }
      
      .transition-luxury-zoom {
        animation: luxuryZoom 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .transition-luxury-slide-out {
        animation: luxurySlideOut 1.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .transition-luxury-slide-in {
        animation: luxurySlideIn 1.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
      }
      
      .luxury-particle {
        animation: luxuryParticleFloat 6s ease-in-out infinite;
      }
      
      .luxury-gradient-bg {
        animation: luxuryGradientShift 8s ease-in-out infinite;
      }
      
      .particle-effect {
        animation: particleFloat 5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isTransitioning) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Advanced 3D Particle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Luxury particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              background: `radial-gradient(circle, ${
                ['rgba(59, 130, 246, 0.6)', 'rgba(147, 51, 234, 0.6)', 'rgba(236, 72, 153, 0.6)', 'rgba(168, 85, 247, 0.6)'][Math.floor(Math.random() * 4)]
              }, transparent)`,
              boxShadow: `0 0 ${12 + Math.random() * 20}px ${
                ['rgba(59, 130, 246, 0.4)', 'rgba(147, 51, 234, 0.4)', 'rgba(236, 72, 153, 0.4)', 'rgba(168, 85, 247, 0.4)'][Math.floor(Math.random() * 4)]
              }`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Light rays */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`ray-${i}`}
            className="absolute opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '1px',
              height: `${80 + Math.random() * 120}px`,
              background: `linear-gradient(to bottom, transparent, #3b82f6, transparent)`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animation: `particleFloat ${5 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Dynamic Transition Overlay with gradients */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          stage === 'zooming' ? 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black/20' :
          stage === 'sliding' ? 'bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-black/30' :
          stage === 'complete' ? 'bg-transparent' : 'bg-black/10'
        } backdrop-blur-sm ${
          stage === 'complete' ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Cinematic vignette effect */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          stage === 'complete' ? 'opacity-0' : 'opacity-40'
        }`}
        style={{
          background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.6) 100%)'
        }}
      />
      
      {/* Current Page with Luxury Effects */}
      <div 
        className={`absolute inset-0 ${
          stage === 'zooming' ? 'transition-luxury-zoom' : 
          stage === 'sliding' ? 'transition-luxury-slide-out' : 
          ''
        }`}
      >
        {children}
      </div>
      
      {/* New Page Preview with Luxury Theme */}
      {stage === 'sliding' && (
        <div className="absolute inset-0 transition-luxury-slide-in">
          <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Luxury gradient background */}
            <div className="absolute inset-0 luxury-gradient-bg"></div>
            
            {/* Premium floating elements */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute luxury-particle"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${20 + Math.random() * 60}%`,
                  width: `${8 + Math.random() * 12}px`,
                  height: `${8 + Math.random() * 12}px`,
                  background: `linear-gradient(45deg, ${
                    ['rgba(59, 130, 246, 0.4)', 'rgba(147, 51, 234, 0.4)', 'rgba(236, 72, 153, 0.4)'][Math.floor(Math.random() * 3)]
                  }, transparent)`,
                  borderRadius: '50%',
                  boxShadow: `0 0 ${8 + Math.random() * 16}px ${
                    ['rgba(59, 130, 246, 0.3)', 'rgba(147, 51, 234, 0.3)', 'rgba(236, 72, 153, 0.3)'][Math.floor(Math.random() * 3)]
                  }`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
            
            {/* Premium chat interface preview */}
            <div className="absolute inset-0 flex flex-col">
              {/* Luxury header preview */}
              <div className="backdrop-blur-2xl bg-gradient-to-r from-white/8 to-white/4 border-b border-white/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/30 shadow-lg"></div>
                    <div>
                      <div className="w-56 h-7 bg-gradient-to-r from-white/30 to-white/10 rounded-lg animate-pulse"></div>
                      <div className="w-40 h-5 bg-white/20 rounded mt-2 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400/50 to-purple-400/50 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Luxury message preview */}
              <div className="flex-1 p-6 space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-sm h-20 rounded-3xl backdrop-blur-xl shadow-2xl animate-pulse ${
                      i % 2 === 0 
                        ? 'bg-gradient-to-r from-white/15 to-white/5 border border-white/20' 
                        : 'bg-gradient-to-r from-blue-600/40 to-purple-600/40 border border-blue-400/30'
                    }`}></div>
                  </div>
                ))}
                
                {/* Luxury typing indicator */}
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl px-6 py-4 shadow-xl">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-lg"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTransition;
