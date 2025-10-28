import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-20">
      <h1 className="text-6xl font-bold text-shrain-purple font-serif">404</h1>
      <h2 className="text-3xl font-bold mt-4 text-gray-800 dark:text-white">Page Not Found</h2>
      <p className="text-gray-500 dark:text-shrain-light-gray mt-2 mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-shrain-purple text-white font-bold py-3 px-8 rounded-md hover:bg-shrain-purple/80 transition-colors"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;