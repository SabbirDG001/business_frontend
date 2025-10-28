import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'; // Added Dispatch, SetStateAction
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggleButton from './ThemeToggleButton';
import SearchBar from '../search/SearchBar';
import { Product, User } from '../../types';
import SearchResultItem from '../search/SearchResultItem';
import { useDebounce } from '../../hooks/useDebounce';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const CloseIcon = () => (
     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>; // Type for useState setter
  cartItemCount: number;
  user: User | null; // User type or null if not logged in
  logout: () => void; // Type for the logout function
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen, cartItemCount, user, logout }) => {
    const navLinkClasses = "block px-3 py-3 rounded-md text-lg font-medium text-gray-500 dark:text-shrain-light-gray hover:text-shrain-dark dark:hover:text-white hover:bg-gray-100 dark:hover:bg-shrain-dark-gray";
    const activeLinkClasses = "text-shrain-dark dark:text-white bg-gray-200 dark:bg-shrain-dark-gray font-bold";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-1/2 max-w-xs bg-white dark:bg-shrain-dark-gray z-50 shadow-lg"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="p-5 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-8">
                                <Link to="/" onClick={() => setIsOpen(false)} className="text-2xl font-serif font-bold text-gray-800 dark:text-white tracking-wider">
                                    SHRAIN
                                </Link>
                                <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white" aria-label="Close menu">
                                    <CloseIcon />
                                </button>
                            </div>
                            <nav className="flex flex-col space-y-4 flex-grow">
                                {/* Using NavLink correctly with className function */}
                                <NavLink to="/" onClick={() => setIsOpen(false)} className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
                                <NavLink to="/products/sneakers" onClick={() => setIsOpen(false)} className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Sneakers</NavLink>
                                <NavLink to="/products/glow" onClick={() => setIsOpen(false)} className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Glow</NavLink>
                                <NavLink to="/products/lamps" onClick={() => setIsOpen(false)} className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Lamps</NavLink>
                            </nav>

                            <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

                            <div className="flex flex-col space-y-4">
                                {user ? (
                                    <button onClick={logout} className={`${navLinkClasses} flex items-center w-full`}>
                                        <LogoutIcon />
                                        <span className="ml-3">Logout</span>
                                    </button>
                                ) : (
                                    <NavLink to="/login" onClick={() => setIsOpen(false)} className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''} flex items-center`}>
                                        <UserIcon />
                                        <span className="ml-3">Login</span>
                                    </NavLink>
                                )}
                                <NavLink to="/cart" onClick={() => setIsOpen(false)} className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''} flex items-center justify-between`}>
                                    <div className="flex items-center">
                                        <CartIcon />
                                        <span className="ml-3">Cart</span>
                                    </div>
                                    {cartItemCount > 0 && (
                                        <span className="bg-shrain-purple text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </NavLink>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


const Header: React.FC = () => {
    const { state } = useCart();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Centralized search state
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 300); // Faster debounce for suggestion feel
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    const cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);
    const location = useLocation();

    // Close search modal on navigation
    useEffect(() => {
        if (isSearchOpen) {
            setIsSearchOpen(false);
        }
    }, [location]);

    // Live search effect, triggers on debounced query change
    useEffect(() => {
        if (debouncedSearchQuery.length > 0) { // Trigger search on 1+ chars
            setIsSearchLoading(true);
            api.searchProducts(debouncedSearchQuery)
                .then(results => {
                    setSearchResults(results);
                })
                .finally(() => {
                    setIsSearchLoading(false);
                });
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchQuery]);

    // Cleanup state when search modal is closed
    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleLogoutMobile = () => {
        logout();
        setIsMenuOpen(false);
    };

    const navLinkClasses = "text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white transition-colors duration-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-shrain-gold after:transition-all after:duration-300 hover:after:w-full";
    const activeLinkClasses = "text-gray-800 dark:text-white after:w-full";

    const searchResultsContainerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05,
        },
      },
    };

    return (
        <header className="bg-white/80 dark:bg-shrain-dark/80 backdrop-blur-md sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-3xl font-serif font-bold text-gray-800 dark:text-white tracking-wider">
                            SHRAIN
                        </Link>
                    </div>

                    <nav className="hidden md:flex md:space-x-8">
                        <NavLink to="/" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
                        <NavLink to="/products/sneakers" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Sneakers</NavLink>
                        <NavLink to="/products/glow" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Glow</NavLink>
                        <NavLink to="/products/lamps" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Lamps</NavLink>
                    </nav>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button onClick={() => setIsSearchOpen(true)} className="text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white transition-colors duration-300" aria-label="Open search">
                           <SearchIcon />
                        </button>
                        <ThemeToggleButton />
                        {user ? (
                            <button onClick={logout} className="text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white transition-colors duration-300" aria-label="Logout">
                                <LogoutIcon />
                            </button>
                        ) : (
                            <Link to="/login" className="text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white transition-colors duration-300" aria-label="Login / Account">
                               <UserIcon />
                            </Link>
                        )}
                        <Link to="/cart" className="relative text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white transition-colors duration-300">
                            <CartIcon />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-shrain-purple text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white" aria-label="Open menu">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <MobileMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} cartItemCount={cartItemCount} user={user} logout={handleLogoutMobile} />

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 flex items-start justify-center p-4 pt-10 md:pt-20"
                        aria-modal="true"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 cursor-pointer"
                            onClick={closeSearch}
                        ></div>
                        <motion.div
                            onClick={(e) => e.stopPropagation()} 
                            initial={{ y: -50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -50, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative w-full max-w-2xl max-h-[70vh] bg-white dark:bg-shrain-dark-gray rounded-lg shadow-lg flex flex-col"
                        >
                            <div className="p-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex-grow">
                                    <SearchBar 
                                        query={searchQuery}
                                        onQueryChange={setSearchQuery}
                                        autoFocus={true}
                                    />
                                </div>
                                <button onClick={closeSearch} className="p-2 text-gray-500 dark:text-shrain-light-gray hover:text-gray-800 dark:hover:text-white rounded-full" aria-label="Close search">
                                    <CloseIcon />
                                </button>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4">
                               {isSearchLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="text-gray-500 dark:text-shrain-light-gray">Searching...</p>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <motion.div
                                        className="flex flex-col gap-1"
                                        variants={searchResultsContainerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {searchResults.map(product => (
                                             <SearchResultItem key={product.id} product={product} onClick={closeSearch} />
                                        ))}
                                    </motion.div>
                                ) : debouncedSearchQuery.length > 0 ? (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="text-gray-500 dark:text-shrain-light-gray">No results found for "{debouncedSearchQuery}".</p>
                                    </div>
                                ) : (
                                     <div className="flex justify-center items-center h-full">
                                        <p className="text-gray-500 dark:text-shrain-light-gray">Start typing to search for products.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;