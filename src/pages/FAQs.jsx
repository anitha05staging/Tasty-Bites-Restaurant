import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AccordionItem = ({ item, isOpen, onToggle }) => (
    <div className="border-b border-gray-100 last:border-b-0">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between py-5 px-2 text-left group"
        >
            <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary' : 'text-secondary group-hover:text-primary'}`}>
                {item.q}
            </span>
            <ChevronDown
                size={20}
                className={`text-gray-400 group-hover:text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-primary' : ''}`}
            />
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <p className="px-2 pb-6 text-gray-600 leading-relaxed">{item.a}</p>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FAQs = () => {
    const [faqCategories, setFaqCategories] = useState({});
    const [categoryKeys, setCategoryKeys] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [openIndex, setOpenIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const data = await api.getFaqs();
            if (data && !data.error) {
                setFaqCategories(data);
                const keys = Object.keys(data);
                setCategoryKeys(keys);
                if (keys.length > 0) {
                    setActiveCategory(keys[0]);
                }
            } else {
                setFaqCategories({});
                setCategoryKeys([]);
            }
        } catch (error) {
            console.error('Failed to load FAQs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        setOpenIndex(null);
    };

    return (
        <div className="pt-14 min-h-screen bg-brand-cream/30 pb-24">
            {/* Hero Section */}
            <section className="bg-secondary py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-secondary mx-auto mb-10 shadow-lg"
                    >
                        <HelpCircle size={36} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-playfair text-5xl md:text-7xl mb-6"
                    >
                        Frequently Asked <span className="text-accent italic">Questions</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/60 text-lg max-w-xl mx-auto font-light tracking-wide uppercase"
                    >
                        Find answers to your most common questions
                    </motion.p>
                </div>
            </section>

            {/* Category Tabs & Accordion */}
            <section className="container mx-auto px-6 mt-16">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : categoryKeys.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No FAQs found.</p>
                    </div>
                ) : (
                    <>
                        {/* Category Tabs */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {categoryKeys.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-6 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all ${activeCategory === cat
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Accordion */}
                        <div className="max-w-3xl mx-auto">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100"
                            >
                                {faqCategories[activeCategory]?.map((item, idx) => (
                                    <AccordionItem
                                        key={idx}
                                        item={item}
                                        isOpen={openIndex === idx}
                                        onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    />
                                ))}
                            </motion.div>
                        </div>
                    </>
                )}
            </section>

            {/* Still Have Questions CTA */}
            <section className="mt-24">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-3xl mx-auto bg-secondary rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <h2 className="text-3xl md:text-5xl font-playfair text-white mb-4 relative z-10">Still have <span className="text-accent italic">questions?</span></h2>
                        <p className="text-white/70 text-lg mb-10 relative z-10">Our team is here to help</p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center space-x-3 bg-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-accent hover:text-secondary transition-all shadow-xl group relative z-10"
                        >
                            <span>Contact Us</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default FAQs;
