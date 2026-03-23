import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Plus, 
    Search, 
    Phone, 
    Mail, 
    MapPin, 
    Trash2, 
    Edit, 
    MoreHorizontal,
    MoreVertical,
    Briefcase,
    LayoutGrid,
    CheckCircle2,
    Calendar,
    ChevronRight,
    MessageSquare,
    ExternalLink,
    X,
    Shield,
    Key
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api';

const AdminWaitersPage = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'waiter',
        password: ''
    });

    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await api.getStaff();
            // Filter only waiters for this page
            setStaff(data.filter(s => s.role === 'waiter'));
        } catch (error) {
            toast.error("Failed to load staff: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingStaff(member);
            setFormData({
                name: member.name,
                email: member.email,
                phone: member.phone || '',
                role: member.role,
                password: '' // Don't show password on edit
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'waiter',
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                // If password is empty, don't send it for update
                const submissionData = { ...formData };
                if (!submissionData.password) delete submissionData.password;
                
                await api.updateStaff(editingStaff.id, submissionData);
                toast.success(`${formData.name} updated successfully!`);
            } else {
                if (!formData.password) {
                    return toast.error("Password is required for new staff members");
                }
                await api.createStaff(formData);
                toast.success(`${formData.name} registered successfully!`);
            }
            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this staff member?")) return;
        try {
            await api.deleteStaff(id);
            toast.success("Staff member deleted successfully");
            fetchStaff();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getStatusColor = (status) => {
        // Mock status for UI as real DB might not have 'Busy' yet
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Busy': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        }
    };

    const filteredWaiters = staff.filter(w => 
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Waiters Management</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} className="text-admin-primary" /> Floor Staff & Table Assignments
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-2xl shadow-slate-200 overflow-hidden"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    <span>Register Waiter</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-slate-100/50">
                <div className="relative w-full md:w-96 group px-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-admin-primary transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto px-2">
                    <button 
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-admin-primary transition-all"
                    >
                        <Calendar size={16} /> Schedule
                    </button>
                    <div className="relative">
                        <button 
                            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                            className="p-4 bg-white border border-slate-100 rounded-[1.5rem] text-slate-600 hover:border-admin-primary transition-all"
                        >
                            <MoreVertical size={18} />
                        </button>
                        
                        <AnimatePresence>
                            {isActionMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsActionMenuOpen(false)} />
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-50 origin-top-right"
                                    >
                                        <div className="space-y-1">
                                            {['Export Staff List', 'Bulk Message', 'Work Shift Report'].map(action => (
                                                <button 
                                                    key={action}
                                                    onClick={() => {
                                                        toast.info(`${action} feature coming soon!`);
                                                        setIsActionMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all"
                                                >
                                                    {action}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredWaiters.map((waiter) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={waiter.id}
                            className="bg-white rounded-[3.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl text-slate-400 group-hover:from-admin-primary/5 group-hover:to-admin-primary/10 transition-all overflow-hidden relative">
                                        <div className="uppercase font-black text-2xl tracking-tighter text-slate-400 group-hover:text-admin-primary">
                                            {waiter.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">{waiter.name}</h3>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                            <Shield size={12} className="text-admin-primary/40" /> {waiter.role}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(waiter)}
                                        className="p-3 text-slate-300 hover:text-admin-primary hover:bg-admin-primary/5 rounded-2xl transition-all"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(waiter.id)}
                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-[2rem] p-6 space-y-3 border border-slate-100/50">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400"><Mail size={14}/></div>
                                        <span className="text-xs font-bold truncate">{waiter.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm text-slate-400"><Phone size={14}/></div>
                                        <span className="text-xs font-bold">{waiter.phone || 'No phone set'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 text-center">Efficiency</span>
                                        <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-admin-primary w-[85%] rounded-full shadow-[0_0_8px_rgba(217,119,74,0.4)]" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <a 
                                            href={`tel:${waiter.phone}`}
                                            className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg"
                                        >
                                            <Phone size={14} />
                                        </a>
                                        <a 
                                            href={`mailto:${waiter.email}`}
                                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                                        >
                                            <Mail size={14} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredWaiters.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[4rem] border border-dashed border-slate-200">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No waiters found</h3>
                </div>
            )}

            {/* Schedule Modal Placeholder */}
            <AnimatePresence>
                {isScheduleModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsScheduleModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-12">
                                <div className="flex justify-between items-center mb-10">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Shift Schedule</h2>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                                            <Calendar size={14} className="text-admin-primary" /> Weekly Roster Management
                                        </p>
                                    </div>
                                    <button onClick={() => setIsScheduleModalOpen(false)} className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-[1.5rem] transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-dashed border-slate-200 text-center space-y-4">
                                    <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl border border-slate-100 text-admin-primary mb-6">
                                        <Briefcase size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Shift Planning Module</h3>
                                    <p className="text-sm font-medium text-slate-500 max-w-md mx-auto leading-relaxed">
                                        The advanced scheduling engine allows you to drag & drop staff into morning, afternoon, and evening shifts. 
                                        This provides real-time availability sync for the booking system.
                                    </p>
                                    <div className="pt-6">
                                        <button 
                                            onClick={() => setIsScheduleModalOpen(false)}
                                            className="px-10 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-admin-primary transition-all shadow-xl shadow-slate-200"
                                        >
                                            Under Development
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                            {editingStaff ? 'Edit Staff Profile' : 'Register New Staff'}
                                        </h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personnel details and permissions</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input 
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <input 
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    placeholder="rahul@tastybites.com"
                                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                <input 
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    placeholder="+44..."
                                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Assignment</label>
                                            <div className="flex gap-2">
                                                {['waiter', 'chef'].map(role => (
                                                    <button
                                                        key={role}
                                                        type="button"
                                                        onClick={() => setFormData({...formData, role})}
                                                        className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                            formData.role === role 
                                                                ? 'bg-slate-900 text-white shadow-lg' 
                                                                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        {role}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                                {editingStaff ? 'New Password (Optional)' : 'Password'}
                                            </label>
                                            <div className="relative">
                                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                                <input 
                                                    required={!editingStaff}
                                                    type="password"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    placeholder={editingStaff ? 'Leave blank to keep current' : '••••••••'}
                                                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-xl shadow-slate-200 mt-4"
                                    >
                                        {editingStaff ? 'Save Changes' : 'Register Member'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminWaitersPage;
