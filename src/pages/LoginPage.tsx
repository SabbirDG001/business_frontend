import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

// --- ForgotPasswordModal remains the same ---
const ForgotPasswordModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        console.log(`Password reset link simulation for: ${email}`);
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
// --- End ForgotPasswordModal ---

// Define a type for the expected location state
interface LocationState {
    from?: {
        pathname?: string;
    };
}

const LoginPage: React.FC = () => {
    const { login, verifyGoogleTokenWithBackend, loading, isGoogleAuthLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { addNotification } = useNotification();
    const [email, setEmail] = useState('customer@shrain.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

    // *** FIX: Cast location.state to the expected type ***
    const typedState = location.state as LocationState | null;
    const from = typedState?.from?.pathname || "/";

    // Handle email/password login submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            // *** FIX: Ensure login call is correct (it was already correct syntactically) ***
            // Assuming the error might stem from how the promise rejection is handled
            await login(email, password);
            addNotification({ message: 'Login successful!', type: 'success' });
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Email/Password login failed:", err);
            // Extract a user-friendly error message if available
            let errorMessage = 'Invalid email or password. Please try again.'; // Default
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                 errorMessage = err.response.data.message; // Use backend message if provided
            } else if (err instanceof Error) {
                 errorMessage = err.message; // Use generic error message
            }
            setError(errorMessage);
        }
    };

    // Handle successful Google Sign-In from the GoogleLogin component
    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setError('');
        try {
            await verifyGoogleTokenWithBackend(credentialResponse);
            addNotification({ message: 'Signed in with Google successfully!', type: 'success' });
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Google Sign-In backend verification failed:", err);
            let errorMessage = "Google Sign-In failed during backend verification. Please try again.";
             if (axios.isAxiosError(err) && err.response?.data?.message) {
                 errorMessage = err.response.data.message;
             } else if (err instanceof Error) {
                 errorMessage = err.message;
             }
            setError(errorMessage);
            addNotification({ message: errorMessage, type: 'error' });
        }
    };

    // Handle errors from the GoogleLogin component itself
    const handleGoogleError = () => {
        console.error("Google Sign-In process failed or was cancelled by user.");
        const errorMessage = 'Google Sign-In failed or was cancelled.';
        setError(errorMessage);
        addNotification({ message: errorMessage, type: 'error' });
    };

    const isDarkMode = document.documentElement.classList.contains('dark');

    // Need to import axios to use isAxiosError
    // Add this import at the top of the file:
    // import axios from 'axios';
    // However, since it's used within AuthContext, maybe it's better to
    // handle the error message extraction within AuthContext itself and re-throw
    // a simpler error or a specific error type. For now, this inline check works.

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
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email/Password Form */}
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {/* Email Input */}
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
                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-shrain-light-gray">Password</label>
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
                        {/* Forgot Password */}
                        <div className="flex items-center justify-end">
                            <button
                                type="button"
                                onClick={() => setIsForgotPasswordOpen(true)}
                                className="text-sm text-shrain-purple hover:underline focus:outline-none"
                                disabled={loading || isGoogleAuthLoading}
                            >
                                Forgot your password?
                            </button>
                        </div>
                        {/* Sign In Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || isGoogleAuthLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-shrain-purple hover:bg-shrain-purple/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-shrain-purple disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>

                    {/* OR Separator */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-shrain-dark-gray text-gray-500 dark:text-shrain-light-gray">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Google Login Button Area */}
                    <div className="flex justify-center items-center h-10">
                        {isGoogleAuthLoading ? (
                            <div className="text-sm text-gray-500 dark:text-shrain-light-gray animate-pulse">
                                Signing in with Google...
                            </div>
                        ) : (
                             <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme={isDarkMode ? 'filled_black' : 'outline'}
                                shape='pill'
                             />
                        )}
                    </div>

                    {/* Sign Up Link */}
                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-shrain-light-gray">
                        Don't have an account?{' '}
                        <Link
                            to="/signup"
                            className={`font-medium text-shrain-purple hover:underline ${loading || isGoogleAuthLoading ? 'pointer-events-none opacity-50' : ''}`}
                            aria-disabled={loading || isGoogleAuthLoading}
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
            {/* Forgot Password Modal */}
            <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
        </>
    );
};

// You might need this import if you check for axios errors directly here
import axios from 'axios';

export default LoginPage;