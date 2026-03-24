import React, { useState, useRef, useEffect } from 'react';
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
import { getImageUrl } from '../../services/api';
import { adminInfoApi } from '../services/adminApi';

const InfoField = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
        <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
                <Icon size={18} />
            </div>
            <input 
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-200 outline-none transition-all shadow-sm"
            />
        </div>
    </div>
);

const AdminInfoPage = () => {
    const [info, setInfo] = useState({
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        description: '',
        logo: null
    });
    const [hours, setHours] = useState({
        open: '11:00 AM',
        close: '10:30 PM',
        days: 'Mon-Sun'
    });
    const [isEditingHours, setIsEditingHours] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchInfo();
    }, []);

    const fetchInfo = async () => {
        try {
            const data = await adminInfoApi.get();
            if (data) {
                setInfo({
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    website: data.website,
                    description: data.description,
                    logo: data.logo
                });
                if (data.openingHours) {
                    setHours(data.openingHours);
                }
            }
        } catch (err) {
            toast.error('Failed to load restaurant information');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Logo image must be less than 2MB');
                return;
            }
            
            const formData = new FormData();
            formData.append('logo', file);

            try {
                toast.info('Uploading logo...');
                const data = await adminInfoApi.uploadLogo(formData);
                if (data.success) {
                    setInfo({ ...info, logo: data.logoUrl });
                    toast.success('Logo uploaded successfully');
                }
            } catch (err) {
                toast.error('Failed to upload logo');
                console.error(err);
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await adminInfoApi.update({
                ...info,
                openingHours: hours
            });
            toast.success('Restaurant profile updated successfully');
        } catch (err) {
            toast.error(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const parseTime = (timeStr) => {
        if (!timeStr) return { hour: '12', minute: '00', period: 'AM' };
        const parts = timeStr.split(' ');
        let time = parts[0];
        let period = parts[1] || '';
        const [h, m] = time.split(':');
        let hh = parseInt(h);
        let mm = m || '00';
        if (!period) {
            period = (hh >= 12) ? 'PM' : 'AM';
            if (hh === 0) hh = 12;
            else if (hh > 12) hh -= 12;
        }
        return { 
            hour: hh.toString().padStart(2, '0'), 
            minute: mm.toString().padStart(2, '0').substring(0, 2), 
            period: period 
        };
    };

    const formatTime = (hour, minute, period) => {
        let h = parseInt(hour);
        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${minute}`;
    };

    const TimePicker = ({ label, value, onChange }) => {
        const { hour, minute, period } = parseTime(value);

        const handleHourChange = (newVal) => {
            let h = parseInt(newVal);
            if (isNaN(h)) h = 1;
            if (h < 1) h = 12;
            if (h > 12) h = 1;
            onChange(`${h.toString().padStart(2, '0')}:${minute} ${period}`);
        };

        const handleMinuteChange = (newVal) => {
            let m = parseInt(newVal);
            if (isNaN(m)) m = 0;
            if (m < 0) m = 59;
            if (m > 59) m = 0;
            onChange(`${hour}:${m.toString().padStart(2, '0')} ${period}`);
        };

        const handlePeriodChange = (newPeriod) => {
            onChange(`${hour}:${minute} ${newPeriod}`);
        };

        return (
            <div className="space-y-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
                <div className="flex items-center gap-1">
                    <input 
                        type="number" 
                        min="1" 
                        max="12"
                        value={parseInt(hour)}
                        onChange={(e) => handleHourChange(e.target.value)}
                        className="w-14 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 transition-all text-center"
                    />
                    <span className="text-slate-400 font-bold">:</span>
                    <input 
                        type="number" 
                        min="0" 
                        max="59"
                        step="1"
                        value={parseInt(minute)}
                        onChange={(e) => handleMinuteChange(e.target.value)}
                        className="w-14 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 transition-all text-center"
                    />
                    <select
                        value={period}
                        onChange={(e) => handlePeriodChange(e.target.value)}
                        className="w-16 p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 transition-all appearance-none text-center cursor-pointer"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Info</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Business details</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Branding */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-48 h-48 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto mb-6 relative group cursor-pointer overflow-hidden shadow-inner"
                        >
                            {info.logo ? (
                                <img src={getImageUrl(info.logo)} alt="Logo" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="text-slate-300 group-hover:text-slate-900 transition-colors flex flex-col items-center">
                                    <ImageIcon size={48} />
                                    <span className="text-[10px] font-bold uppercase mt-2">Upload Logo</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="text-white" size={24} />
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">{info.name || 'Your Restaurant'}</h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Main Branch</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Social</h4>
                        <div className="space-y-4">
                            {['Instagram', 'Facebook', 'Twitter'].map(social => (
                                <div key={social} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200 group">
                                    {social === 'Instagram' && <Instagram size={18} className="text-pink-500" />}
                                    {social === 'Facebook' && <Facebook size={18} className="text-blue-600" />}
                                    {social === 'Twitter' && <Twitter size={18} className="text-sky-500" />}
                                    <span className="text-[11px] font-bold text-slate-600 leading-none">{info.name || 'Restaurant'} {social}</span>
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
                                label="Name" 
                                icon={Store} 
                                value={info.name} 
                                onChange={(val) => setInfo({...info, name: val})}
                                placeholder="e.g. Tasty Bites"
                            />
                            <div className="md:col-span-2">
                                <InfoField 
                                    label="Email" 
                                    icon={Mail} 
                                    value={info.email} 
                                    onChange={(val) => setInfo({...info, email: val})}
                                    placeholder="contact@restaurant.com"
                                />
                            </div>
                            <InfoField 
                                label="Phone" 
                                icon={Phone} 
                                value={info.phone} 
                                onChange={(val) => setInfo({...info, phone: val})}
                                placeholder="+44 ..."
                            />
                            <InfoField 
                                label="Website" 
                                icon={Globe} 
                                value={info.website} 
                                onChange={(val) => setInfo({...info, website: val})}
                                placeholder="www.yoursite.com"
                            />
                        </div>

                        <InfoField 
                            label="Address" 
                            icon={MapPin} 
                            value={info.address} 
                            onChange={(val) => setInfo({...info, address: val})}
                            placeholder="Full street address"
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">About</label>
                            <textarea 
                                value={info.description || ''}
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
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Edit Hours</h4>
                                            <button onClick={() => setIsEditingHours(false)} className="text-slate-400 hover:text-slate-900"><X size={16} /></button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-8 items-start">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Schedule</label>
                                                <input 
                                                    type="text" 
                                                    value={hours.days} 
                                                    onChange={e => setHours({...hours, days: e.target.value})} 
                                                    placeholder="e.g. Mon-Sun"
                                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-slate-900 transition-all" 
                                                />
                                            </div>
                                            <TimePicker 
                                                label="Open"
                                                value={hours.open}
                                                onChange={(val) => setHours({...hours, open: val})}
                                            />
                                            <TimePicker 
                                                label="Close"
                                                value={hours.close}
                                                onChange={(val) => setHours({...hours, close: val})}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setIsEditingHours(false);
                                                toast.success('Opening schedule updated');
                                            }}
                                            className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-900/10 mt-2"
                                        >
                                            Save
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
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hours</p>
                                                <p className="text-base font-black text-slate-900 mt-1">{hours.days || 'Mon-Sun'}: {hours.open || '11:00'} - {hours.close || '22:30'}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setIsEditingHours(true)}
                                            className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                                        >
                                            Edit
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
