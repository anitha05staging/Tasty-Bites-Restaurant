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

                <button 
                    onClick={() => { onSave(formData); onClose(); }}
                    className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                >
                    {testimonial ? 'Update Testimonial' : 'Save Testimonial'}
                </button>
            </motion.div>
        </div>
    );
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
                    <p className="text-slate-500 font-medium">Manage and curate customer testimonials for your digital storefront.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search feedback stream..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-admin-primary/10 transition-all shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={() => { setSelectedTestimonial(null); setIsModalOpen(true); }}
                        className="flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 transition-all active:scale-95 group"
                    >
                        <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add Testimonial
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Featured', 'Approved', 'Pending', 'Rejected'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2
                            ${filter === s 
                                ? 'bg-slate-900 text-white border-slate-900' 
                                : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center">
                    <Loader2 className="animate-spin text-admin-primary mb-6" size={48} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Syncing feedback data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map(t => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={t.id}
                                className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-admin-primary/10 group-hover:text-admin-primary transition-colors">
                                            <ThumbsUp size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 text-lg">{t.name}</h3>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        size={12} 
                                                        fill={i < t.rating ? '#f59e0b' : 'none'} 
                                                        className={i < t.rating ? 'text-amber-500' : 'text-slate-200'} 
                                                    />
                                                ))}
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{t.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 shadow-sm ${statusColors[t.status]}`}>
                                            {t.status}
                                        </span>
                                        <button 
                                            onClick={() => { setSelectedTestimonial(t); setIsModalOpen(true); }}
                                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-slate-600 font-medium italic mb-8 leading-relaxed text-lg">
                                    "{t.content}"
                                </p>

                                <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                                    <button 
                                        onClick={() => handleAction(t.id, 'Featured')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Star size={14} /> Feature
                                    </button>
                                    <button 
                                        onClick={() => handleAction(t.id, 'Approved')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <CheckCircle size={14} /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(t.id, 'Rejected')}
                                        className="p-3.5 bg-rose-500/10 hover:bg-rose-50 text-rose-500 hover:text-white rounded-xl transition-all"
                                    >
                                        <XCircle size={18} />
                                    </button>
                                    <button 
                                        onClick={() => confirmDelete(t)}
                                        className="p-3.5 bg-slate-50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
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
