import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SignupPage: React.FC = () => {
  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center py-12"
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-shrain-dark-gray rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white font-serif">Create an Account</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-shrain-purple focus:border-shrain-purple"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-shrain-purple focus:border-shrain-purple"
            />
          </div>
           <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-shrain-purple focus:border-shrain-purple"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shrain-purple hover:bg-shrain-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-purple"
            >
              Sign up
            </button>
          </div>
        </form>
         <p className="text-center text-sm text-gray-500 dark:text-shrain-light-gray">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-shrain-purple hover:underline">
                Sign in
            </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;