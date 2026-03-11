import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, MessageSquare, Briefcase, Heart, PartyPopper } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PhoneInput from '../components/PhoneInput';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { toast } from 'react-toastify';

const CateringPage = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});


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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
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
        if (!formData.eventDate.trim()) newErrors.eventDate = 'Please select an event date';
        if (!formData.guestCount) {
            newErrors.guestCount = 'Guest count is required';
        } else if (parseInt(formData.guestCount) < 10) {
            newErrors.guestCount = 'Minimum 10 guests for catering';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.submitCatering({
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType,
                eventDate: formData.eventDate,
                guestCount: formData.guestCount,
                message: formData.message
            });
            toast.success('Enquiry Received! Our team will get back to you shortly.');
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
        <div className="bg-brand-cream min-h-screen pb-24 font-poppins pt-10 overflow-x-hidden max-w-full">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] w-full max-w-full overflow-hidden">
                <img src="/images/authentic.jpg" alt="Catering Header" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60" />

                <div className="absolute inset-0 flex items-center container mx-auto px-6">
                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl sm:text-4xl md:text-6xl font-playfair text-white mb-4 leading-tight break-words"
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

                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            className="space-y-6 relative z-10"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Full Name *</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-8 py-4 rounded-2xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 transition-all`} placeholder="John Doe" />
                                    {errors.fullName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Phone *</label>
                                    <div className={errors.phone ? 'ring-2 ring-red-500/50 rounded-2xl' : ''}>
                                        <PhoneInput
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            className="rounded-2xl overflow-hidden border border-gray-200"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-8 py-4 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 transition-all`} placeholder="john@example.com" />
                                {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.email}</p>}
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
                                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Event Date *</label>
                                    <div className={errors.eventDate ? 'ring-2 ring-red-500/50 rounded-2xl overflow-hidden' : ''}>
                                        <Flatpickr
                                            name="eventDate"
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
                                    {errors.eventDate && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.eventDate}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-secondary ml-1 mb-2">Est. Guests *</label>
                                <input type="number" min="10" name="guestCount" value={formData.guestCount} onChange={handleChange} className={`w-full px-8 py-4 rounded-2xl border ${errors.guestCount ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50`} placeholder="e.g., 50" />
                                {errors.guestCount && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1 mt-1">{errors.guestCount}</p>}
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
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CateringPage;
