import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

const reviews = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        text: 'The most authentic Masala Dosa I’ve had outside of India. The sambar is perfectly spiced and the service is exceptional!',
        rating: 5,
        date: '2 Oct 2025'
    },
    {
        id: 2,
        name: 'David Thompson',
        text: 'A hidden gem! The atmosphere is warm and inviting, and the Filter Coffee brought back so many memories.',
        rating: 5,
        date: '15 Sep 2025'
    },
    {
        id: 3,
        name: 'Anita Kapoor',
        text: 'Tasty Bites never disappoints. The Mysore Dosa is my personal favourite. Great for family dinners.',
        rating: 4,
        date: '28 Aug 2025'
    }
];

const Testimonials = () => {
    return (
        <section className="section-padding bg-secondary relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-10 left-10 w-96 h-96 border border-white/20 rounded-full" />
                <div className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] border border-white/20 rounded-full" />
            </div>

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-accent font-semibold tracking-widest uppercase text-sm block mb-4">What Our Guests Say</span>
                    <h2 className="text-white font-playfair text-4xl md:text-5xl lg:text-6xl">
                        Trusted by <span className="text-accent font-playfair">Food Lovers</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {reviews.map((review, idx) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl relative"
                        >
                            <Quote className="absolute top-6 right-8 text-accent/20 w-12 h-12" />

                            <div className="flex items-center space-x-1 text-accent mb-6">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" />
                                ))}
                            </div>

                            <p className="text-white/80 italic text-lg leading-relaxed mb-8">
                                "{review.text}"
                            </p>

                            <div className="flex justify-between items-center border-t border-white/10 pt-6">
                                <span className="text-white font-bold tracking-wide">{review.name}</span>
                                <span className="text-white/40 text-xs">{review.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link to="/testimonials" className="text-accent font-bold uppercase tracking-widest text-sm py-2 border-b-2 border-accent/30 hover:border-accent transition-all">
                        View All Reviews
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
