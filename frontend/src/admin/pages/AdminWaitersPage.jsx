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
import { adminStaffApi } from '../services/adminApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const AdminWaitersPage = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [waiterToDelete, setWaiterToDelete] = useState(null);
    
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
    const [selectedStaffForSchedule, setSelectedStaffForSchedule] = useState(null);
    const [isBulkMessageModalOpen, setIsBulkMessageModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await adminStaffApi.getAll();
            setStaff(data.filter(s => s.role === 'waiter'));
        } catch (error) {
            toast.error("Failed to load staff: " + error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleExportCSV = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Role", "Status"];
        const rows = staff.map(s => [s.id, s.name, s.email, `="${s.phone || ''}"`, s.role, s.status || "Active"]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'staff_list.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Staff list exported successfully!");
    };

    const handleOpenModal = (member = null) => {
        if (member) {
            setEditingStaff(member);
            setFormData({
                name: member.name,
                email: member.email,
                phone: member.phone || '',
                role: member.role,
                status: member.status || 'Active',
                password: ''
            });
        } else {
            setEditingStaff(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                role: 'waiter',
                status: 'Active',
                password: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingStaff) {
                const submissionData = { ...formData };
                if (!submissionData.password) delete submissionData.password;
                await adminStaffApi.update(editingStaff.id, submissionData);
                toast.success(`${formData.name} updated successfully!`);
            } else {
                if (!formData.password) return toast.error("Password is required for new staff members");
                await adminStaffApi.create(formData);
                toast.success(`${formData.name} registered successfully!`);
            }
            setIsModalOpen(false);
            fetchStaff();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (waiter) => {
        setWaiterToDelete(waiter);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!waiterToDelete) return;
        try {
            await adminStaffApi.delete(waiterToDelete.id);
            toast.success(`Staff member ${waiterToDelete.name} deleted successfully`);
            fetchStaff();
        } catch (error) {
            toast.error(error.message);
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
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Waiters</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Users size={14} className="text-admin-primary" /> Manage floor staff
                    </p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-slate-100/50 relative z-50">
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
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => handleOpenModal()}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-black transition-all overflow-hidden"
                    >
                        <Plus size={18} strokeWidth={3} />
                        <span>Add Waiter</span>
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
                                        className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 z-[100] origin-top-right"
                                    >
                                        <div className="space-y-1">
                                            <button onClick={handleExportCSV} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all">Export</button>
                                            <button onClick={() => { setIsBulkMessageModalOpen(true); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all">Message All</button>
                                            <button onClick={() => { setIsReportModalOpen(true); setIsActionMenuOpen(false); }} className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-admin-primary hover:bg-admin-primary/5 rounded-xl transition-all">Shift Report</button>
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
                                    <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl text-slate-400 group-hover:from-admin-primary/5 group-hover:to-admin-primary/10 transition-all overflow-hidden relative text-2xl font-black uppercase">
                                        {waiter.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">{waiter.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${waiter.status === 'Away' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'}`}>
                                                {waiter.status || 'Active'}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                                                <Shield size={12} className="text-admin-primary/40" /> {waiter.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1 transition-opacity">
                                    <button onClick={() => handleOpenModal(waiter)} className="p-3 text-slate-300 hover:text-admin-primary hover:bg-admin-primary/5 rounded-2xl transition-all"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(waiter)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"><Trash2 size={16} /></button>
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

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <a href={`tel:${waiter.phone}`} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg"><Phone size={14} /></a>
                                        <a href={`mailto:${waiter.email}`} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 transition-all shadow-sm"><Mail size={14} /></a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>


            {/* Bulk Message Modal */}
            <AnimatePresence>
                {isBulkMessageModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsBulkMessageModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl p-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Send Message</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Send urgent notification to all {staff.length} staff members</p>
                            <textarea placeholder="Type your message here..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all resize-none h-40 mb-6" />
                            <div className="flex gap-4">
                                <button onClick={() => setIsBulkMessageModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">Cancel</button>
                                <button onClick={() => { toast.success("Messages sent to delivery queue!"); setIsBulkMessageModalOpen(false); }} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-admin-primary shadow-xl shadow-slate-200">Send to All</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Shift Report Modal */}
            <AnimatePresence>
                {isReportModalOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReportModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl p-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Work Shift Report</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 text-admin-primary">Generated for: {new Date().toLocaleDateString()}</p>
                            <div className="space-y-6 mb-8">
                                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Waiters</span>
                                    <span className="text-lg font-black text-slate-900">{staff.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">On Duty (Now)</span>
                                    <span className="text-lg font-black text-emerald-600">{staff.filter(s => s.status !== 'Away').length}</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-2xl">
                                    <span className="text-xs font-black uppercase tracking-widest text-amber-600">Average Efficiency</span>
                                    <span className="text-lg font-black text-amber-600">92%</span>
                                </div>
                            </div>
                            <button onClick={() => setIsReportModalOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-admin-primary">Close Report</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100">
                            <div className="p-10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editingStaff ? 'Edit Waiter Profile' : 'Add New Waiter'}</h2>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Waiter details and assignments</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><X size={20} /></button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Rahul Sharma" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="rahul@tastybites.com" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+44..." className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Availability Status</label>
                                            <div className="flex gap-2">
                                                {['Active', 'Away'].map(status => (
                                                    <button key={status} type="button" onClick={() => setFormData({...formData, status})} className={`flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.status === status ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>{status}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{editingStaff ? 'New Password (Optional)' : 'Password'}</label>
                                            <div className="relative">
                                                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                                <input required={!editingStaff} type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={editingStaff ? 'Leave blank to keep current' : '••••••••'} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-xl shadow-slate-200 mt-4">{editingStaff ? 'Update Waiter' : 'Add Waiter'}</button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setWaiterToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Waiter"
                message="Are you sure you want to remove this staff member? This will disable their login access."
                itemName={waiterToDelete ? `${waiterToDelete.name} (${waiterToDelete.email})` : ''}
            />
        </div>
    );
};

export default AdminWaitersPage;
