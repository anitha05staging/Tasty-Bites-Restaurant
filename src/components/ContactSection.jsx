import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ContactSection = () => {
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const form = e.target;
            await api.submitContact({
                name: form.name?.value || '',
                email: form.email?.value || '',
                phone: '',
                subject: 'Homepage General Inquiry',
                message: form.message?.value || ''
            });
            setSubmitted(true);
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <section className="section-padding bg-white relative">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
                    {/* Info Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-brand-cream border border-primary/10 p-12 lg:p-16 rounded-[2.5rem] flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-primary font-semibold tracking-widest uppercase text-sm block mb-4">Visit Us</span>
                            <h2 className="text-secondary font-playfair text-4xl md:text-5xl leading-tight mb-8">
                                Let's Start a <br /><span className="text-primary italic">Delicious Conversation</span>
                            </h2>

                            <div className="space-y-8 mt-12">
                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-secondary mb-1">Our Location</h3>
                                        <p className="text-brand-text-light">123 High Street, Kensington, London W8 5SF</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-secondary mb-1">Phone Number</h3>
                                        <p className="text-brand-text-light">+44 1792 951309</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-secondary mb-1">Email Address</h3>
                                        <p className="text-brand-text-light">hello@tastybites.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-primary/10">
                            <p className="text-brand-text-dark font-semibold mb-2">Social Hub</p>
                            <div className="flex space-x-4">
                                {['Facebook', 'Instagram', 'WhatsApp'].map(social => (
                                    <span key={social} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-primary cursor-pointer hover:bg-primary hover:text-white transition-all">
                                        {social}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col justify-center"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Email</label>
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Message</label>
                                <textarea
                                    required
                                    name="message"
                                    rows="6"
                                    placeholder="How can we help you?"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
                                ></textarea>
                            </div>
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center space-x-3 border border-red-100">
                                    <AlertCircle size={24} />
                                    <div>
                                        <p className="font-bold text-sm">Failed to send</p>
                                        <p className="text-xs">{error}</p>
                                    </div>
                                </div>
                            )}

                            {submitted ? (
                                <div className="bg-green-50 text-green-700 p-4 rounded-2xl flex items-center space-x-3 border border-green-100">
                                    <CheckCircle size={24} />
                                    <div>
                                        <p className="font-bold text-sm">Message Sent!</p>
                                        <p className="text-xs">We'll get back to you soon.</p>
                                    </div>
                                </div>
                            ) : (
                                <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-3 group">
                                    <span>Send Message</span>
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
