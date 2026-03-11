import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, GlassWater, MessageSquare, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PhoneInput from '../components/PhoneInput';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { toast } from 'react-toastify';

const BookTable = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingRef, setBookingRef] = useState('');
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        date: '',
        guests: '2',
        occasion: 'None',
        specialRequests: ''
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
        if (!formData.date.trim()) newErrors.date = 'Please select a date';

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
        setError(null);
        try {
            const result = await api.createReservation(formData);
            setBookingRef(result.bookingRef || 'DB-' + Math.random().toString(36).substring(2, 8).toUpperCase());
            setIsConfirmed(true);
        } catch (err) {
            const errorMsg = err.message || 'Something went wrong. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Confirmation Modal (rest remains same) */}
            <AnimatePresence>
                {isConfirmed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 30 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative bg-white rounded-3xl p-10 lg:p-14 max-w-lg w-full shadow-2xl text-center overflow-hidden"
                        >
                            {/* Decorative circles */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

                            {/* Animated Check */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200"
                            >
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl md:text-4xl font-playfair text-secondary mb-3"
                            >
                                Booking <span className="text-primary italic">Confirmed!</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-500 mb-8"
                            >
                                Your table for <span className="font-semibold text-secondary">{formData.guests}</span> has been successfully reserved.
                            </motion.p>

                            {/* Reference Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-gradient-to-br from-brand-cream to-primary/5 rounded-2xl p-6 mb-6 border border-primary/10"
                            >
                                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-semibold mb-2">Reference Number</p>
                                <p className="text-2xl font-mono font-bold text-primary tracking-widest">{bookingRef}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-1.5 mb-8"
                            >
                                <p className="text-sm text-gray-500">
                                    📧 Confirmation sent to <span className="font-semibold text-secondary">{formData.email}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    📅 See you on <span className="font-semibold text-secondary">{formData.date}</span>
                                </p>
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <button
                                    onClick={() => { setIsConfirmed(false); setFormData({ fullName: '', email: '', phone: '', date: '', guests: '2', occasion: 'None', specialRequests: '' }); }}
                                    className="flex-1 py-3.5 rounded-xl border border-gray-200 text-secondary hover:border-primary hover:text-primary transition-all font-semibold text-sm"
                                >
                                    Book Another
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 btn-primary py-3.5 rounded-xl text-sm"
                                >
                                    Return to Home
                                </button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-brand-cream min-h-screen pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="flex items-center space-x-2 text-brand-text-light hover:text-primary transition-colors mb-8 cursor-pointer w-fit" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        <span>Back</span>
                    </div>

                    <div className="text-center mb-12">
                        <span className="text-primary font-semibold tracking-widest uppercase text-sm block mb-4">Experience Tasty Bites</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-secondary">Book a <span className="text-primary italic">Table</span></h1>
                    </div>

                    <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden border border-gray-100">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                            {/* Personal Details */}
                            <div>
                                <h3 className="text-2xl font-playfair text-secondary mb-6 border-b border-gray-100 pb-4">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 rounded-xl border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all shadow-sm`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-5 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all shadow-sm`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                                        <div className={errors.phone ? 'ring-1 ring-red-500 rounded-xl' : ''}>
                                            <PhoneInput
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Reservation Details */}
                            <div>
                                <h3 className="text-2xl font-playfair text-secondary mb-6 border-b border-gray-100 pb-4 mt-10">Reservation Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <Calendar size={16} className="mr-2 text-primary" /> Date <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className={errors.date ? 'ring-1 ring-red-500 rounded-xl overflow-hidden' : ''}>
                                            <Flatpickr
                                                name="date"
                                                value={formData.date}
                                                onChange={([date]) => {
                                                    const d = new Date(date);
                                                    const formattedDate = d.toISOString().split('T')[0];
                                                    setFormData({ ...formData, date: formattedDate });
                                                }}
                                                options={{
                                                    minDate: 'today',
                                                    dateFormat: 'Y-m-d',
                                                    disableMobile: true
                                                }}
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 text-gray-700 shadow-sm"
                                                placeholder="Select Date"
                                            />
                                        </div>
                                        {errors.date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <Users size={16} className="mr-2 text-primary" /> Number of Guests <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="guests"
                                                value={formData.guests}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 text-gray-700 appearance-none cursor-pointer shadow-sm"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em 1.5em' }}
                                            >
                                                <option value="1">1 Person</option>
                                                <option value="2">2 People</option>
                                                <option value="3">3 People</option>
                                                <option value="4">4 People</option>
                                                <option value="5">5 People</option>
                                                <option value="6">6 People</option>
                                                <option value="7">7 People</option>
                                                <option value="8">8 People</option>
                                                <option value="9">9 People</option>
                                                <option value="10+">10+ People</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                            <GlassWater size={16} className="mr-2 text-primary" /> Occasion
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="occasion"
                                                value={formData.occasion}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 text-gray-700 appearance-none cursor-pointer shadow-sm"
                                                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.5em 1.5em' }}
                                            >
                                                <option value="None">None (Regular Dining)</option>
                                                <option value="Birthday">Birthday</option>
                                                <option value="Anniversary">Anniversary</option>
                                                <option value="Business Meeting">Business Meeting</option>
                                                <option value="Date Night">Date Night</option>
                                                <option value="Reunion">Reunion</option>
                                                <option value="Other">Other Celebration</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <MessageSquare size={16} className="mr-2 text-primary" /> Special Requests / Dietary Requirements
                                </label>
                                <textarea
                                    name="specialRequests"
                                    value={formData.specialRequests}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all resize-none shadow-sm"
                                    placeholder="E.g., High chair needed, severe peanut allergy, surprise dessert..."
                                ></textarea>
                            </div>


                            {/* Booking Information Box */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex space-x-4 items-start shadow-sm">
                                <AlertCircle className="text-blue-500 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="text-secondary font-semibold mb-1">Booking Policy</h4>
                                    <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                        <li>We hold tables for a maximum of 15 minutes past the reservation time.</li>
                                        <li>For parties of 10+, a deposit may be required. Our team will contact you.</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end sm:space-x-6 gap-4 sm:gap-0 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-secondary rounded-xl font-semibold hover:bg-gray-50 transition-all text-center shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full sm:w-auto btn-primary py-4 px-10 rounded-xl text-lg flex items-center justify-center shadow-lg hover:shadow-primary/20 transition-all ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0 mr-3" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        'Reserve Table'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BookTable;
