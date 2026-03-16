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
    const [categories, setCategories] = useState(['veg', 'non-veg', 'signatures', 'sea food', 'curries', 'Biriyani', 'rice and breads', 'Parotta and Idiyappam']);
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
            const requested = ['veg', 'non-veg', 'signatures', 'sea food', 'curries', 'Biriyani', 'rice and breads', 'Parotta and Idiyappam'];
            const legacy = ['Main Course', 'Appetizers', 'Appetizer', 'Desserts', 'Dessert', 'Beverages'];

            if (data && data.length > 0) {
                const fromDb = data.filter(c => !legacy.includes(c) && !requested.includes(c));
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
                                className="relative aspect-video rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-admin-primary/40 hover:bg-admin-primary/[0.02] transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-slate-50 shadow-inner"
                            >
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                            <Upload size={32} />
                                            <span className="text-xs font-black uppercase tracking-widest mt-3">Change Photo</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center group-hover:scale-110 transition-transform">
                                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200/50 mx-auto mb-4 text-slate-300 group-hover:text-admin-primary group-hover:shadow-admin-primary/20 transition-all">
                                            <ImageIcon size={32} />
                                        </div>
                                        <p className="text-sm font-black text-slate-600">Upload Dish Image</p>
                                        <p className="text-[10px] uppercase tracking-widest mt-2 text-slate-400 font-bold">PNG or JPG, max 5MB</p>
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
            const unique = [...new Set(items.map(item => item.category))];
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
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Menu Items</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Manage your restaurant offerings</p>
                </div>
                <button
                    onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                    className="flex inline-flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-[1.25rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 transition-all active:scale-95 group"
                >
                    <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                    Add New Dish
                </button>
            </div>

            {/* Header & Search */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-admin-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search for a dish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-slate-50 border border-transparent rounded-xl text-sm font-medium focus:bg-white focus:border-slate-200 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {categoriesList.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="py-40 flex flex-col items-center">
                        <Loader2 className="animate-spin text-slate-300" size={48} />
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Refreshing catalog...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="w-full min-w-0 overflow-hidden">
                        <table className="w-full text-left table-auto">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-3 md:px-5 py-3 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Preview</th>
                                    <th className="px-3 md:px-5 py-3 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
                                    <th className="px-3 md:px-5 py-3 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-3 md:px-5 py-3 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                    <th className="px-3 md:px-5 py-3 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Badges</th>
                                    <th className="px-3 md:px-5 py-3 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-3 md:px-5 py-3">
                                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={18} /></div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-5 py-3">
                                            <p className="text-sm md:text-base font-bold text-slate-900 leading-none">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[200px]">{item.description}</p>
                                        </td>
                                        <td className="px-3 md:px-5 py-3">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-3 md:px-5 py-3">
                                            <span className="text-sm font-black text-slate-900 tracking-tight">£{Number(String(item.price || 0).replace(/[^0-9.]/g, '')).toFixed(2)}</span>
                                        </td>
                                        <td className="px-3 md:px-5 py-3 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {item.vegetarian && <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center" title="Veg"><Leaf size={12} /></div>}
                                                {item.popular && <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-md flex items-center justify-center" title="Special"><Flame size={12} /></div>}
                                            </div>
                                        </td>
                                        <td className="px-3 md:px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
                                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(item)}
                                                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200"
                                                >
                                                    <Trash2 size={16} />
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
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200">
                            <Utensils size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Items Found</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-sm text-center">Your menu catalog is currently empty or filtered out.</p>
                        <button
                            onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
                            className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                        >
                            Add Your First Item
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
        </div >
    );
};

export default AdminMenuPage;
