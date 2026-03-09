import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import aboutHero from '../assets/images/hero-bg.png';
import img8 from '../assets/images/authentic.jpg';
import img9 from '../assets/images/authentic-image.jpg';
import img10 from '../assets/images/bagara rice.jpg';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const galleryImages = [img8, img9, img10];

    return (
        <div className="pt-14 min-h-screen">
            {/* Page Header with background image */}
            <section className="relative py-20 lg:py-32 overflow-hidden text-center">
                <img src={aboutHero} alt="Our Story" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-secondary/80" />
                <div className="container mx-auto relative z-10 px-6">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent font-semibold tracking-widest uppercase text-sm block mb-4"
                    >
                        Since Generations
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white font-playfair text-5xl md:text-7xl"
                    >
                        Our <span className="text-accent italic">Story</span>
                    </motion.h1>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="section-padding bg-white">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-secondary font-playfair text-3xl md:text-5xl leading-tight mb-12"
                    >
                        "Born from a passion for authentic flavours and traditional recipes, <span className="text-primary italic">Tasty Bites</span> brings the vibrant soul of South India to your table."
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left text-brand-text-light text-lg">
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            For generations, our families have perfected the art of South Indian cooking in the heart of South India. Now, we bring those same time-honoured recipes to you. Every dosa is made from batter fermented overnight. Every sambar carries the essence of hand-ground spices. Every meal is a bridge between two worlds, crafted with love and tradition.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            Our secret lies in the simplicity of our ingredients and the complexity of our methods. From the coastal regions of Kerala to the bustling streets of Bangalore, we've curated a menu that represents the true diversity of the South Indian palate. We invitation you to share in our heritage.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Visual Identity Grid */}
            <section className="pb-24 px-[5%]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((imgSrc, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative h-[400px] overflow-hidden rounded-[2rem] group"
                        >
                            <img
                                src={imgSrc}
                                alt="Restaurant Vibe"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-10">
                                <p className="text-white font-playfair text-2xl lowercase italic">traditional craftsmanship</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
