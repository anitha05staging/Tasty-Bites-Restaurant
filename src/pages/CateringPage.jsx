import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, MessageSquare, Calendar, Users, Briefcase, Heart, PartyPopper, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import cateringHero from '../assets/images/authentic.jpg';
import api from '../services/api';
import PhoneInput from '../components/PhoneInput';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { toast } from 'react-toastify';

const CateringPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        eventType: 'Corporate Event',
        eventDate: '',
        guestCount: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.sendCateringEnquiry({
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType,
                eventDate: formData.eventDate,
                guestCount: formData.guestCount,
                message: formData.message
            });
            setIsSuccess(true);
            setFormData({ fullName: '', email: '', phone: '', eventType: 'Corporate Event', eventDate: '', guestCount: '', message: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to send enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const featureBlocks = [
        { icon: <Briefcase size={32} />, title: "Corporate Events", desc: "Impress your clients and team with our authentic, professionally catered South Indian lunches and dinners." },
        { icon: <Heart size={32} />, title: "Weddings", desc: "Make your special day unforgettable with a bespoke menu tailored to your grand celebration." },
        { icon: <PartyPopper size={32} />, title: "Private Parties", desc: "From birthdays to family reunions, bring the flavor of Tasty Bites directly to your intimate gatherings." }
    ];

    return (
        <div className="bg-brand-cream min-h-screen pb-24 font-poppins pt-10">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] w-full">
                <img src={cateringHero} alt="Catering Header" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />

                <div className="absolute inset-0 flex items-center container mx-auto px-6">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-playfair text-white mb-4"
                        >
                            Exceptional <span className="text-accent italic">Catering</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-lg md:text-xl font-light"
                        >
                            Authentic South Indian flavors for your memorable events.
                        </motion.p>
                    </div>
                    <div className="hidden md:block">
                        <Link to="/" className="inline-flex items-center space-x-2 text-white hover:text-accent transition-colors bg-black/30 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20">
                            <ArrowLeft size={18} />
                            <span className="font-semibold uppercase tracking-widest text-sm">Back to Home</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Back Button */}
            <div className="md:hidden container mx-auto px-6 mt-6">
                <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:text-secondary transition-colors font-semibold uppercase tracking-widest text-sm">
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                </Link>
            </div>

            <div className="container mx-auto px-6 mt-16 lg:mt-24">

                {/* What We Offer Section */}
                <div className="text-center mb-16">
                    <span className="text-primary font-semibold tracking-widest uppercase text-sm mb-4 block">Our Services</span>
                    <h2 className="text-3xl md:text-5xl font-playfair text-secondary">What We <span className="text-primary italic">Offer</span></h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {featureBlocks.map((block, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-shadow group"
                        >
                            <div className="w-16 h-16 bg-brand-cream text-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                {block.icon}
                            </div>
                            <h3 className="text-2xl font-playfair text-secondary mb-4">{block.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{block.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Split Layout: Custom Catering & Form */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Custom Catering Text & Buttons */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-5"
                    >
                        <h2 className="text-3xl md:text-5xl font-playfair text-secondary mb-6 leading-tight">Custom Catering <br /><span className="text-primary italic">Just for You!</span></h2>
                        <div className="w-20 h-1 bg-accent mb-8" />

                        <p className="text-lg text-gray-600 leading-relaxed mb-10">
                            We'd love to create a personalized catering experience tailored to your special occasion. From intimate gatherings to grand celebrations, let us bring authentic South Indian flavors to your event!
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="tel:+447000000000" className="btn-primary flex items-center justify-center py-4 px-8 text-lg w-full sm:w-auto">
                                <Phone size={20} className="mr-3" />
                                Call Us
                            </a>
                            <a href="https://wa.me/447000000000" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center justify-center py-4 px-8 rounded-full transition-colors text-lg w-full sm:w-auto shadow-md">
                                <MessageSquare size={20} className="mr-3" />
                                WhatsApp Us
                            </a>
                        </div>
                    </motion.div>

                    {/* Enquiry Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <h3 className="text-2xl font-playfair text-secondary mb-8 relative z-10">Catering Enquiry Form</h3>

                        <AnimatePresence mode="wait">
                            {isSuccess ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative z-10 flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h4 className="text-2xl font-playfair text-secondary mb-3">Enquiry Received!</h4>
                                    <p className="text-gray-600 leading-relaxed max-w-sm">
                                        Thank you for your catering enquiry! Our team will get back to you shortly to discuss your custom event.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onSubmit={handleSubmit}
                                    className="space-y-6 relative z-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Full Name *</label>
                                            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-8 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 transition-all" placeholder="John Doe" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Phone *</label>
                                            <PhoneInput
                                                required
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="rounded-2xl overflow-hidden border border-gray-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Email Address *</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-8 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 transition-all" placeholder="john@example.com" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Event Type *</label>
                                            <select name="eventType" value={formData.eventType} onChange={handleChange} className="w-full px-8 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 text-gray-700 h-[60px] appearance-none cursor-pointer">
                                                <option>Corporate Event</option>
                                                <option>Wedding</option>
                                                <option>Private Party</option>
                                                <option>Birthday</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Est. Guests *</label>
                                            <input required type="number" min="10" name="guestCount" value={formData.guestCount} onChange={handleChange} className="w-full px-8 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50" placeholder="e.g., 50" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Event Date *</label>
                                        <Flatpickr
                                            name="eventDate"
                                            required
                                            value={formData.eventDate}
                                            onChange={([date]) => {
                                                const d = new Date(date);
                                                const formattedDate = d.toISOString().split('T')[0];
                                                setFormData({ ...formData, eventDate: formattedDate });
                                            }}
                                            options={{
                                                minDate: 'today',
                                                dateFormat: 'Y-m-d',
                                                disableMobile: true
                                            }}
                                            className="w-full px-8 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 text-gray-700"
                                            placeholder="Select Event Date"
                                            title="Event Date"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Additional Details</label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-8 py-4 rounded-3xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 resize-none" placeholder="Tell us about your catering needs..."></textarea>
                                    </div>

                                    <button type="submit" disabled={isSubmitting} className={`w-full btn-primary py-4 text-lg rounded-xl flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}>
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0 mr-3" />
                                                <span>Sending Enquiry...</span>
                                            </>
                                        ) : (
                                            'Submit Enquiry'
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CateringPage;
