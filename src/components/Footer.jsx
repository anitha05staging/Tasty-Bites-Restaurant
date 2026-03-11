import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, ChevronRight, Heart } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-secondary pt-24 pb-12 relative overflow-hidden">
            {/* Scroll to Top */}
            <button
                onClick={scrollToTop}
                className="absolute bottom-10 right-6 md:right-10 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-all transform hover:-translate-y-2 group z-50 shadow-xl"
            >
                <ArrowUp size={20} className="group-hover:animate-bounce" />
            </button>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Info */}
                    <div className="lg:col-span-2">
                        <div className="flex justify-center md:justify-start">
                            <Link to="/" className="inline-block mb-8 mx-auto md:mx-0">
                                <img src="/images/logo.png" alt="Tasty Bites" className="h-12 w-auto object-contain" />
                            </Link>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-8 pr-4 text-center md:text-left">
                            Global Indian Eats — Where Friends & Family Meets to Taste the Tradition in Style.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-3 text-xs font-bold text-white uppercase tracking-widest">
                            <span>Follow Us:</span>
                            <a href="#" className="text-accent hover:text-white transition-colors">Instagram</a>
                            <a href="#" className="text-accent hover:text-white transition-colors">Facebook</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-playfair text-xl mb-8 text-center md:text-left">Explore</h3>
                        <ul className="space-y-4 text-center md:text-left">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Our Story', path: '/about' },
                                { name: 'Menu', path: '/menu' },
                                { name: 'Testimonials', path: '/testimonials' },
                                { name: 'Contact', path: '/contact' },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-white/60 text-sm hover:text-accent transition-colors block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-playfair text-xl mb-8 text-center md:text-left">Legal</h3>
                        <ul className="space-y-4 text-center md:text-left">
                            {[
                                { name: 'Privacy Policy', path: '/privacy-policy' },
                                { name: 'Terms & Conditions', path: '/terms-conditions' },
                                { name: 'Return & Cancellation', path: '/return-cancellation' }
                            ].map(link => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-white/60 text-sm hover:text-accent transition-colors block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-12 flex justify-center items-center text-center">
                    <p className="text-white/30 text-[11px] uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Tasty Bites. All rights reserved.
                        <span className="block mt-1 sm:inline sm:mt-0 sm:ml-2 text-white/50">Made with ❤️ by Anitha.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
