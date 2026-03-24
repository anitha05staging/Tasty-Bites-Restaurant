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
    const [isLoading, setIsLoading] = useState(false);
    const [restaurantInfo, setRestaurantInfo] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchInfo = async () => {
            try {
                const data = await api.getRestaurantInfo();
                if (data) setRestaurantInfo(data);
            } catch (err) {
                console.error('Failed to fetch restaurant info:', err);
            }
        };
        fetchInfo();
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-slate-900 relative py-20 overflow-hidden border-t border-white/5">
            {/* Background Layer */}
            <div className="fixed inset-0 z-0">
                <img 
                    src="/images/contact_bg_modern.png" 
                    alt="Background" 
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80" />
            </div>

            <div className="relative z-10 pt-32 pb-24 min-h-screen flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                    >
                        {/* Title & Info Section */}
                        <div className="lg:col-span-12 text-center mb-16">
                            <motion.div variants={itemVariants} className="mb-6 inline-flex items-center space-x-2 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20 backdrop-blur-md">
                                <Send size={18} />
                                <span className="text-sm font-bold uppercase tracking-widest">Connect With Us</span>
                            </motion.div>
                            
                            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-playfair text-white mb-6 leading-tight">
                                Get In <span className="text-primary italic text-5xl md:text-7xl ml-2">Touch</span>
                            </motion.h1>
                            
                            <motion.p variants={itemVariants} className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                                Whether you're planning an event, have a question, or just want to share your experience, we're here to listen and help.
                            </motion.p>
                        </div>

                        {/* Info Cards Side */}
                        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                            {[
                                { icon: MapPin, label: "Visit Us", value: restaurantInfo?.address || "123 Curry Lane, London, SE1 7PB" },
                                { icon: Phone, label: "Call Us", value: restaurantInfo?.phone || "+44 20 7946 0123" },
                                { icon: Mail, label: "Email Us", value: restaurantInfo?.email || "tastybitesrestaurant7@gmail.com" }
                            ].map((info, idx) => (
                                <div key={idx} className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 group hover:border-primary/40 transition-all duration-500 shadow-2xl flex items-start space-x-5">
                                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                        <info.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{info.label}</p>
                                        <p className="text-white text-sm font-medium leading-relaxed">{info.value}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Hours Card */}
                            <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/10 group hover:border-primary/40 transition-all duration-500 shadow-2xl overflow-hidden relative">
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                                <h3 className="text-xl font-playfair text-white mb-6">Service <span className="text-primary italic">Hours</span></h3>
                                <div className="space-y-4">
                                    {[
                                        { day: "Mon - Thu", time: "11:30 - 22:00" },
                                        { day: "Fri - Sat", time: "11:30 - 23:00" },
                                        { day: "Sunday", time: "12:00 - 22:00", highlight: true }
                                    ].map((row, idx) => (
                                        <div key={idx} className={`flex justify-between items-center py-2 ${idx !== 2 ? 'border-b border-white/5' : ''}`}>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${row.highlight ? 'text-primary' : 'text-white/40'}`}>{row.day}</span>
                                            <span className={`text-sm font-bold ${row.highlight ? 'text-primary' : 'text-white'}`}>{row.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Form Section */}
                        <motion.div variants={itemVariants} className="lg:col-span-8">
                            <div className="bg-slate-900/40 backdrop-blur-[40px] rounded-[3.5rem] p-8 md:p-14 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative overflow-hidden group">
                                {/* Interactive Blobs */}
                                <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-[100px] transition-transform group-hover:scale-125 duration-1000" />
                                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-[100px] transition-transform group-hover:scale-125 duration-1000" />
                                
                                <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Your Full Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Alex Perry"
                                                className={`w-full px-6 py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder:text-white/20 placeholder:text-[11px] sm:placeholder:text-sm focus:ring-4 ${errors.name ? 'ring-red-500/20 border-red-500/50' : 'focus:ring-primary/20 focus:border-primary/40'} transition-all outline-none backdrop-blur-md shadow-inner text-sm sm:text-base font-medium`}
                                            />
                                            {errors.name && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Email Address</label>
                                            <input
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="alex@example.com"
                                                className={`w-full px-6 py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder:text-white/20 placeholder:text-[11px] sm:placeholder:text-sm focus:ring-4 ${errors.email ? 'ring-red-500/20 border-red-500/50' : 'focus:ring-primary/20 focus:border-primary/40'} transition-all outline-none backdrop-blur-md shadow-inner text-sm sm:text-base font-medium`}
                                            />
                                            {errors.email && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3 md:col-span-2 relative z-[20]">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Phone Number</label>
                                            <PhoneInput
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="backdrop-blur-md"
                                                inputClassName="!py-4 text-sm sm:text-base font-medium"
                                            />
                                            {errors.phone && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.phone}</p>}
                                        </div>
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Inquiry Subject</label>
                                            <div className="relative">
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="w-full px-6 py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white appearance-none cursor-pointer focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all outline-none h-[60px] backdrop-blur-md text-base font-medium"
                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23C04B2A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.2em 1.2em' }}
                                                >
                                                    <option className="bg-slate-900">General Inquiry</option>
                                                    <option className="bg-slate-900">Table Reservation</option>
                                                    <option className="bg-slate-900">Catering Event</option>
                                                    <option className="bg-slate-900">Feedback</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 ml-1">Your Message</label>
                                        <textarea
                                            name="message"
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="How can we assist you today?"
                                            className={`w-full px-6 py-4 bg-white/[0.05] border border-white/10 rounded-3xl text-white placeholder:text-white/20 placeholder:text-[11px] sm:placeholder:text-sm focus:ring-4 ${errors.message ? 'ring-red-500/20 border-red-500/50' : 'focus:ring-primary/20 focus:border-primary/40'} transition-all outline-none resize-none backdrop-blur-md shadow-inner text-sm sm:text-base font-medium`}
                                        ></textarea>
                                        {errors.message && <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1">{errors.message}</p>}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full relative overflow-hidden group/btn py-6 rounded-2xl text-xs sm:text-base font-extrabold uppercase tracking-[0.15em] sm:tracking-[0.25em] shadow-[0_20px_40px_rgba(192,75,42,0.3)] flex items-center justify-center space-x-3 transition-all whitespace-nowrap ${isLoading ? 'opacity-70 cursor-wait' : 'bg-primary text-white hover:shadow-[0_25px_50px_rgba(192,75,42,0.4)]'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                        {isLoading ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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

export default Contact;
