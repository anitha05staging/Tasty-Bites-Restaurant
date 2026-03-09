import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Where Every Meal Tells a',
        subtitle: 'Timeless Story',
        desc: 'Experience the rich, aromatic flavours of South India — from crispy dosas to steaming idlis.'
    },
    {
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Authentic Flavours Passed',
        subtitle: 'Through Generations',
        desc: 'Each dish is a tribute to our heritage, crafted with patience, love, and hand-ground spices.'
    },
    {
        image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'Experience The True Taste',
        subtitle: 'Of South India',
        desc: 'From our fermented batters to our hand-picked ingredients, we ensure perfection in every bite.'
    },
    {
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
        title: 'A Culinary Journey To',
        subtitle: 'The Heart of India',
        desc: 'Join us for an unforgettable dining experience where tradition meets modern culinary artistry.'
    }
];

const Hero = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms]"
                    style={{ backgroundImage: `url(${slides[current].image})` }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
                <div className="max-w-4xl flex flex-col items-center">
                    <motion.h1
                        key={`title-${current}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-white font-playfair text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6"
                    >
                        {slides[current].title} <br />
                        <span className="text-accent">{slides[current].subtitle}</span>
                    </motion.h1>

                    <motion.p
                        key={`desc-${current}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-white/80 text-lg md:text-xl max-w-2xl font-poppins font-light leading-relaxed mb-10 mx-auto"
                    >
                        {slides[current].desc}
                    </motion.p>

                    <motion.div
                        key={`btns-${current}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 w-full"
                    >
                        <Link to="/menu" className="btn-primary flex items-center group w-full sm:w-auto justify-center">
                            Explore Menu
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <ArrowRight size={18} className="ml-2" />
                            </motion.span>
                        </Link>
                        <Link to="/about" className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold uppercase tracking-wider text-sm hover:bg-white hover:text-secondary transition-all w-full sm:w-auto text-center">
                            Our Story
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1 transition-all duration-500 rounded-full ${idx === current ? 'w-12 bg-accent' : 'w-4 bg-white/40 hover:bg-white/60'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
};

export default Hero;
