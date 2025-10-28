import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

// (The ForgotPasswordModal is simulated, so we can keep it for now)
const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        // Correct template literal usage
        console.log(`Password reset link simulation for: ${email}`);
        // Correct template literal usage
        setMessage(`If an account with the email ${email} exists, a reset link has been sent.`);
        setEmail('');
    };

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setEmail('');
                setMessage('');
            }, 300);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/60"></div>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ y: -50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -50, opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md p-8 space-y-6 bg-white dark:bg-shrain-dark-gray rounded-lg shadow-lg"
                    >
                         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Close">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                         </button>
                        <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white font-serif">Reset Your Password</h3>
                        {message ? (
                             <div className="text-center">
                                <p className="text-green-600 dark:text-green-400">{message}</p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shrain-purple hover:bg-shrain-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-purple"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                             <form className="space-y-6" onSubmit={handleSubmit}>
                                <p className="text-sm text-center text-gray-500 dark:text-shrain-light-gray">
                                    Enter your email address and we'll simulate sending a link to reset your password.
                                </p>
                                <div>
                                    <label htmlFor="reset-email" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Email address</label>
                                    <input
                                      id="reset-email"
                                      name="email"
                                      type="email"
                                      autoComplete="email"
                                      required
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-shrain-purple focus:border-shrain-purple"
                                    />
                                </div>
                                <div>
                                    <button
                                      type="submit"
                                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shrain-purple hover:bg-shrain-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-purple"
                                    >
                                      Send Reset Link
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


const LoginPage: React.FC = () => {
    const { login, loginWithGoogle, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('customer@shrain.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
            >
                <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-shrain-dark-gray rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white font-serif">Welcome Back</h2>

                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-shrain-purple focus:border-shrain-purple"
                            />
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-shrain-purple focus:border-shrain-purple"
                            />
                        </div>
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="text-sm text-shrain-purple hover:underline focus:outline-none"
                            >
                                Forgot your password?
                            </button>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shrain-purple hover:bg-shrain-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-purple disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-shrain-dark-gray text-gray-500 dark:text-shrain-light-gray">
                            OR
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                         <button
                            type="button"
                            onClick={loginWithGoogle}
                            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-shrain-dark-gray hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign in with Google
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 dark:text-shrain-light-gray">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-shrain-purple hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
            <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
        </>
    );
};

export default LoginPage;