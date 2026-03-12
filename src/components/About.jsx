import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './About.css';
import aboutImg from '../assets/about-img.png';

const About = () => {
    return (
        <section id="about" className="py-24 lg:py-40 bg-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Image Column - Asymmetrical with decoration */}
                    <div className="w-full lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="relative z-10"
                        >
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl group">
                                <img 
                                    src={aboutImg} 
                                    alt="Traditional Dosa Making" 
                                    className="w-full h-[500px] lg:h-[650px] object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>

                            {/* Floating Card Detail */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="absolute -bottom-10 -right-6 lg:-right-12 bg-white p-8 rounded-3xl shadow-2xl border border-brand-cream z-20 hidden md:block max-w-[280px]"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Sparkles className="text-primary" size={24} />
                                    </div>
                                    <span className="font-playfair font-bold text-secondary text-xl">30+ Years</span>
                                </div>
                                <p className="text-brand-text-light text-sm leading-relaxed">
                                    Keeping the authentic soul of South Indian cuisine alive through generations.
                                </p>
                            </motion.div>
                        </motion.div>

                        {/* Background frame decoration */}
                        <div className="absolute -top-10 -left-10 w-full h-full border-2 border-brand-cream rounded-[3.5rem] z-0 pointer-events-none hidden lg:block" />
                    </div>

                    {/* Content Column */}
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, staggerChildren: 0.2 }}
                        >
                            <motion.span className="text-primary font-bold tracking-[0.3em] uppercase text-xs block mb-6">
                                Since Generations
                            </motion.span>
                            
                            <motion.h2 className="text-5xl lg:text-7xl font-playfair font-bold text-secondary mb-8 leading-[1.1]">
                                A Legacy of <br />
                                <span className="text-primary italic">Authentic</span> Flavours
                            </motion.h2>

                            <motion.div className="space-y-6 mb-12">
                                <p className="text-brand-text-light text-lg leading-relaxed font-medium">
                                    For generations, our families have perfected the art of South Indian cooking in the heart of our community. Now, we bring those same time-honoured recipes to your table.
                                </p>
                                <p className="text-brand-text-light text-lg leading-relaxed font-medium border-l-4 border-primary/20 pl-6 italic">
                                    Every dosa is made from batter fermented overnight. Every sambar carries the essence of hand-ground spices. Every meal is a bridge between two worlds, crafted with love and tradition.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link 
                                    to="/about" 
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-secondary text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-secondary-light transition-all group shadow-xl shadow-secondary/20"
                                >
                                    Learn Our Story
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
