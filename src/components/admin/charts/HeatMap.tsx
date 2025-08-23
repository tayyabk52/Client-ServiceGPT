import React from 'react';

interface HeatMapProps {
  data: { x: number; y: number; value: number; location: string }[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
        {/* Mock US Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Simplified US map outline */}
            <path
              d="M50,50 L350,50 L350,150 L50,150 Z"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            {/* State boundaries (simplified) */}
            <g stroke="rgba(255,255,255,0.1)" strokeWidth="1">
              <line x1="100" y1="50" x2="100" y2="150" />
              <line x1="150" y1="50" x2="150" y2="150" />
              <line x1="200" y1="50" x2="200" y2="150" />
              <line x1="250" y1="50" x2="250" y2="150" />
              <line x1="300" y1="50" x2="300" y2="150" />
              <line x1="50" y1="80" x2="350" y2="80" />
              <line x1="50" y1="110" x2="350" y2="110" />
            </g>
          </svg>
        </div>
        
        {/* Heat Map Data Points */}
        <div className="absolute inset-0">
          {data.map((point, index) => {
            const intensity = point.value / maxValue;
            const size = 20 + (intensity * 30);
            const opacity = 0.3 + (intensity * 0.7);
            
            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: `rgba(59, 130, 246, ${opacity})`,
                  boxShadow: `0 0 ${size}px rgba(59, 130, 246, ${opacity * 0.5})`,
                }}
                title={`${point.location}: ${point.value} searches`}
              />
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs text-white mb-2">Search Volume</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Low</span>
              <div className="w-16 h-2 bg-gradient-to-r from-blue-500/30 to-blue-500 rounded"></div>
              <span className="text-xs text-gray-400">High</span>
            </div>
          </div>
        </div>
        
        {/* Sample Data Labels */}
        <div className="absolute top-4 left-4">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
            <div className="text-xs text-white font-semibold mb-2">Top Regions</div>
            {data.slice(0, 3).map((point, index) => (
              <div key={index} className="text-xs text-gray-300 mb-1">
                {point.location}: {point.value} searches
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
