import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import PhoneInput from '../components/PhoneInput';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            await api.submitContact(formData);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: 'General Inquiry',
                message: ''
            });
            setErrors({});
            toast.success('Thank you! Your message has been sent successfully.');
        } catch (err) {
            toast.error(err.message || 'Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-14 min-h-screen">
            {/* Header */}
            <section className="bg-secondary py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-accent font-semibold tracking-widest uppercase text-sm block mb-4"
                    >
                        Get In Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white font-playfair text-5xl md:text-7xl"
                    >
                        Connect With <span className="text-accent italic">Us</span>
                    </motion.h1>
                </div>
            </section>

            {/* Main Content */}
            <section className="section-padding bg-white">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                        {/* Form Column */}
                        <div className="lg:col-span-7">
                            <div className="bg-white p-2 sm:p-4 md:p-8 rounded-[2.5rem]">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Your Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Alex Perry"
                                                className={`w-full px-8 py-5 bg-brand-cream/30 border-none rounded-2xl focus:ring-2 ${errors.name ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'} transition-all outline-none`}
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Email Address</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="alex@example.com"
                                                className={`w-full px-8 py-5 bg-brand-cream/30 border-none rounded-2xl focus:ring-2 ${errors.email ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'} transition-all outline-none`}
                                            />
                                            {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Phone Number</label>
                                            <PhoneInput
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className={`rounded-2xl overflow-hidden ${errors.phone ? 'ring-2 ring-red-500/50' : ''}`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Subject</label>
                                            <div className="relative">
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full px-8 py-5 bg-brand-cream/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer h-[64px]"
                                                >
                                                    <option>General Inquiry</option>
                                                    <option>Table Reservation</option>
                                                    <option>Catering Event</option>
                                                    <option>Feedback</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-secondary ml-1">Your Message</label>
                                        <textarea
                                            name="message"
                                            rows="6"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us more..."
                                            className={`w-full px-8 py-5 bg-brand-cream/30 border-none rounded-3xl focus:ring-2 ${errors.message ? 'ring-2 ring-red-500/50' : 'focus:ring-primary/20'} transition-all outline-none resize-none`}
                                        ></textarea>
                                        {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`btn-primary w-full group flex items-center justify-center space-x-3 py-5 text-base ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Inquiry</span>
                                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-secondary p-8 md:p-12 rounded-[2.5rem] text-white">
                                <h3 className="text-3xl font-playfair mb-8 tracking-wide">Contact <span className="text-accent italic">Info</span></h3>
                                <div className="space-y-8">
                                    <div className="flex items-start space-x-6">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-accent shrink-0">
                                            <MapPin size={22} />
                                        </div>
                                        <p className="text-white/70 leading-relaxed font-light mt-1">123 High Street, Kensington, <br />London W8 5SF</p>
                                    </div>
                                    <div className="flex items-start space-x-6">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-accent shrink-0">
                                            <Phone size={22} />
                                        </div>
                                        <p className="text-white/70 leading-relaxed font-light mt-1">+44 1792 951309</p>
                                    </div>
                                    <div className="flex items-start space-x-6">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-accent shrink-0">
                                            <Mail size={22} />
                                        </div>
                                        <p className="text-white/70 leading-relaxed font-light mt-1 break-all">tastybitesrestaurant7@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-cream border border-primary/10 p-8 md:p-12 rounded-[2.5rem]">
                                <h3 className="text-2xl font-playfair text-secondary mb-6 italic">Opening Hours</h3>
                                <div className="space-y-3 text-brand-text-light text-sm">
                                    <div className="flex justify-between border-b border-primary/5 pb-2">
                                        <span className="font-semibold uppercase tracking-tighter">Mon - Thu</span>
                                        <span>11:30 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between border-b border-primary/5 pb-2">
                                        <span className="font-semibold uppercase tracking-tighter">Fri - Sat</span>
                                        <span>11:30 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-semibold uppercase tracking-tighter text-primary">Sunday</span>
                                        <span className="text-primary font-bold">12:00 PM - 10:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
