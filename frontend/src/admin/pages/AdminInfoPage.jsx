import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Store, 
    MapPin, 
    Phone, 
    Mail, 
    Clock, 
    Globe, 
    Save, 
    Loader2,
    Upload,
    ImageIcon,
    Instagram,
    Facebook,
    Twitter,
    X
} from 'lucide-react';
import { toast } from 'react-toastify';

const InfoField = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
                <Icon size={18} />
            </div>
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-200 outline-none transition-all shadow-sm"
            />
        </div>
    </div>
);

const AdminInfoPage = () => {
    const [info, setInfo] = useState({
        name: 'Tasty Bites',
        address: '123 Curry Lane, London, SE1 7PB',
        phone: '+44 20 7946 0123',
        email: 'hello@tastybites.com',
        website: 'www.tastybites-uk.com',
        description: 'Authentic South Indian cuisine serving the heart of London with traditional recipes and modern flair.',
        logo: null
    });
    const [hours, setHours] = useState({
        open: '11:00',
        close: '22:30',
        days: 'Mon-Sun'
    });
    const [isEditingHours, setIsEditingHours] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setInfo({ ...info, logo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Restaurant profile updated successfully');
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Restaurant Profile</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Manage public business information</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Branding */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 h-32 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-6 relative group cursor-pointer overflow-hidden shadow-inner"
                        >
                            {info.logo ? (
                                <img src={info.logo} alt="Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            ) : (
                                <div className="text-slate-300 group-hover:text-slate-900 transition-colors flex flex-col items-center">
                                    <ImageIcon size={32} />
                                    <span className="text-[10px] font-bold uppercase mt-2">Upload Logo</span>
                                </div>
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">{info.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Main Branch</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Social Media</h4>
                        <div className="space-y-4">
                            {['Instagram', 'Facebook', 'Twitter'].map(social => (
                                <div key={social} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200 group">
                                    {social === 'Instagram' && <Instagram size={18} className="text-pink-500" />}
                                    {social === 'Facebook' && <Facebook size={18} className="text-blue-600" />}
                                    {social === 'Twitter' && <Twitter size={18} className="text-sky-500" />}
                                    <span className="text-[11px] font-bold text-slate-600 leading-none">Tasty Bites {social}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoField 
                                label="Restaurant Name" 
                                icon={Store} 
                                value={info.name} 
                                onChange={(val) => setInfo({...info, name: val})}
                                placeholder="e.g. Tasty Bites"
                            />
                            <InfoField 
                                label="Official Email" 
                                icon={Mail} 
                                value={info.email} 
                                onChange={(val) => setInfo({...info, email: val})}
                                placeholder="contact@restaurant.com"
                            />
                            <InfoField 
                                label="Contact Number" 
                                icon={Phone} 
                                value={info.phone} 
                                onChange={(val) => setInfo({...info, phone: val})}
                                placeholder="+44 ..."
                            />
                            <InfoField 
                                label="Website URL" 
                                icon={Globe} 
                                value={info.website} 
                                onChange={(val) => setInfo({...info, website: val})}
                                placeholder="www.yoursite.com"
                            />
                        </div>

                        <InfoField 
                            label="Physical Address" 
                            icon={MapPin} 
                            value={info.address} 
                            onChange={(val) => setInfo({...info, address: val})}
                            placeholder="Full street address"
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">About Description</label>
                            <textarea 
                                value={info.description}
                                onChange={(e) => setInfo({...info, description: e.target.value})}
                                rows={4}
                                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-600 focus:bg-white focus:border-slate-200 outline-none transition-all resize-none shadow-sm"
                                placeholder="Give a brief story about your restaurant..."
                            />
                        </div>

                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                            <AnimatePresence mode="wait">
                                {isEditingHours ? (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Edit Opening Schedule</h4>
                                            <button onClick={() => setIsEditingHours(false)} className="text-slate-400 hover:text-slate-900"><X size={16} /></button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Days</label>
                                                <select value={hours.days} onChange={e => setHours({...hours, days: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none">
                                                    <option>Mon-Sun</option>
                                                    <option>Mon-Fri</option>
                                                    <option>Weekend</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Open</label>
                                                <input type="time" value={hours.open} onChange={e => setHours({...hours, open: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase">Close</label>
                                                <input type="time" value={hours.close} onChange={e => setHours({...hours, close: e.target.value})} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none" />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setIsEditingHours(false)}
                                            className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10 mt-2"
                                        >
                                            Update Schedule
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400">
                                                <Clock size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opening Schedule</p>
                                                <p className="text-base font-black text-slate-900 mt-1">{hours.days}: {hours.open} - {hours.close}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setIsEditingHours(true)}
                                            className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            Edit Schedule
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInfoPage;
