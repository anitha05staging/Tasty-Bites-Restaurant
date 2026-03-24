import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Calendar, User, MessageSquare, Star, Award, ShieldCheck, ChevronRight, Send, Briefcase, Heart, Home, Users, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';
import PhoneInput from '../components/PhoneInput';
import api from '../services/api';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

const CateringPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        eventType: 'Corporate Gala',
        eventDate: '',
        guestCount: '',
        budget: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [activePackage, setActivePackage] = useState('signature');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value) => {
        setFormData(prev => ({ ...prev, phone: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullName || !formData.email || !formData.phone || !formData.guestCount) {
            toast.error('Please fill in all required fields (Name, Email, Phone, Guests)');
            return;
        }

        setIsLoading(true);
        try {
            await api.submitCatering({
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                eventType: formData.eventType,
                eventDate: formData.eventDate,
                guests: formData.guestCount,
                budget: formData.budget,
                details: formData.message
            });
            toast.success('Your catering inquiry has been sent! We will contact you shortly.', {
                position: "top-right",
                autoClose: 5000,
            });
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                eventType: 'Corporate Gala',
                eventDate: '',
                guestCount: '',
                budget: '',
                message: ''
            });
        } catch (error) {
            toast.error(error.message || 'Failed to submit inquiry. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const packageTiers = [
        {
            id: 'essential',
            name: 'Basic',
            icon: <Home className="text-secondary" />,
            description: 'Perfect for small home parties and family gatherings.',
            price: 'From £15/person',
            features: ['3 Appetizers', '2 Main Curries', 'Basmati Rice', '1 Dessert', 'Disposable Set'],
            color: 'bg-emerald-50/50'
        },
        {
            id: 'signature',
            name: 'Signature',
            icon: <Briefcase className="text-primary" />,
            description: 'Our most popular choice for corporate events and medium parties.',
            price: 'From £25/person',
            features: ['5 Appetizers', 'Live Dosa Counter', '4 Main Curries', 'Biriyani', '2 Desserts', 'Professional Staff'],
            color: 'bg-primary/5',
            popular: true
        },
        {
            id: 'grand',
            name: 'Premium',
            icon: <Heart className="text-accent" />,
            description: 'The ultimate experience for weddings and large events.',
            price: 'From £45/person',
            features: ['Unlimited Starters', 'Premium Live Counters', 'Multi-Course Buffet', 'Dessert Wall', 'Full Event Planning'],
            color: 'bg-secondary/5'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            {/* Immersive Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <img 
                        src="/images/catering_bg_modern.png" 
                        alt="Luxurious Indian Catering" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/80" />
                </motion.div>

                <div className="container relative z-10 text-center px-6 mt-[-10vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-xl border border-primary/20 text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-6 sm:mb-10 mx-auto whitespace-nowrap shadow-sm"
                        >
                            <Star size={14} className="animate-pulse" /> Authentic Indian Catering
                        </motion.div>
                        
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair text-white mb-6 sm:mb-8 leading-[1.1] tracking-tight px-2">
                             Authentic <span className="text-primary italic font-light drop-shadow-2xl text-2xl sm:text-4xl md:text-6xl">Indian Catering</span>
                        </h1>
                        
                        <p className="text-sm sm:text-lg md:text-xl text-white max-w-2xl mx-auto font-light leading-relaxed mb-10 sm:mb-12 px-6">
                            Delicious South Indian food for weddings, parties, and office events.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <motion.a 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href="#inquiry-form" 
                                className="btn-primary !px-8 !py-3 shadow-[0_20px_50px_rgba(192,75,42,0.3)] !text-sm whitespace-nowrap"
                            >
                                Request a Quote
                            </motion.a>
                            <a href="#packages" className="text-white font-bold flex items-center gap-3 hover:text-accent transition-all group py-4">
                                <span className="uppercase tracking-[0.2em] text-sm text-white/90">View Packages</span> 
                                <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Micro-Features */}
                <div className="absolute bottom-16 w-full hidden lg:flex justify-center gap-24 text-white/95">
                    {[
                        { icon: <Award size={20} />, text: "Expert Chefs" },
                        { icon: <ShieldCheck size={20} />, text: "Authentic Spices" },
                        { icon: <Users size={20} />, text: "Full Event Support" }
                    ].map((f, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + (i * 0.2) }}
                            className="flex items-center gap-4 group"
                        >
                            <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-accent/20 transition-colors">
                                {f.icon}
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-[0.25em]">{f.text}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Premium Detail Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] relative group">
                                <img 
                                    src="/images/authentic-spread.png" 
                                    alt="Catering Hospitality" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                                <div className="absolute inset-0 bg-slate-900/10" />
                            </div>
                            <div className="absolute -bottom-12 -right-12 p-12 bg-primary text-white rounded-[3rem] shadow-2xl hidden md:block">
                                <div className="text-5xl font-playfair mb-2 italic">15+</div>
                                <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Years of Heritage</div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-10"
                        >
                            <div>
                                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] block mb-6">About Our Catering</span>
                                <h2 className="text-4xl md:text-6xl font-playfair text-slate-900 leading-[1.1]">
                                    Traditional Taste, <br />
                                    <span className="text-primary italic font-light">Modern Service</span>
                                </h2>
                            </div>
                            
                            <p className="text-base text-slate-700 leading-relaxed font-medium">
                                We bring authentic South Indian flavors to your special events. Our team works hard to make sure your guests enjoy every meal.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                                {[
                                    { icon: <ShieldCheck className="text-primary" />, title: "Perfect Execution", desc: "We handle every detail with care." },
                                    { icon: <Users className="text-primary" />, title: "Event Planning", desc: "Dedicated event managers for every client." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-xl font-playfair text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-700 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Interactive Package Tiers */}
            <section id="packages" className="py-24 bg-white relative">
                <div className="container mx-auto px-6 text-center mb-16">
                    <span className="bg-primary/10 text-primary px-5 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] mb-6 inline-block italic">
                        Catering Packages
                    </span>
                    <h2 className="text-4xl md:text-6xl font-playfair text-slate-900">Packages for Every <span className="text-primary">Event Type</span></h2>
                </div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {packageTiers.map((tier) => (
                            <motion.div
                                key={tier.id}
                                onMouseEnter={() => setActivePackage(tier.id)}
                                whileHover={{ scale: 1.02 }}
                                className={`relative p-12 rounded-[3.5rem] border transition-all duration-500 cursor-pointer flex flex-col ${
                                    activePackage === tier.id 
                                    ? 'bg-slate-900 text-white shadow-2xl border-white/10' 
                                    : 'bg-white text-slate-900 border-slate-100 h-[95%] mt-auto'
                                }`}
                            >
                                {tier.popular && (
                                    <span className={`absolute -top-5 left-1/2 -translate-x-1/2 px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transition-colors duration-500 whitespace-nowrap ${
                                        activePackage === tier.id ? 'bg-accent text-white' : 'bg-primary text-white'
                                    }`}>
                                        Most Popular
                                    </span>
                                )}
                                
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-10 shadow-sm transition-colors duration-500 ${
                                    activePackage === tier.id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-900'
                                }`}>
                                    {tier.icon}
                                </div>
                                <h3 className="text-3xl font-playfair mb-6">{tier.name}</h3>
                                <p className={`text-sm mb-10 font-medium leading-relaxed transition-colors duration-500 ${
                                    activePackage === tier.id ? 'text-white/95' : 'text-slate-700'
                                }`}>
                                    {tier.description}
                                </p>
                                <div className="text-3xl font-black mb-12">{tier.price}</div>
                                
                                <div className="space-y-6 mb-16 flex-1">
                                    {tier.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-bold uppercase tracking-tight">
                                            <div className={`w-1.5 h-1.5 rounded-full ${activePackage === tier.id ? 'bg-accent' : 'bg-primary'}`} />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <motion.a 
                                    href="#inquiry-form" 
                                    whileHover={{ gap: '1rem' }}
                                    className={`w-full py-3 rounded-2xl font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs flex items-center justify-center gap-2 sm:gap-3 transition-all whitespace-nowrap ${
                                        activePackage === tier.id 
                                    ? 'bg-white text-slate-900' 
                                    : 'bg-slate-900 text-white'
                                }`}
                                >
                                    Select Package <ChevronRight size={16} className="shrink-0" />
                                </motion.a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modern Logic Inquiry Form */}
            <section id="inquiry-form" className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/4" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-24 items-center">
                        <div className="lg:w-2/5 space-y-12">
                            <div>
                                <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] block mb-6 px-4 py-2 bg-primary/10 rounded-full w-fit">Contact Us</span>
                                <h2 className="text-4xl md:text-5xl font-playfair text-slate-900 leading-[1.2]">
                                    Request a <br />
                                    <span className="text-primary italic font-light font-playfair text-3xl sm:text-4xl md:text-5xl">Quote</span>
                                </h2>
                                <p className="text-slate-700 mt-8 text-lg font-medium leading-relaxed">
                                    Our catering team is ready to help you plan your perfect event. Fill in the details and we'll reach out within 24 hours.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { icon: <Mail size={18} />, label: "Email", value: "catering@tastybites.co.uk" },
                                    { icon: <Phone size={18} />, label: "Phone", value: "+44 123 456 7890" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="w-14 h-14 bg-white shadow-md rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
                                            <p className="text-lg font-bold text-slate-900">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:w-3/5 w-full bg-white rounded-[3.5rem] p-8 md:p-14 border border-slate-200 shadow-[0_40px_100px_rgba(0,0,0,0.08)]">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Full Name *</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 transition-colors group-focus-within:text-primary" size={18} />
                                            <input 
                                                name="fullName"
                                                type="text" 
                                                required
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                placeholder="Enter your name" 
                                                className="w-full pl-12 sm:pl-16 pr-8 py-4 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-xs sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Email Address *</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 transition-colors group-focus-within:text-primary" size={18} />
                                            <input 
                                                name="email"
                                                type="email" 
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email" 
                                                className="w-full pl-12 sm:pl-16 pr-8 py-4 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:text-[11px] sm:placeholder:text-sm shadow-sm text-xs sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Phone Number *</label>
                                        <div className="shadow-sm rounded-2xl">
                                            <PhoneInput 
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="bg-slate-50 border-2 border-slate-100 rounded-2xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white"
                                                inputClassName="font-bold text-slate-900 placeholder:text-slate-300 placeholder:text-[11px] sm:placeholder:text-sm text-sm"
                                                isDark={true}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Event Type</label>
                                        <div className="relative group">
                                            <Award className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 transition-colors group-focus-within:text-primary" size={18} />
                                            <select 
                                                name="eventType"
                                                value={formData.eventType}
                                                onChange={handleChange}
                                                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer shadow-sm text-sm"
                                            >
                                                <option>Corporate Party</option>
                                                <option>Wedding Event</option>
                                                <option>Private Party</option>
                                                <option>Family Gathering</option>
                                                <option>Other Event</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Event Date</label>
                                        <div className="relative group catering-datepicker">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 transition-colors group-focus-within:text-primary z-10" size={18} />
                                            <Flatpickr
                                                value={formData.eventDate}
                                                onChange={([date]) => {
                                                    setFormData(prev => ({ ...prev, eventDate: date }));
                                                }}
                                                options={{
                                                    minDate: "today",
                                                    dateFormat: "d-m-Y",
                                                    disableMobile: true
                                                }}
                                                placeholder="Select Date"
                                                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Number of Guests *</label>
                                        <div className="relative group">
                                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 transition-colors group-focus-within:text-primary" size={18} />
                                            <input 
                                                name="guestCount"
                                                type="number" 
                                                required
                                                value={formData.guestCount}
                                                onChange={handleChange}
                                                placeholder="e.g. 100" 
                                                className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-sm text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Estimated Budget</label>
                                        <div className="relative group">
                                            <Wallet className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40 transition-colors group-focus-within:text-primary" size={18} />
                                            <input 
                                                name="budget"
                                                type="text" 
                                                value={formData.budget}
                                                onChange={handleChange}
                                                placeholder="e.g. £5000" 
                                                className="w-full pl-12 sm:pl-16 pr-8 py-4 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:text-[11px] sm:placeholder:text-sm shadow-sm text-xs sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-3 text-center sm:text-left block">Message</label>
                                    <div className="relative group">
                                        <MessageSquare className="absolute left-6 top-8 text-primary/40 transition-colors group-focus-within:text-primary" size={18} />
                                        <textarea 
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5" 
                                            placeholder="Tell us about your event details..." 
                                            className="w-full pl-12 sm:pl-16 pr-8 py-4 sm:py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:text-[11px] sm:placeholder:text-sm resize-none shadow-sm text-xs sm:text-sm"
                                        ></textarea>
                                    </div>
                                </div>

                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-3.5 rounded-2xl bg-slate-950 text-white font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-sm shadow-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 sm:gap-6 whitespace-nowrap ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 sm:gap-4">
                                            Submit Request <Send size={18} className="animate-bounce shrink-0" />
                                        </div>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CateringPage;
