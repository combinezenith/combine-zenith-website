import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 1, className = '' }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse rounded-lg shadow-lg ${className}`}
          style={{
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)', // Purple glow
            animation: 'glow 2s ease-in-out infinite alternate',
          }}
        >
          <div className="p-4">
            <div className="h-4 bg-gray-600 rounded mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes glow {
          from {
            box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
          }
          to {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
          }
        }
      `}</style>
    </>
  );
};

export default SkeletonLoader;
