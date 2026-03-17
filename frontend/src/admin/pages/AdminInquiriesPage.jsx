import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MessageSquare, 
    Mail, 
    Phone, 
    Calendar, 
    Users, 
    Wallet, 
    RefreshCw, 
    Loader2, 
    Search, 
    FileText,
    ChevronLeft,
    ChevronRight,
    ExternalLink
} from 'lucide-react';
import { adminCateringApi } from '../services/adminApi';

const AdminInquiriesPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const statusStyles = {
        'New': 'bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-500/5',
        'In Progress': 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-500/5',
        'Quoted': 'bg-purple-50 text-purple-600 border-purple-100 shadow-sm shadow-purple-500/5',
        'Confirmed': 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5',
        'Cancelled': 'bg-red-50 text-red-600 border-red-100'
    };

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const data = await adminCateringApi.getAll();
            setInquiries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await adminCateringApi.updateStatus(id, newStatus);
            setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const filtered = inquiries.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-slate-900 mb-3">Catering Inquiries</h1>
                    <p className="text-slate-500 font-medium italic">Manage and respond to event catering requests.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-secondary outline-none focus:ring-4 focus:ring-admin-primary/5 transition-all shadow-sm placeholder:text-gray-300"
                        />
                    </div>
                    <button 
                        onClick={fetchInquiries}
                        className="flex items-center justify-center gap-3 bg-white border border-gray-100 hover:bg-gray-50 text-secondary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Refresh Data
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar pb-4">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Event Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Requirements</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-32 text-center">
                                        <Loader2 className="animate-spin text-admin-primary mx-auto mb-6" size={56} strokeWidth={1.5} />
                                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Inquiries...</p>
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? (
                                filtered.map(inquiry => (
                                    <motion.tr 
                                        layout
                                        key={inquiry.id} 
                                        className="hover:bg-admin-primary/[0.02] transition-all duration-300 group border-b border-gray-50/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.02)]"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-admin-brand-cream rounded-xl flex items-center justify-center text-secondary font-black text-xs uppercase border border-gray-100 shadow-sm transition-transform group-hover:scale-110">
                                                    {(inquiry.name || 'G').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-secondary">{inquiry.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{inquiry.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                    <Calendar size={14} className="text-gray-300" />
                                                    {inquiry.eventDate ? new Date(inquiry.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-admin-primary">
                                                    <Users size={14} />
                                                    {inquiry.guests || 'N/A'} Guests
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-[280px] space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs font-black text-secondary">
                                                    <Wallet size={14} className="text-gray-300" />
                                                    {inquiry.budget || 'Open Budget'}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-medium italic line-clamp-2 leading-relaxed">
                                                    "{inquiry.details || 'No additional intelligence provided.'}"
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col items-center gap-2">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusStyles[inquiry.status] || statusStyles['New']}`}>
                                                    {inquiry.status || 'New'}
                                                </span>
                                                <select 
                                                    value={inquiry.status || 'New'}
                                                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                                                    className="bg-transparent text-[8px] font-black uppercase tracking-widest text-gray-400 hover:text-secondary outline-none cursor-pointer transition-colors"
                                                >
                                                    {['New', 'In Progress', 'Quoted', 'Confirmed', 'Cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={() => window.location.href = `mailto:${inquiry.email}?subject=Tasty Bites Catering Inquiry`}
                                                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-[1.05] shadow-lg shadow-slate-900/10"
                                            >
                                                <ExternalLink size={14} /> Engage
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-40 text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-200">
                                            <MessageSquare size={48} strokeWidth={1} />
                                        </div>
                                        <h3 className="text-2xl font-playfair font-black text-secondary">Pipeline Clear</h3>
                                        <p className="text-gray-400 mt-2 font-medium italic">No active catering leads identified.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Monitoring {filtered.length} Potential Contracts
                    </p>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 cursor-not-allowed" disabled><ChevronLeft size={16} /></button>
                        <button className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 disabled:opacity-30 cursor-not-allowed" disabled><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInquiriesPage;
