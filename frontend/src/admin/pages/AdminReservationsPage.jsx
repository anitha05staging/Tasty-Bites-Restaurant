import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calendar, 
    Users, 
    Clock, 
    Search, 
    RefreshCw, 
    Loader2, 
    FileText, 
    ChevronLeft, 
    ChevronRight,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    Phone,
    Mail,
    AlertCircle,
    User,
    ChevronDown
} from 'lucide-react';
import { adminReservationsApi } from '../services/adminApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { toast } from 'react-toastify';

const AdminReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToCancel, setItemToCancel] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const data = await adminReservationsApi.getAll();
            setReservations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Reservations load failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await adminReservationsApi.updateStatus(id, newStatus);
            toast.success(`Reservation ${newStatus}`);
            fetchReservations();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    const handleConfirmCancel = () => {
        if (!itemToCancel) return;
        handleUpdateStatus(itemToCancel.id, 'Cancelled');
    };

    const confirmCancel = (res) => {
        setItemToCancel(res);
        setIsDeleteModalOpen(true);
    };

    const stats = {
        upcoming: reservations.filter(r => r.status === 'Upcoming' || r.status === 'Pending').length,
        today: reservations.filter(r => {
            if (!r.date) return false;
            const resDate = new Date(r.date).toISOString().split('T')[0];
            const today = new Date().toISOString().split('T')[0];
            return resDate === today;
        }).length,
        completed: reservations.filter(r => r.status === 'Completed').length
    };

    const filtered = reservations.filter(r => {
        const matchesSearch = (r.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                            (r.bookingRef || '').includes(searchQuery);
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed':
            case 'Upcoming':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Completed':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Cancelled':
                return 'bg-rose-50 text-rose-600 border-rose-100';
            default:
                return 'bg-amber-50 text-amber-600 border-amber-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bookings</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Manage bookings</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchReservations}
                        className="p-3 text-slate-400 hover:text-slate-900 bg-white border border-slate-100 rounded-xl hover:shadow-sm transition-all"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block" />
                    <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                        {['All', 'Upcoming', 'Completed', 'Cancelled'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${statusFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'text-admin-primary' },
                    { label: 'Today', value: stats.today, icon: Clock, color: 'text-blue-500' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-slate-400' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group">
                        <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-110`}>
                            <stat.icon size={24} className={stat.color} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative group max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-xl text-sm font-medium focus:border-slate-300 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Guests</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-slate-400">
                                        <Loader2 className="animate-spin text-slate-300 mx-auto mb-4" size={40} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Loading...</p>
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? (
                                filtered.map(res => (
                                    <tr key={res.id} className={`hover:bg-slate-50/50 transition-colors group relative ${activeMenuId === res.id ? 'z-50' : 'z-0'}`}>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white text-sm font-black ring-4 ring-slate-100 shadow-lg shadow-slate-900/10 transition-transform group-hover:scale-105">
                                                    {(res.fullName || 'G').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">{res.fullName}</p>
                                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                                        <span className="flex items-center gap-1"><Phone size={10} /> {res.phone || 'No phone'}</span>
                                                        <span className="flex items-center gap-1 font-bold text-slate-300"># {res.bookingRef || 'LOCAL'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-black text-slate-900">{new Date(res.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5 mt-1 tracking-wider">
                                                    <Clock size={12} className="text-admin-primary" /> {res.time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 group-hover:bg-white transition-all shadow-sm">
                                                <Users size={14} className="text-admin-primary" />
                                                <span className="text-base font-black text-slate-900">{res.guests}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${getStatusStyle(res.status)}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {res.status !== 'Completed' && res.status !== 'Cancelled' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleUpdateStatus(res.id, 'Completed')}
                                                            className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                                                            title="Complete"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => confirmCancel(res)}
                                                            className="p-2.5 text-rose-400 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveMenuId(activeMenuId === res.id ? null : res.id)}
                                                        className={`p-2.5 rounded-xl transition-all border border-transparent ${activeMenuId === res.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900 hover:bg-white hover:border-slate-200'}`}
                                                    >
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                    
                                                    {activeMenuId === res.id && (
                                                        <>
                                                            <div 
                                                                className="fixed inset-0 z-10" 
                                                                onClick={() => setActiveMenuId(null)}
                                                            />
                                                            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-[100] overflow-hidden">
                                                                <button 
                                                                    onClick={() => {
                                                                        handleUpdateStatus(res.id, 'Confirmed');
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
                                                                >
                                                                    <CheckCircle2 size={14} /> Confirm
                                                                </button>
                                                                <button 
                                                                    onClick={() => {
                                                                        confirmCancel(res);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2"
                                                                >
                                                                    <XCircle size={14} /> Cancel
                                                                </button>
                                                                <div className="h-px bg-slate-50 my-1" />
                                                                <button 
                                                                    onClick={() => {
                                                                        toast.info(`Booking Ref: ${res.bookingRef || 'N/A'}`);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 flex items-center gap-2"
                                                                >
                                                                    <FileText size={14} /> Copy ID
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-40 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <Calendar size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">None Found</h3>
                                        <p className="text-sm text-slate-500 mt-2 italic">Try changing your filters or searching another guest.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-5 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {filtered.length} of {reservations.length} bookings
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-30" disabled><ChevronLeft size={18} /></button>
                        <button className="p-2 rounded-lg border border-slate-200 text-slate-400 disabled:opacity-30" disabled><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToCancel(null); }}
                onConfirm={handleConfirmCancel}
                title="Cancel Reservation"
                message="Are you sure you want to cancel this table booking? The guest will be notified."
                itemName={itemToCancel ? `${itemToCancel.fullName} (${itemToCancel.time})` : ''}
            />
        </div>
    );
};

export default AdminReservationsPage;
