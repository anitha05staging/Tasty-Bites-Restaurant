import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import PhoneInput from './PhoneInput';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState(null);

    React.useEffect(() => {
        const fetchInfo = async () => {
            try {
                const data = await api.getRestaurantInfo();
                if (data) setInfo(data);
            } catch (err) {
                console.error('ContactSection info fetch error:', err);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsLoading(true);
        try {
            await api.submitContact({
                ...formData,
                subject: 'Homepage General Inquiry'
            });
            
            toast.success('Thank you! Your message has been sent successfully.');
            
            // Clear form
            setFormData({
                name: '',
                email: '',
                phone: '',
                message: ''
            });
        } catch (err) {
            toast.error(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
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
                        className="bg-slate-50 border border-slate-100 p-8 sm:p-10 lg:p-16 rounded-[2.5rem] flex flex-col justify-between"
                    >
                        <div>
                            <span className="text-primary font-semibold tracking-widest uppercase text-sm block mb-4">Visit Us</span>
                            <h2 className="text-slate-900 font-playfair text-4xl md:text-5xl leading-tight mb-8">
                                Let's Start a <br /><span className="text-primary italic">Delicious Conversation</span>
                            </h2>

                            <div className="space-y-8 mt-12">
                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Our Location</h3>
                                        <p className="text-slate-500">{info?.address || "123 High Street, Kensington, London W8 5SF"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Phone Number</h3>
                                        <p className="text-slate-500">{info?.phone || "+44 1792 951309"}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Email Address</h3>
                                        <p className="text-slate-500 break-all">{info?.email || "tastybitesrestaurant7@gmail.com"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-primary/10">
                            <p className="text-slate-800 font-bold mb-2 uppercase tracking-widest text-[10px]">Social Hub</p>
                            <div className="flex flex-wrap gap-3">
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
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 ml-1">Full Name</label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-[11px] sm:placeholder:text-sm text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 ml-1">Email</label>
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none placeholder:text-[11px] sm:placeholder:text-sm text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 ml-1">Phone Number</label>
                                <PhoneInput
                                    value={formData.phone}
                                    onChange={handlePhoneChange}
                                    required={true}
                                    isDark={true}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-900 mb-2 ml-1">Message</label>
                                <textarea
                                    required
                                    name="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none placeholder:text-[11px] sm:placeholder:text-sm text-sm"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className={`btn-primary w-full flex items-center justify-center space-x-3 group whitespace-nowrap text-[13px] sm:text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Send Message</span>
                                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shrink-0" />
                                    </div>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
export default ContactSection;
