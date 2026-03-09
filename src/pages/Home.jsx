import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import FavoritesSection from '../components/FavoritesSection';
import PopularDishes from '../components/PopularDishes';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import { motion } from 'framer-motion';

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Hero />
            <StorySection />
            <FavoritesSection />
            <PopularDishes />
            <Testimonials />
            <ContactSection />
        </motion.div>
    );
};

export default Home;
