import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, 
    Star, 
    CheckCircle, 
    XCircle, 
    Trash2, 
    Plus, 
    Search, 
    Filter,
    MoreVertical,
    ThumbsUp,
    Shield,
    Loader2,
    RefreshCw,
    X,
    Edit2,
    ChevronDown
} from 'lucide-react';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { adminTestimonialsApi } from '../services/adminApi';
import { toast } from 'react-toastify';

const TestimonialModal = ({ isOpen, onClose, testimonial, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        rating: 5,
        status: 'Pending'
    });

    useEffect(() => {
        if (testimonial) {
            setFormData(testimonial);
        } else {
            setFormData({ name: '', content: '', rating: 5, status: 'Pending' });
        }
    }, [testimonial, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 space-y-6"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{testimonial ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Customer Name</label>
                        <input 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-slate-200 transition-all"
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Testimonial Content</label>
                        <textarea 
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                            rows={4}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 outline-none focus:bg-white focus:border-slate-200 transition-all resize-none"
                            placeholder="What did they say?"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Rating</label>
                            <select 
                                value={formData.rating}
                                onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none appearance-none"
                            >
                                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</label>
                            <select 
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 outline-none appearance-none"
                            >
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Featured</option>
                                <option>Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-slate-900 transition-all">Cancel</button>
                    <button 
                        onClick={() => { onSave(formData); onClose(); }}
                        className="flex-[2] py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const toSentenceCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatReviewContent = (str) => {
    if (!str) return "";
    // Capitalize first letter and handle subsequent sentences roughly
    return str.toLowerCase().replace(/(^\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
};

const AdminTestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const data = await adminTestimonialsApi.getAll();
            // Transform data if needed (rating as number, date formatting)
            const transformed = data.map(t => ({
                ...t,
                rating: Number(t.rating) || 5,
                content: t.text || t.content // Server uses 'text', component uses 'content'
            }));
            setTestimonials(transformed);
        } catch (error) {
            console.error('Fetch failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        'Featured': 'bg-amber-500 text-white border-amber-600',
        'Approved': 'bg-emerald-500 text-white border-emerald-600',
        'Pending': 'bg-blue-500 text-white border-blue-600',
        'Rejected': 'bg-rose-500 text-white border-rose-600'
    };

    const handleAction = async (id, action) => {
        try {
            await adminTestimonialsApi.update(id, { status: action });
            toast.success(`Testimonial ${action}`);
            fetchTestimonials();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await adminTestimonialsApi.delete(itemToDelete.id);
            toast.success('Testimonial deleted');
            fetchTestimonials();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const confirmDelete = (testimonial) => {
        setItemToDelete(testimonial);
        setIsDeleteModalOpen(true);
    };

    const handleSave = async (data) => {
        try {
            const { id, createdAt, updatedAt, ...cleanData } = data;
            const payload = {
                ...cleanData,
                text: cleanData.content || cleanData.text
            };
            delete payload.content;

            if (selectedTestimonial) {
                await adminTestimonialsApi.update(selectedTestimonial.id, payload);
                toast.success('Testimonial updated');
            } else {
                await adminTestimonialsApi.create(payload);
                toast.success('Testimonial created');
            }
            fetchTestimonials();
        } catch (error) {
            toast.error('Save failed');
        }
    };

    const filtered = testimonials.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || t.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-playfair font-black text-slate-900 mb-3 tracking-tight">Testimonials</h1>
                    <p className="text-slate-500 font-medium text-sm">Review and manage all customer testimonials in one place.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search testimonials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:ring-4 focus:ring-admin-primary/10 transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => { setSelectedTestimonial(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all active:scale-95 group shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add Testimonial
                    </button>
                </div>
            </div>

            {/* Filter Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-48 text-left">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none appearance-none cursor-pointer hover:border-slate-200 transition-all shadow-sm"
                    >
                        {['All', 'Featured', 'Approved', 'Pending', 'Rejected'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
                
                {filter !== 'All' && (
                    <button 
                        onClick={() => setFilter('All')}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center">
                    <Loader2 className="animate-spin text-admin-primary mb-6" size={48} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Syncing feedback data...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-6">
                    <div className="w-full">
                        <table className="w-full text-left border-collapse min-w-full">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Review Content</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <AnimatePresence mode="popLayout">
                                    {filtered.map(t => (
                                        <motion.tr 
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            key={t.id}
                                            className="group hover:bg-slate-50/30 transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-black text-slate-900 text-sm tracking-tight whitespace-nowrap">{toSentenceCase(t.name)}</span>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star 
                                                                key={i} 
                                                                size={10} 
                                                                fill={i < t.rating ? '#f59e0b' : 'none'} 
                                                                className={i < t.rating ? 'text-amber-500' : 'text-slate-200'} 
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 max-w-[500px]">
                                                <div className="flex flex-col gap-1.5">
                                                    <p className="text-slate-600 font-medium text-xs leading-relaxed max-w-[400px]">
                                                        "{formatReviewContent(t.content)}"
                                                    </p>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.date || 'RECENT FEEDBACK'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusColors[t.status]}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleAction(t.id, 'Featured')}
                                                        className="p-2.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-xl transition-all shadow-sm border border-amber-100"
                                                        title="Feature"
                                                    >
                                                        <Star size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(t.id, 'Approved')}
                                                        className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(t.id, 'Rejected')}
                                                        className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all shadow-sm border border-rose-100"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                    <div className="w-px h-6 bg-slate-100 mx-1" />
                                                    <button 
                                                        onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true); }}
                                                        className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => confirmDelete(t)}
                                                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <MessageSquare size={48} className="text-slate-200 mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No testimonials found in this stream</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <TestimonialModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedTestimonial(null); }}
                testimonial={selectedTestimonial}
                onSave={handleSave}
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }}
                onConfirm={handleDelete}
                title="Remove Testimonial"
                message="Are you sure you want to remove this customer testimonial? It will no longer appear on the website."
                itemName={itemToDelete?.name}
            />
        </div>
    );
};

export default AdminTestimonialsPage;
