import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown, Package, History, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { setIsCartOpen, cartCount, setIsOrderTypeModalOpen } = useCart();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        window.scrollTo(0, 0);
    }, [location]);

    const navLinks = [
        { name: 'Place Your Order', path: '/menu' },
        { name: 'Book a Table', path: '/book' },
        { name: 'Catering', path: '/catering' },
        { name: 'Our Story', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Testimonials', path: '/testimonials' },
        { name: 'FAQs', path: '/faqs' },
    ];

    const isDark = isScrolled || location.pathname !== '/';

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isDark
                ? 'bg-white/90 backdrop-blur-md shadow-premium py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center group shrink-0 min-w-0 pr-2">
                    <img src="/images/logo.png" alt="Tasty Bites" className="h-8 sm:h-10 w-auto object-contain transition-all" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => {
                                if (link.path === '/menu') {
                                    setIsOrderTypeModalOpen(true);
                                } else {
                                    navigate(link.path);
                                    setIsOrderTypeModalOpen(false);
                                }
                            }}
                            className={`text-xs xl:text-sm font-medium uppercase tracking-wider hover:text-primary transition-colors text-left ${isDark ? 'text-secondary' : 'text-white'
                                }`}
                        >
                            {link.name}
                        </button>
                    ))}
                </nav>

                {/* Icons & Mobile Toggle */}
                <div className="flex items-center gap-3 sm:space-x-5 shrink-0">
                    {/* Cart Icon */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className={`relative ${isDark ? 'text-secondary' : 'text-white'} hover:text-primary transition-colors`}
                    >
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </button>

                    {/* User Icon */}
                    <Link
                        to={isAuthenticated ? '/profile' : '/login'}
                        className={`relative flex items-center justify-center ${isDark ? 'text-secondary' : 'text-white'} hover:text-primary transition-colors`}
                    >
                        {isAuthenticated ? (
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                        ) : (
                            <User size={22} />
                        )}
                    </Link>

                    {/* Mobile Toggle */}
                    <button
                        className={`lg:hidden ${isDark ? 'text-secondary' : 'text-white'}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-8 flex flex-col space-y-6">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => {
                                        if (link.path === '/menu') {
                                            setIsOrderTypeModalOpen(true);
                                        } else {
                                            // Normal links
                                            navigate(link.path);
                                            setIsOrderTypeModalOpen(false);
                                        }
                                        setIsOpen(false);
                                    }}
                                    className="text-lg font-semibold text-secondary hover:text-primary transition-colors text-left"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <Link
                                to={isAuthenticated ? '/profile' : '/login'}
                                className="flex items-center space-x-3 text-lg font-semibold text-secondary hover:text-primary transition-colors"
                            >
                                <User size={20} />
                                <span>{isAuthenticated ? 'My Profile' : 'Login / Sign Up'}</span>
                            </Link>
                            <Link
                                to="/book"
                                className="bg-primary text-white text-center py-4 rounded-xl font-bold uppercase tracking-widest"
                            >
                                Book a Table
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
};

export default Navbar;
