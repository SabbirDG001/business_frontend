import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ManageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
)

const AdminDashboardPage: React.FC = () => {
    const { user } = useAuth();
  return (
    <div className="p-8 bg-gray-50 dark:bg-shrain-dark-gray rounded-lg">
      <h1 className="text-4xl font-serif font-bold mb-4 text-gray-800 dark:text-white">Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-shrain-light-gray mb-8">
        Welcome, <span className="font-semibold text-shrain-purple">{user?.email}</span>. This is where you will manage your store.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/products" className="group p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center text-shrain-purple">
            <ManageIcon />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Manage Products</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add, edit, or delete products from your inventory.</p>
        </Link>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-not-allowed opacity-50">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">View Orders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track and manage customer orders.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-not-allowed opacity-50">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Sales Analytics</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">View sales data and performance metrics.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;