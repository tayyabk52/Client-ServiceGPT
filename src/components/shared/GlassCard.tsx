import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'premium' | 'elevated';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return 'bg-white border border-gray-200 shadow-lg';
      case 'elevated':
        return 'bg-white border border-gray-200 shadow-xl';
      default:
        return 'bg-white border border-gray-200 shadow-md';
    }
  };

  const hoverStyles = hover ? 'hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300' : '';

  return (
    <div
      className={`
        ${getVariantStyles()}
        ${hoverStyles}
        rounded-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
