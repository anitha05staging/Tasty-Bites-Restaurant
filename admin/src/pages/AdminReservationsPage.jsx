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
            const today = new Date().toISOString().split('T')[0];
            return r.date.includes(today);
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
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Table Bookings</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Manage your guest reservations</p>
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
                    { label: 'Bookings Today', value: stats.today, icon: Clock, color: 'text-blue-500' },
                    { label: 'Total Completed', value: stats.completed, icon: CheckCircle2, color: 'text-slate-400' }
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
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative group max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find Guest Name or Ref #..."
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
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guest Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Party Size</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-32 text-center text-slate-400">
                                        <Loader2 className="animate-spin text-slate-300 mx-auto mb-4" size={40} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Pulling Reservation Data...</p>
                                    </td>
                                </tr>
                            ) : filtered.length > 0 ? (
                                filtered.map(res => (
                                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-black ring-4 ring-slate-100">
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
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{new Date(res.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mt-0.5">
                                                    <Clock size={12} className="text-slate-300" /> {res.time}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 group-hover:bg-white transition-all">
                                                <Users size={14} className="text-slate-400" />
                                                <span className="text-sm font-black text-slate-900">{res.guests}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(res.status)}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
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
                                                <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200">
                                                    <MoreHorizontal size={18} />
                                                </button>
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
                                        <h3 className="text-xl font-bold text-slate-900">No Reservations Found</h3>
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
