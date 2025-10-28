import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-shrain-dark-gray rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;