import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft, Plus, Minus, X, Check, ShoppingBag, Leaf, Drumstick, Utensils, Star, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// Fallback data with corrected image paths and premium descriptions
const fallbackMenuData = [
    { id: 1, name: 'Classic Masala Dosa', category: 'veg', description: 'Crispy rice and lentil crepe with our signature potato masala filling.', price: '£8.50', image: '/images/masal-dosa.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
    { id: 2, name: 'Chicken Tikka Dosa', category: 'non-veg', description: 'Hand-pulled spicy chicken tikka stuffed in a golden crispy dosa.', price: '£10.95', image: '/images/chicken-65.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
    { id: 3, name: 'Mysore Masala Dosa', category: 'signatures', description: 'Tangy red chili-garlic chutney spread with spiced potato filling.', price: '£9.25', image: '/images/mysore-dosa.png', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
    { id: 4, name: 'Chettinad Fish Curry', category: 'sea food', description: 'King fish simmered in a traditional aromatic Chettinad spice blend.', price: '£14.50', image: '/images/prawns-&-egg-curry--bagara-rice--1-drink.jpg', popular: false, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
    { id: 5, name: 'Paneer Butter Masala', category: 'curries', description: 'Tandoori paneer cubes bathed in a rich, velvety tomato-butter gravy.', price: '£11.95', image: '/images/paneer-butter-masala.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
    { id: 6, name: 'Hyderabadi Chicken Biriyani', category: 'Biriyani', description: 'Long-grain basmati rice slow-cooked with marinated chicken and saffron.', price: '£13.50', image: '/images/chicken-briyani.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
    { id: 7, name: 'Lemon Rice', category: 'rice and breads', description: 'Bright and zesty tempered rice with mustard seeds and fresh curry leaves.', price: '£5.50', image: '/images/ghee-rice.jpg', popular: false, vegetarian: true, dairyFree: true, glutenFree: true, type: 'veg' },
    { id: 8, name: 'Kerala Parotta', category: 'Parotta and Idiyappam', description: 'Traditional flaky, multi-layered flatbread toasted to perfection.', price: '£3.50', image: '/images/onion-pakoda.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: false, type: 'veg' },
    { id: 9, name: 'String Hoppers (Idiyappam)', category: 'Parotta and Idiyappam', description: 'Delicate steamed rice flour nests, served light and fresh.', price: '£4.50', image: '/images/medhu-vada.jpg', popular: false, vegetarian: true, dairyFree: true, glutenFree: true, type: 'veg' },
    { id: 10, name: 'Mutton Chukka', category: 'non-veg', description: 'Succulent mutton slow-roasted with crushed peppercorns and dry spices.', price: '£15.50', image: '/images/gongura-mutton.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' }
];

const categories = ['All', 'veg', 'non-veg', 'signatures', 'sea food', 'curries', 'Biriyani', 'rice and breads', 'Parotta and Idiyappam'];

const DineInMenuPage = () => {
    const { addToCart, cartItems, updateQuantity, setIsCartOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [filters, setFilters] = useState({ vegetarian: false, dairyFree: false, glutenFree: false });
    const [sortBy, setSortBy] = useState('popular');
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuData, setMenuData] = useState(fallbackMenuData);

    // Fetch menu from backend
    useEffect(() => {
        api.getMenu().then(data => {
            if (data && data.length > 0) {
                // Ensure data from backend also uses consistent paths or formatting if needed
                setMenuData(data);
            }
        }).catch(() => { /* use fallback */ });
    }, []);

    const toggleFilter = (filterName) => {
        setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    // Derived Data
    const filteredDishes = useMemo(() => {
        let result = [...menuData];

        // Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(d => d.name.toLowerCase().includes(lowerQ) || d.description.toLowerCase().includes(lowerQ));
        }

        // Category
        if (activeCategory !== 'All') {
            result = result.filter(d => d.category.toLowerCase() === activeCategory.toLowerCase());
        }

        // Checkbox Filters
        if (filters.vegetarian) result = result.filter(d => d.vegetarian);
        if (filters.dairyFree) result = result.filter(d => d.dairyFree);
        if (filters.glutenFree) result = result.filter(d => d.glutenFree);

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'priceLow' || sortBy === 'priceHigh') {
                const pA = parseFloat(String(a.price).replace(/[^0-9.]/g, ''));
                const pB = parseFloat(String(b.price).replace(/[^0-9.]/g, ''));
                return sortBy === 'priceLow' ? pA - pB : pB - pA;
            }
            if (sortBy === 'popular') return (a.popular === b.popular) ? 0 : a.popular ? -1 : 1;
            return 0;
        });

        return result;
    }, [searchQuery, activeCategory, filters, sortBy, menuData]);

    // Fast image failure recovery
    const handleImageError = (e) => {
        console.error(`[Menu Image Error] Failed to load: ${e.target.src}`);
        e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop';
        e.target.className = "w-full h-full object-cover opacity-60 grayscale-[0.5]";
    };

    // Item Card Component
    const DishCard = ({ dish, onClick }) => {
        const cartItem = cartItems.find(i => i.id === dish.id);
        const qty = cartItem ? cartItem.quantity : 0;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-emerald-50 relative"
            >
                <div className="relative h-60 cursor-pointer overflow-hidden" onClick={onClick}>
                    <img
                        src={dish.image}
                        alt={dish.name}
                        onError={handleImageError}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-5 left-5 flex flex-col space-y-2">
                        {dish.type === 'veg' ? (
                            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg flex items-center justify-center backdrop-blur-md" title="Vegetarian">
                                <Leaf size={14} fill="white" />
                            </div>
                        ) : (
                            <div className="bg-rose-600 text-white p-2 rounded-xl shadow-lg flex items-center justify-center backdrop-blur-md" title="Non-Vegetarian">
                                <Drumstick size={14} fill="white" />
                            </div>
                        )}
                        {dish.popular && (
                            <div className="bg-amber-400 text-emerald-900 p-2 rounded-xl shadow-lg flex items-center justify-center backdrop-blur-md">
                                <Star size={14} fill="currentColor" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors cursor-pointer" onClick={onClick}>
                            {dish.name}
                        </h3>
                        <span className="text-lg font-black text-emerald-600">{dish.price}</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 font-medium leading-relaxed">
                        {dish.description}
                    </p>

                    <div className="flex items-center space-x-3 mb-8">
                        {dish.glutenFree && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tight">Gluten-free</span>}
                        {dish.dairyFree && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tight">Dairy-free</span>}
                    </div>

                    <div className="flex items-center justify-between">
                        {qty === 0 ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                                className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold hover:bg-emerald-800 transition-all shadow-lg hover:shadow-emerald-900/20 active:scale-95 flex items-center justify-center relative overflow-hidden group/btn"
                            >
                                <span className="absolute inset-0 bg-amber-400/10 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
                                <Plus size={18} className="mr-2" />
                                Add to Order
                            </button>
                        ) : (
                            <div className="w-full flex items-center justify-between bg-emerald-50/50 py-2 px-2 rounded-2xl border border-emerald-100">
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(dish.id, -1); }}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all active:scale-90"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-xl font-black text-emerald-900 px-4">{qty}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(dish.id, 1); }}
                                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all active:scale-90"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FDFCF7] pt-10 pb-24">
            {/* Hero Header - Premium Style */}
            <div className="relative h-[400px] md:h-[500px] w-full mt-4 overflow-hidden">
                <img
                    src="/images/authentic-spread.png"
                    alt="Authentic Spread"
                    onError={handleImageError}
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-950/60 to-transparent" />

                <div className="absolute inset-0 flex items-center container mx-auto px-8 z-10">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center space-x-3 mb-6"
                        >
                            <span className="bg-amber-400 text-emerald-950 p-2.5 rounded-2xl shadow-xl">
                                <Award size={28} />
                            </span>
                            <span className="text-amber-400 font-black uppercase tracking-[0.3em] text-xs">Exquisite Dining</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight"
                        >
                            Dine-In <span className="text-amber-400 italic">Experience</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-emerald-50/80 text-lg md:text-xl font-medium max-w-lg leading-relaxed mb-10"
                        >
                            Immerse yourself in the vibrant flavors of South India, served in our refined restaurant setting.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link to="/" className="inline-flex items-center space-x-3 text-white hover:text-amber-400 transition-all font-bold group">
                                <div className="p-3 rounded-full border border-white/20 group-hover:border-amber-400 transition-colors backdrop-blur-md">
                                    <ArrowLeft size={20} />
                                </div>
                                <span className="uppercase tracking-widest text-sm">Return Home</span>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative border */}
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#FDFCF7] to-transparent" />
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Sidebar - Refined Glassmorphism */}
                    <aside className="w-full lg:w-1/4 space-y-8">
                        {/* Search */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50">
                            <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest mb-6 flex items-center">
                                <Search size={16} className="mr-3 text-amber-500" /> Search Dishes
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. Dosa, Biriyani..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-5 pr-5 py-4 bg-emerald-50/30 border-2 border-emerald-50 rounded-2xl focus:outline-none focus:border-emerald-500/30 text-emerald-950 placeholder-emerald-950/30 font-bold transition-all"
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-emerald-50">
                            <h3 className="text-sm font-black text-emerald-950 uppercase tracking-widest mb-6 pb-4 border-b border-emerald-50">Curated Menu</h3>
                            <div className="flex flex-col space-y-1.5">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all font-bold text-sm ${activeCategory.toLowerCase() === cat.toLowerCase()
                                                ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20'
                                                : 'text-emerald-900/60 hover:bg-emerald-50 hover:text-emerald-900'
                                            }`}
                                    >
                                        <span className="capitalize">{cat}</span>
                                        {activeCategory.toLowerCase() === cat.toLowerCase() && (
                                            <motion.div layoutId="cat-indicator" className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-emerald-900 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-900/40 text-white">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center text-amber-400">
                                <Filter size={16} className="mr-3" /> Preferences
                            </h3>

                            <div className="space-y-5">
                                <div className="mb-8">
                                    <p className="text-[10px] uppercase tracking-tighter text-emerald-300 mb-4">Sort By</p>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full bg-emerald-800/50 border border-emerald-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="popular">Most Popular First</option>
                                        <option value="name">Alphabetical (A-Z)</option>
                                        <option value="priceLow">Price: Light to Heavy</option>
                                        <option value="priceHigh">Price: Heavy to Light</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] uppercase tracking-tighter text-emerald-300 mb-2">Dietary Needs</p>
                                    {[
                                        { id: 'vegetarian', label: 'Vegetarian Only' },
                                        { id: 'dairyFree', label: 'Dairy-Free Options' },
                                        { id: 'glutenFree', label: 'Gluten-Free Choice' }
                                    ].map(f => (
                                        <label key={f.id} className="flex items-center group cursor-pointer">
                                            <div
                                                onClick={() => toggleFilter(f.id)}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${filters[f.id] ? 'bg-amber-400 border-amber-400 text-emerald-900' : 'border-emerald-700'
                                                    }`}
                                            >
                                                {filters[f.id] && <Check size={14} strokeWidth={4} />}
                                            </div>
                                            <span className={`ml-3 text-sm font-bold transition-colors ${filters[f.id] ? 'text-white' : 'text-emerald-400 group-hover:text-white'}`}>
                                                {f.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="w-full lg:w-3/4">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-10 px-4 gap-4">
                            <div>
                                <h2 className="text-3xl font-playfair text-emerald-950 mb-1">Our <span className="text-emerald-600">Selection</span></h2>
                                <p className="text-emerald-900/40 text-xs font-bold uppercase tracking-widest">{filteredDishes.length} refined preparations found</p>
                            </div>
                        </div>

                        {filteredDishes.length > 0 ? (
                            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                <AnimatePresence mode='popLayout'>
                                    {filteredDishes.map(dish => (
                                        <DishCard key={dish.id} dish={dish} onClick={() => setSelectedItem(dish)} />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-[3rem] p-24 text-center shadow-xl shadow-emerald-900/5 border border-emerald-50 flex flex-col items-center">
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200 mb-8">
                                    <Search size={40} />
                                </div>
                                <h3 className="text-3xl font-playfair text-emerald-950 mb-4">No Matches Found</h3>
                                <p className="text-emerald-900/40 font-bold max-w-xs mb-10">We couldn't find any dishes matching your current selection.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); setFilters({ vegetarian: false, dairyFree: false, glutenFree: false }) }}
                                    className="bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all active:scale-95"
                                >
                                    Reset All Choices
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Premium Details Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-emerald-950/80 backdrop-blur-xl"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="bg-white rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-4xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/20 hover:bg-rose-600 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-all shadow-xl group"
                            >
                                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
                                <div className="relative bg-emerald-50">
                                    <img
                                        src={selectedItem.image}
                                        alt={selectedItem.name}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

                                    <div className="absolute bottom-8 left-8 flex space-x-3">
                                        {selectedItem.popular && (
                                            <div className="bg-amber-400 text-emerald-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center">
                                                <Award size={14} className="mr-2" /> Signature
                                            </div>
                                        )}
                                        <div className="bg-white/90 backdrop-blur-md text-emerald-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center">
                                            {selectedItem.type === 'veg' ? '100% Vegetarian' : 'Non-Vegetarian'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-12 flex flex-col justify-center">
                                    <div className="mb-10">
                                        <div className="flex items-center text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                                            <div className="w-8 h-px bg-emerald-600 mr-3" />
                                            {selectedItem.category}
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-playfair text-emerald-950 mb-6">{selectedItem.name}</h2>

                                        <div className="flex flex-wrap gap-3 mb-8">
                                            {selectedItem.glutenFree && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-wider">Natural Gluten-Free</span>}
                                            {selectedItem.dairyFree && <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-wider">Dairy-Free Choice</span>}
                                        </div>

                                        <p className="text-gray-500 font-medium leading-relaxed mb-10 text-lg">
                                            {selectedItem.description}
                                        </p>

                                        <div className="text-4xl font-black text-emerald-900">
                                            {selectedItem.price}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        {cartItems.find(i => i.id === selectedItem.id) ? (
                                            <div className="w-full flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-100">
                                                <button onClick={() => updateQuantity(selectedItem.id, -1)} className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-lg text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all active:scale-90">
                                                    <Minus size={24} />
                                                </button>
                                                <div className="text-center">
                                                    <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-900/40 mb-1">In your order</span>
                                                    <span className="text-2xl font-black text-emerald-900">{cartItems.find(i => i.id === selectedItem.id).quantity}</span>
                                                </div>
                                                <button onClick={() => updateQuantity(selectedItem.id, 1)} className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-lg text-emerald-900 hover:bg-emerald-900 hover:text-white transition-all active:scale-90">
                                                    <Plus size={24} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                                                className="w-full bg-emerald-900 text-white py-6 rounded-2xl font-black text-lg shadow-2xl hover:bg-emerald-800 transition-all flex items-center justify-center relative overflow-hidden group/btn"
                                            >
                                                <div className="absolute inset-0 bg-amber-400/20 translate-y-[100%] group-hover/btn:translate-y-0 transition-transform duration-500" />
                                                <ShoppingBag size={24} className="mr-4 relative z-10" />
                                                <span className="relative z-10 uppercase tracking-[0.2em]">Add to Order</span>
                                            </button>
                                        )}

                                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            Price inclusive of all taxes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DineInMenuPage;
