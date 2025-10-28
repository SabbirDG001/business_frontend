import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!email) {
            setMessage('Please enter a valid email.');
            return;
        }
        const response = await api.subscribeToNewsletter(email);
        if (response.success) {
            setMessage('Thank you for subscribing!');
            setEmail('');
        } else {
            setMessage('Subscription failed. Please try again.');
        }
    };

    return (
        <footer className="bg-gray-100 dark:bg-shrain-dark-gray">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                {/* Newsletter Section */}
                <div className="max-w-2xl mx-auto mb-12">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Subscribe to our newsletter</h3>
                    <p className="text-gray-600 dark:text-shrain-light-gray mb-4">Get the latest on new releases, promotions, and more.</p>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 justify-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full sm:w-auto flex-grow px-4 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-shrain-purple"
                        />
                        <button type="submit" className="px-6 py-3 bg-shrain-purple text-white font-semibold rounded-md hover:bg-shrain-purple/80 transition-colors">
                            Subscribe
                        </button>
                    </form>
                    {message && <p className="text-sm mt-2 text-shrain-gold">{message}</p>}
                </div>

                {/* Links Section */}
                <div className="flex justify-center gap-8 md:gap-24 flex-wrap text-left">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li><Link to="/products/sneakers" className="text-gray-600 dark:text-shrain-light-gray hover:text-shrain-gold">Sneakers</Link></li>
                            <li><Link to="/products/glow" className="text-gray-600 dark:text-shrain-light-gray hover:text-shrain-gold">Glow</Link></li>
                            <li><Link to="/products/lamps" className="text-gray-600 dark:text-shrain-light-gray hover:text-shrain-gold">Lamps</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-600 dark:text-shrain-light-gray hover:text-shrain-gold">Contact Us</Link></li>
                            <li><Link to="#" className="text-gray-600 dark:text-shrain-light-gray hover:text-shrain-gold">FAQ</Link></li>
                            <li><Link to="#" className="text-gray-600 dark:text-shrain-light-gray hover:text-shrain-gold">Shipping & Returns</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex justify-center items-center">
                    <p className="text-gray-600 dark:text-shrain-light-gray">&copy; {new Date().getFullYear()} SHRAIN. All Rights Reserved.</p>
                    {/* Social Media Icons would go here */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;