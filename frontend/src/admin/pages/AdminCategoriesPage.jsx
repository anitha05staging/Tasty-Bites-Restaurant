import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    Loader2, 
    X, 
    Save,
    Grid,
    MoreVertical,
    AlertCircle,
    ImageIcon,
    ChevronDown
} from 'lucide-react';
import { adminMenuApi, adminCategoriesApi } from '../services/adminApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { toast } from 'react-toastify';

const CategoryModal = ({ isOpen, onClose, category, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        active: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData(category);
        } else {
            setFormData({
                name: '',
                description: '',
                image: '',
                active: true
            });
        }
    }, [category, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{category ? 'Edit Category' : 'New Category'}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Group your menu items</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category Name</label>
                        <input 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-200 outline-none transition-all"
                            placeholder="e.g. Main Course"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Short Description</label>
                        <textarea 
                            rows={2}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 focus:bg-white focus:border-slate-200 outline-none transition-all resize-none"
                            placeholder="Briefly describe this category..."
                        />
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${formData.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Visible on Website</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.active}
                                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                                className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:ring-4 peer-focus:ring-admin-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-admin-primary"></div>
                        </label>
                    </div>
                </form>

                <div className="px-8 py-6 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={saving} 
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <>{category ? 'Update' : 'Create'}</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const AdminCategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // In this app, categories are derived from menu items or managed via a separate endpoint
        // For now, let's fetch unique categories from menu items as a fallback if no direct API
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const categoriesData = await adminCategoriesApi.getAll();
            const menuItems = await adminMenuApi.getAll();
            
            const transformed = categoriesData.map(cat => ({
                ...cat,
                count: menuItems.filter(i => i.category === cat.name).length
            }));
            
            setCategories(transformed);
        } catch (error) {
            console.error('Category fetch failed:', error);
            // Fallback for demo
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data) => {
        try {
            if (selectedCategory) {
                await adminCategoriesApi.update(selectedCategory.id, data);
                toast.success('Category updated');
            } else {
                await adminCategoriesApi.create(data);
                toast.success('Category created');
            }
            fetchCategories();
        } catch (error) {
            console.error('Save failed:', error);
            toast.error('Save failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await adminCategoriesApi.delete(categoryToDelete.id);
            toast.success('Category removed');
            fetchCategories();
        } catch (error) {
            toast.error('Delete failed');
            console.error('Delete failed:', error);
        }
    };

    const confirmDelete = (category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const filtered = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Food Categories</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Organize your menu for better browsing</p>
                </div>
                <button 
                    onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
                    className="flex inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                    New Category
                </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-slate-200 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-40 flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-300" size={48} />
                    </div>
                ) : filtered.length > 0 ? filtered.map((category) => (
                    <motion.div 
                        key={category.id}
                        layout
                        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Grid size={24} />
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => { setSelectedCategory(category); setIsModalOpen(true); }}
                                    className="p-2 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => confirmDelete(category)}
                                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{category.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{category.description}</p>
                        
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{category.count} Items</span>
                            <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${category.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                {category.active ? 'Active' : 'Hidden'}
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-40 flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                            <Grid size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Categories</h3>
                        <p className="text-sm text-slate-500 mt-2 text-center">Organize your menu by creating your first category.</p>
                    </div>
                )}
            </div>

            <CategoryModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setSelectedCategory(null); }}
                category={selectedCategory}
                onSave={handleSave}
            />

            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setCategoryToDelete(null); }}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? Dishes in this category will become uncategorized but will not be deleted."
                itemName={categoryToDelete?.name}
            />
        </div>
    );
};

export default AdminCategoriesPage;
