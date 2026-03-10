import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Quote, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const reviewTypes = ['General', 'Order Review', 'Dine-in Experience', 'Catering Feedback'];

const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({ name: '', type: 'General', rating: 0, text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await api.getTestimonials();
            if (Array.isArray(data)) {
                setTestimonials(data);
            } else {
                setTestimonials([]);
            }
        } catch (error) {
            console.error('Failed to load testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            toast.warning('Please select a star rating.');
            return;
        }
        if (!formData.name.trim()) {
            toast.warning('Please enter your name.');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.submitTestimonial(formData);
            toast.success('Thank you! Your review has been submitted.');
            setFormData({ name: '', type: 'General', rating: 0, text: '' });
            fetchTestimonials(); // Refresh list to show new review
        } catch (error) {
            console.error('Failed to submit testimonial:', error);
            toast.error('Failed to submit your review. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-14 min-h-screen bg-brand-cream/30">
            {/* Hero Section */}
            <section className="bg-secondary py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-20 h-20 bg-accent rounded-full flex items-center justify-center text-secondary mx-auto mb-10 shadow-lg"
                    >
                        <MessageCircle size={36} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-playfair text-5xl md:text-7xl mb-6"
                    >
                        Guest <span className="text-accent italic">Experiences</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/60 text-lg max-w-xl mx-auto font-light tracking-wide uppercase"
                    >
                        Real stories from our beloved community
                    </motion.p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white py-12 border-b border-gray-100">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 text-center md:text-left">
                    <div>
                        <span className="text-4xl font-bold text-secondary">4.9 / 5.0</span>
                        <p className="text-brand-text-light text-xs font-bold uppercase tracking-widest mt-1">Average Google Rating</p>
                    </div>
                    <div className="flex items-center space-x-1 text-accent">
                        {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                    </div>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="section-padding">
                <div className="container mx-auto px-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="animate-spin text-primary" size={48} />
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((review, idx) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: (idx % 3) * 0.1 }}
                                    className="bg-white p-10 rounded-[2rem] shadow-premium hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col h-full"
                                >
                                    <Quote className="text-primary/10 w-12 h-12 mb-6 flex-shrink-0" />
                                    <div className="flex items-center space-x-1 text-accent mb-6 flex-shrink-0">
                                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                    <p className="text-brand-text-dark text-lg italic leading-relaxed mb-8 flex-grow">
                                        "{review.text}"
                                    </p>
                                    <div className="flex justify-between items-center pt-8 border-t border-gray-100 flex-shrink-0 mt-auto">
                                        <span className="font-playfair text-xl text-secondary">{review.name}</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-text-light/50">{review.date}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Review Form */}
            <section id="review-form" className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-2xl">
                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">Share Your Experience</span>
                        <h2 className="text-3xl md:text-5xl font-playfair text-secondary">Leave a <span className="text-primary italic">Review</span></h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-brand-cream/30 p-8 md:p-12 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            {/* Customer Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Review Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white text-gray-700 appearance-none cursor-pointer"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em 1.5em' }}
                                >
                                    {reviewTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Star Rating */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Star Rating <span className="text-red-500">*</span></label>
                                <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-125"
                                        >
                                            <Star
                                                size={36}
                                                className={`transition-colors ${(hoverRating || formData.rating) >= star ? 'text-accent fill-accent' : 'text-gray-300'}`}
                                            />
                                        </button>
                                    ))}
                                    <span className="ml-4 text-sm text-gray-500 font-medium">
                                        {formData.rating > 0 ? `${formData.rating} / 5` : 'Select a rating'}
                                    </span>
                                </div>
                            </div>

                            {/* Review Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white resize-none"
                                    placeholder="Tell us about your experience at Tasty Bites..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full btn-primary py-4 text-lg rounded-xl flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0 mr-3" />
                                        <span>Submitting...</span>
                                    </>
                                ) : 'Submit Review'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            {/* Ready to Try CTA Section */}
            <section className="py-24 bg-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-playfair text-white mb-6"
                    >
                        Ready to <span className="text-accent italic">Try?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
                    >
                        Join our happy customers and experience authentic flavors
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link
                            to="/menu"
                            className="inline-flex items-center space-x-3 bg-primary text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-accent hover:text-secondary transition-all shadow-xl group"
                        >
                            <span>Order Now</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TestimonialsPage;
