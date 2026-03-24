import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Utensils,
    Plus,
    Search,
    Edit2,
    Trash2,
    Loader2,
    X,
    Upload,
    ImageIcon,
    Leaf,
    Flame,
    Save,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Eye,
    EyeOff,
    CheckSquare,
    Square,
    AlertCircle,
    ChevronDown
} from 'lucide-react';
import { adminMenuApi } from '../services/adminApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { toast } from 'react-toastify';

const MenuModal = ({ isOpen, onClose, item, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'veg',
        description: '',
        price: '',
        image: '',
        popular: false,
        vegetarian: true,
        type: 'veg'
    });
    const [previewImage, setPreviewImage] = useState('');
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState(['VEG', 'NON-VEG', 'SIGNATURES', 'SEA FOOD', 'CURRIES', 'BIRIYANI', 'RICE AND BREADS']);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
                price: item.price !== null && item.price !== undefined ? String(item.price).replace('£', '') : ''
            });
            setPreviewImage(item.image || '');
        } else {
            setFormData({
                name: '',
                category: 'veg',
                description: '',
                price: '',
                image: '',
                popular: false,
                vegetarian: true,
                type: 'veg'
            });
            setPreviewImage('');
        }
        fetchCategories();
    }, [item, isOpen]);

    const fetchCategories = async () => {
        setCategoryLoading(true);
        try {
            const data = await adminMenuApi.getCategories();
            const requested = ['VEG', 'NON-VEG', 'SIGNATURES', 'SEA FOOD', 'CURRIES', 'BIRIYANI', 'RICE AND BREADS'];
            const legacy = ['Main Course', 'Appetizers', 'Appetizer', 'Desserts', 'Dessert', 'Beverages'];

            if (data && data.length > 0) {
                const fetchedNames = data.map(c => typeof c === 'string' ? c : c.name);
                const fromDb = fetchedNames.filter(c => !legacy.includes(c) && !requested.includes(c) && c !== 'Parotta and Idiyappam');
                setCategories([...requested, ...fromDb]);
            } else {
                setCategories(requested);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setCategoryLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                ...formData,
                price: parseFloat(formData.price) || 0
            });
            onClose();
        } catch (error) {
            console.error('Save failed:', error);
            toast.error(error.response?.data?.error || 'Failed to save menu item');
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
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{item ? 'Edit Dish' : 'Add New Dish'}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your menu item details</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="space-y-6">
                        {/* Name & Description */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dish Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all shadow-sm"
                                    placeholder="Enter dish name (e.g. Butter Chicken)"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-medium text-slate-600 focus:bg-white focus:border-admin-primary/20 outline-none transition-all resize-none shadow-sm"
                                    placeholder="Briefly describe the ingredients and taste..."
                                />
                            </div>
                        </div>

                        {/* Category & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full pl-5 pr-10 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price (£)</label>
                                <div className="relative">
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black">£</span>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-base font-bold text-slate-900 focus:bg-white focus:border-admin-primary/20 outline-none transition-all shadow-sm"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Popular & Available Toggles */}
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.popular ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <Flame size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">Popular</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.popular}
                                    onChange={e => setFormData({ ...formData, popular: e.target.checked })}
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.popular ? 'border-amber-500 bg-amber-500' : 'border-slate-200'}`}>
                                    {formData.popular && <CheckSquare size={12} className="text-white" />}
                                </div>
                            </label>
                            <label className={`flex items-center justify-between px-6 py-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.vegetarian ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    <Leaf size={18} />
                                    <span className="text-xs font-black uppercase tracking-widest">Vegetarian</span>
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.vegetarian}
                                    onChange={e => setFormData({ ...formData, vegetarian: e.target.checked, type: e.target.checked ? 'veg' : 'nonveg' })}
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.vegetarian ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
                                    {formData.vegetarian && <CheckSquare size={12} className="text-white" />}
                                </div>
                            </label>
                        </div>

                        {/* Image Upload Area */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dish Photo</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative w-48 aspect-square mx-auto rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-admin-primary/40 hover:bg-admin-primary/[0.02] transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-slate-50 shadow-inner"
                            >
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                            <Upload size={24} />
                                            <span className="text-[10px] font-black uppercase tracking-widest mt-2">Change Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center group-hover:scale-105 transition-transform p-4">
                                        <div className="w-12 h-12 bg-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-slate-200/50 mx-auto mb-3 text-slate-300 group-hover:text-admin-primary group-hover:shadow-admin-primary/20 transition-all">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-xs font-black text-slate-600">Upload Image</p>
                                        <p className="text-[8px] uppercase tracking-widest mt-1 text-slate-400 font-bold">PNG, JPG (5MB)</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-8 border-t border-slate-100 flex gap-4">
                    <button type="button" onClick={onClose} className="flex-1 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex-[1.5] bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={16} /> : <>{item ? 'Update Dish' : 'Save Dish'}</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const AdminMenuPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriesList, setCategoriesList] = useState(['All']);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            const data = await adminMenuApi.getAll();
            const items = Array.isArray(data) ? data : [];
            setMenuItems(items);

            // Derive categories for filter
            const unique = [...new Set(items.map(item => item.category))].filter(c => c !== 'Parotta and Idiyappam');
            setCategoriesList(['All', ...unique]);
        } catch (error) {
            console.error('Menu load failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (itemData) => {
        try {
            // Clean read-only fields
            const { id, createdAt, updatedAt, ...cleanData } = itemData;

            if (selectedItem) {
                await adminMenuApi.update(selectedItem.id, cleanData);
                toast.success('Dish updated successfully');
            } else {
                await adminMenuApi.create(cleanData);
                toast.success('New dish added successfully');
            }
            fetchMenu();
        } catch (error) {
            console.error('Operation failed:', error);
            toast.error(error.response?.data?.error || 'Operation failed');
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        try {
            await adminMenuApi.delete(itemToDelete.id);
            toast.success('Dish deleted successfully');
            fetchMenu();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Food Menu</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2 uppercase tracking-widest flex items-center gap-2">
                        <Utensils size={14} className="text-admin-primary" /> Manage your menu
                    </p>
                </div>
                <button
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-admin-primary transition-all shadow-2xl shadow-slate-200 overflow-hidden"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Add Item</span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-slate-100/50">
                <div className="flex flex-wrap items-center gap-2 py-1">
                    {categoriesList.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80 group px-2">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-admin-primary transition-colors" size={18} />
                    <input 
                        type="text"
                        placeholder="Search menu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-admin-primary/20 outline-none transition-all placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="py-40 flex flex-col items-center">
                        <Loader2 className="animate-spin text-admin-primary/40" size={48} />
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6">Loading...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="w-full overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preview</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Item Details</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Badges</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="w-20 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 group-hover:scale-105 transition-transform duration-500">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-xs">
                                                <p className="text-base font-black text-slate-900 tracking-tight mb-1">{item.name}</p>
                                                <p className="text-[11px] font-medium text-slate-400 line-clamp-1">{item.description}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-1.5 bg-white border border-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-base font-black text-slate-900 tracking-tighter">
                                            £{Number(String(item.price || 0).replace(/[^0-9.]/g, '')).toFixed(2)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                {item.vegetarian && <div className="w-8 h-8 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center border border-emerald-100" title="Veg"><Leaf size={14} /></div>}
                                                {item.popular && <div className="w-8 h-8 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-amber-100" title="Special"><Flame size={14} /></div>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity duration-300">
                                                <button
                                                    onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                                                    className="p-3 text-slate-400 hover:text-admin-primary hover:bg-admin-primary/5 rounded-2xl transition-all"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item)}
                                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-200">
                            <Utensils size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Catalog Empty</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-3">No dishes found in your menu</p>
                        <button
                            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                            className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
                        >
                            Add Your First Dish
                        </button>
                    </div>
                )}
            </div>

            <MenuModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setSelectedItem(null); }}
                item={selectedItem}
                onSave={handleSave}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }}
                onConfirm={handleDelete}
                title="Delete Menu Item"
                message="Are you sure you want to remove this dish from the menu? It will be permanently deleted."
                itemName={itemToDelete?.name}
            />
        </div>
    );
};

export default AdminMenuPage;
