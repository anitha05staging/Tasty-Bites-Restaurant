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

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Success Modal */}
            <AnimatePresence>
                {isConfirmed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-6"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-secondary/80 backdrop-blur-md"
                            onClick={() => setIsConfirmed(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 30 }}
                            className="relative bg-white rounded-[2.5rem] p-10 lg:p-14 max-w-lg w-full shadow-2xl text-center overflow-hidden border border-white/20"
                        >
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                            >
                                <CheckCircle2 size={40} strokeWidth={2.5} />
                            </motion.div>

                            <h2 className="text-3xl md:text-4xl font-playfair text-secondary mb-3">
                                Booking <span className="text-primary italic">Confirmed!</span>
                            </h2>
                            <p className="text-gray-500 mb-8">
                                Your table for <span className="font-semibold text-secondary">{formData.guests}</span> has been successfully reserved.
                            </p>

                            <div className="bg-brand-cream/50 rounded-2xl p-6 mb-8 border border-primary/10 backdrop-blur-sm">
                                <p className="text-xs text-gray-400 uppercase tracking-[0.2em] font-bold mb-2 text-center">Reference Number</p>
                                <p className="text-3xl font-mono font-bold text-primary tracking-widest text-center">{bookingRef}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => { setIsConfirmed(false); setFormData({ fullName: '', email: '', phone: '', date: '', guests: '2', occasion: 'None', specialRequests: '' }); }}
                                    className="flex-1 py-4 rounded-xl border-2 border-gray-100 text-secondary hover:border-primary hover:text-primary transition-all font-bold text-sm uppercase tracking-widest"
                                >
                                    New Booking
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex-1 btn-primary py-4 rounded-xl text-sm"
                                >
                                    Go Home
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Layer */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="/images/hero-bg.png" 
                    alt="Background" 
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-secondary/90 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-secondary/60 via-transparent to-secondary" />
            </div>

            <div className="relative z-10 pt-32 pb-24 min-h-screen flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                    >
                        {/* Title Section */}
                        <div className="lg:col-span-5 text-white">
                            <motion.div variants={formVariants} className="mb-6 inline-flex items-center space-x-2 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md">
                                <GlassWater size={18} />
                                <span className="text-sm font-bold uppercase tracking-widest">Fine Dining Experience</span>
                            </motion.div>
                            
                            <motion.h1 variants={formVariants} className="text-5xl md:text-7xl font-playfair mb-6 leading-tight">
                                Reserve <br />
                                <span className="text-primary italic">Your Table</span>
                            </motion.h1>
                            
                            <motion.p variants={formVariants} className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
                                Experience authentic South Indian flavors in an ambiance of elegance and warmth. Book now to ensure your spot at Tasty Bites.
                            </motion.p>

                            <motion.div variants={formVariants} className="space-y-6">
                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                        <AlertCircle className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Quick Reservation</h4>
                                        <p className="text-white/50 text-sm">Takes less than 2 minutes to book.</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 group">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                        <CheckCircle2 className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">Instant Confirmation</h4>
                                        <p className="text-white/50 text-sm">Receive immediate booking reference.</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Section */}
                        <motion.div 
                            variants={formVariants}
                            className="lg:col-span-7"
                        >
                            <div className="bg-white/[0.08] backdrop-blur-[25px] rounded-[3rem] p-8 md:p-12 border border-white/20 shadow-[0_25px_50px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                                {/* Decorative Gradients and Blobs */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-[80px] transition-transform group-hover:scale-125 duration-1000" />
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/20 rounded-full blur-[80px] transition-transform group-hover:scale-125 duration-1000" />
                                
                                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Full Name</label>
                                            <div className="relative group/input">
                                                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/80 group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    className={`w-full pl-16 pr-6 py-4 bg-white/20 border-2 ${errors.fullName ? 'border-red-500/50' : 'border-white/30 focus:border-primary/60'} rounded-2xl text-white placeholder:text-white/60 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-md shadow-lg font-medium`}
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.fullName}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Email Address</label>
                                            <div className="relative group/input">
                                                <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/80 group-focus-within/input:text-primary transition-colors" size={18} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`w-full pl-16 pr-6 py-4 bg-white/20 border-2 ${errors.email ? 'border-red-500/50' : 'border-white/30 focus:border-primary/60'} rounded-2xl text-white placeholder:text-white/60 focus:ring-4 focus:ring-primary/10 transition-all outline-none backdrop-blur-md shadow-lg font-medium`}
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-[50]">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Phone Number</label>
                                        <div className={`p-0.5 rounded-2xl transition-all ${errors.phone ? 'bg-red-500/20 border-red-500/50' : 'bg-transparent'}`}>
                                            <PhoneInput
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                dropdownDirection="top"
                                                className="rounded-2xl overflow-hidden bg-white/20 border-2 border-white/30 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/60 backdrop-blur-md shadow-lg"
                                                inputClassName="!py-4 text-white placeholder:text-white/60 font-medium"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.phone}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Reservation Date</label>
                                            <div className="relative group/input">
                                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/80 group-focus-within/input:text-primary z-10 pointer-events-none transition-colors" size={18} />
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
                                                    className={`w-full pl-16 pr-6 py-4 !bg-white/20 border-2 ${errors.date ? 'border-red-500/50' : 'border-white/30 focus:border-primary/60'} rounded-2xl text-white placeholder:text-white/60 focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer backdrop-blur-md shadow-lg font-medium`}
                                                    placeholder="Pick a date"
                                                />
                                            </div>
                                            {errors.date && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.date}</p>}
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Number of Guests</label>
                                            <div className="relative group/input">
                                                <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/80 group-focus-within/input:text-primary pointer-events-none transition-colors" size={18} />
                                                <select
                                                    name="guests"
                                                    value={formData.guests}
                                                    onChange={handleChange}
                                                    className="w-full pl-16 pr-12 py-4 bg-white/20 border-2 border-white/30 rounded-2xl text-white appearance-none cursor-pointer focus:ring-4 focus:ring-primary/10 focus:border-primary/60 transition-all outline-none backdrop-blur-md shadow-lg font-medium"
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C04B2A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.2em 1.2em' }}
                                                >
                                                    {[1,2,3,4,5,6,7,8,9,'10+'].map(num => (
                                                        <option key={num} value={num} className="bg-secondary text-white">{num} {num === '10+' ? 'People' : num === 1 ? 'Person' : 'People'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Special Requests</label>
                                        <textarea
                                            name="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-8 py-4 bg-white/20 border-2 border-white/30 rounded-[2rem] text-white placeholder:text-white/60 focus:ring-4 focus:ring-primary/10 focus:border-primary/60 transition-all outline-none resize-none backdrop-blur-md shadow-lg font-medium"
                                            placeholder="Tell us about special occasions, allergies, or seating preferences..."
                                        ></textarea>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full relative overflow-hidden group/btn py-6 rounded-2xl text-base font-bold uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(192,75,42,0.3)] flex items-center justify-center space-x-3 transition-all ${isSubmitting ? 'opacity-70 cursor-wait' : 'bg-primary text-white hover:shadow-[0_25px_50px_rgba(192,75,42,0.4)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Confirm My Reservation</span>
                                                <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            
            <style jsx="true">{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};

export default BookTable;
