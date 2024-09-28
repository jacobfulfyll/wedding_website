import React from 'react';

const CircularFramedImage = ({ src, alt, size = 'md', className = '', aspectRatio = '4/3' }) => {
  const sizeClasses = {
    sm: 'w-32 h-24',
    md: 'w-44 h-32',
    lg: 'w-64 h-48',
    xl: 'w-86 h-64',
    xxl: 'w-108 h-80',
    xxxl: 'w-128 h-96',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 rounded-full overflow-hidden" style={{ aspectRatio }}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 rounded-full"></div>
        <div className="absolute inset-1 bg-gradient-to-tl from-amber-600 via-amber-700 to-amber-800 rounded-full"></div>
        <div className="absolute inset-2 rounded-full overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default CircularFramedImage;