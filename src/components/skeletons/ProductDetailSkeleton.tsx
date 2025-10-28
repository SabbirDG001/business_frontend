import React from 'react';

const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-pulse">
      <div>
        <div className="w-full rounded-lg bg-gray-300 dark:bg-gray-700 h-[500px] mb-4"></div>
        <div className="flex space-x-2">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
      <div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-3 mb-8">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-md w-48"></div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;