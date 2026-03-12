import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Filter, ArrowLeft, Plus, Minus, X, Check, ShoppingBag, Leaf, Drumstick } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// Fallback data in case API is unavailable
const fallbackMenuData = [
    { id: 1, name: 'Classic Masala Dosa', category: 'veg', description: 'Crispy rice and lentil crepe with potato masala.', price: '£8.50', image: '/images/masal-dosa.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
    { id: 2, name: 'Chicken Tikka Dosa', category: 'non-veg', description: 'Spicy chicken tikka stuffed in a crispy dosa.', price: '£10.95', image: '/images/chicken-65.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
    { id: 3, name: 'Mysore Masala Dosa', category: 'signatures', description: 'Spicy red chutney with potato filling.', price: '£9.25', image: '/images/mysore-dosa.png', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
    { id: 4, name: 'Chettinad Fish Curry', category: 'sea food', description: 'Traditional spicy fish curry from Chettinad.', price: '£14.50', image: '/images/prawns-&-egg-curry--bagara-rice--1-drink.jpg', popular: false, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
    { id: 5, name: 'Paneer Butter Masala', category: 'curries', description: 'Cottage cheese in rich tomato gravy.', price: '£11.95', image: '/images/paneer-butter-masala.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: true, type: 'veg' },
    { id: 6, name: 'Hyderabadi Chicken Biriyani', category: 'Biriyani', description: 'Aromatic basmati rice cooked with spiced chicken.', price: '£13.50', image: '/images/chicken-briyani.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' },
    { id: 7, name: 'Lemon Rice', category: 'rice and breads', description: 'Tangy lemon-flavored basmati rice.', price: '£5.50', image: '/images/ghee-rice.jpg', popular: false, vegetarian: true, dairyFree: true, glutenFree: true, type: 'veg' },
    { id: 8, name: 'Kerala Parotta', category: 'Parotta and Idiyappam', description: 'Flaky, layered flatbread from Kerala.', price: '£3.50', image: '/images/onion-pakoda.jpg', popular: true, vegetarian: true, dairyFree: false, glutenFree: false, type: 'veg' },
    { id: 9, name: 'String Hoppers (Idiyappam)', category: 'Parotta and Idiyappam', description: 'Steamed rice flour noodles.', price: '£4.50', image: '/images/medhu-vada.jpg', popular: false, vegetarian: true, dairyFree: true, glutenFree: true, type: 'veg' },
    { id: 10, name: 'Mutton Chukka', category: 'non-veg', description: 'Dry roasted spicy mutton chunks.', price: '£15.50', image: '/images/gongura-mutton.jpg', popular: true, vegetarian: false, dairyFree: true, glutenFree: true, type: 'nonveg' }
];

const categories = ['All', 'veg', 'non-veg', 'signatures', 'sea food', 'curries', 'Biriyani', 'rice and breads', 'Parotta and Idiyappam'];

const MenuPage = () => {
    const { addToCart, cartItems, updateQuantity, setIsCartOpen } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [filters, setFilters] = useState({ vegetarian: false, dairyFree: false, glutenFree: false });
    const [sortBy, setSortBy] = useState('popular');
    const [selectedItem, setSelectedItem] = useState(null);
    const [menuData, setMenuData] = useState(fallbackMenuData);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0]);

    // Fetch menu from backend
    useEffect(() => {
        api.getMenu().then(data => {
            if (data && data.length > 0) setMenuData(data);
        }).catch(() => { /* use fallback */ });
    }, []);

    const toggleFilter = (filterName) => {
        setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    // Derived Data
    const filteredDishes = useMemo(() => {
        let result = menuData;

        // Search
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(d => d.name.toLowerCase().includes(lowerQ) || d.description.toLowerCase().includes(lowerQ));
        }

        // Category
        if (activeCategory !== 'All') {
            result = result.filter(d => d.category === activeCategory);
        }

        // Checkbox Filters
        if (filters.vegetarian) result = result.filter(d => d.vegetarian);
        if (filters.dairyFree) result = result.filter(d => d.dairyFree);
        if (filters.glutenFree) result = result.filter(d => d.glutenFree);

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'priceLow' || sortBy === 'priceHigh') {
                const pA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
                const pB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
                return sortBy === 'priceLow' ? pA - pB : pB - pA;
            }
            if (sortBy === 'popular') return (a.popular === b.popular) ? 0 : a.popular ? -1 : 1;
            return 0;
        });

        return result;
    }, [searchQuery, activeCategory, filters, sortBy]);

    // Item Card Component
    const DishCard = ({ dish, onClick }) => {
        const cartItem = cartItems.find(i => i.id === dish.id);
        const qty = cartItem ? cartItem.quantity : 0;

        return (
            <motion.div
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-brand-cream/50 flex flex-col h-full group"
            >
                <div className="relative h-48 cursor-pointer overflow-hidden" onClick={onClick}>
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    <div className="absolute top-4 left-4 flex space-x-2">
                        {dish.type === 'veg' ? (
                            <span className="bg-green-500 text-white p-1.5 rounded-md shadow-md" title="Vegetarian"><Leaf size={16} /></span>
                        ) : (
                            <span className="bg-red-500 text-white p-1.5 rounded-md shadow-md" title="Non-Vegetarian"><Drumstick size={16} /></span>
                        )}
                        {dish.popular && <span className="bg-accent text-secondary text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center">Popular</span>}
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-secondary cursor-pointer hover:text-primary transition-colors leading-tight" onClick={onClick}>
                            {dish.name}
                        </h3>
                        <span className="text-lg font-bold text-primary ml-2">{dish.price}</span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{dish.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {dish.glutenFree && <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">Gluten-free</span>}
                        {dish.dairyFree && <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">Dairy-free</span>}
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        {qty === 0 ? (
                            <button
                                onClick={(e) => { e.stopPropagation(); addToCart(dish); }}
                                className="w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:bg-primary transition-colors flex items-center justify-center"
                            >
                                <Plus size={18} className="mr-2" />
                                Add to Cart
                            </button>
                        ) : (
                            <div className="w-full flex items-center justify-between bg-brand-cream py-2 px-2 rounded-xl border border-primary/20">
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(dish.id, -1); }}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-secondary hover:text-primary transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="text-lg font-bold text-secondary">{qty}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(dish.id, 1); }}
                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-secondary hover:text-primary transition-colors"
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
        <div className="min-h-screen bg-brand-cream pt-10 pb-24">
            {/* Hero Header */}
            <div className="relative h-[300px] md:h-[450px] w-full overflow-hidden">
                <motion.div 
                    style={{ y: y1 }}
                    className="absolute inset-0 z-0"
                >
                    <img src="/images/menu-hero.png" alt="Menu Header" className="w-full h-full object-cover scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-brand-cream/10" />
                </motion.div>

                <motion.div 
                    style={{ opacity: opacityHero }}
                    className="absolute inset-0 flex items-center z-10"
                >
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="inline-flex items-center gap-3 px-4 py-2 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent rounded-full text-xs font-bold uppercase tracking-[0.4em] mb-6"
                            >
                                <ShoppingBag size={14} /> The Culinary Collection
                            </motion.div>
                            <h1 className="text-5xl md:text-8xl font-playfair text-white mb-6 leading-tight">
                                Order <span className="text-accent italic">Online</span>
                            </h1>
                            <p className="text-white/80 text-lg md:text-2xl font-light leading-relaxed max-w-xl">
                                Explore our masterfully crafted South Indian menu, staged for your personal sanctuary or shared celebrations.
                            </p>
                        </div>
                    </div>
                </motion.div>
                
                <div className="absolute top-1/2 -translate-y-1/2 right-12 z-20 hidden lg:block">
                    <Link to="/" className="group flex items-center space-x-4 text-white hover:text-accent transition-all duration-500 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-full backdrop-blur-xl border border-white/10 hover:border-accent/30 shadow-2xl">
                        <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                        <span className="font-bold uppercase tracking-[0.3em] text-[10px]">Back to home</span>
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left Sidebar: Search, Categories & Filters */}
                    <aside className="w-full lg:w-1/4 space-y-10">
                        {/* Search Input */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-playfair font-bold text-secondary mb-6 border-b border-gray-100 pb-4 flex items-center">
                                <Search size={20} className="mr-2 text-primary" /> Search
                            </h3>
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search dishes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 placeholder-gray-400 text-sm"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Categories List */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-playfair font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Categories</h3>
                            <ul className="space-y-2">
                                {categories.map(cat => (
                                    <li key={cat}>
                                        <button
                                            onClick={() => setActiveCategory(cat)}
                                            className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium capitalize text-sm ${activeCategory === cat ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-brand-cream hover:text-primary'}`}
                                        >
                                            {cat}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sort Filter */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-playfair font-bold text-secondary mb-6 border-b border-gray-100 pb-4 flex items-center">
                                <Filter size={20} className="mr-2 text-primary" /> Sort By
                            </h3>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-700 cursor-pointer appearance-none text-sm"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25em 1.25em' }}
                                >
                                    <option value="popular">Most Popular</option>
                                    <option value="name">Name (A-Z)</option>
                                    <option value="priceLow">Price (Low to High)</option>
                                    <option value="priceHigh">Price (High to Low)</option>
                                </select>
                            </div>
                        </div>

                        {/* Dietary Filters */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-playfair font-bold text-secondary mb-6 border-b border-gray-100 pb-4 flex items-center">
                                <Filter size={20} className="mr-2 text-primary" /> Dietary
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.vegetarian ? 'bg-primary border-primary text-white' : 'border-gray-300 group-hover:border-primary text-transparent'}`}>
                                        <Check size={14} />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">Vegetarian</span>
                                    <input type="checkbox" className="hidden" checked={filters.vegetarian} onChange={() => toggleFilter('vegetarian')} />
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.dairyFree ? 'bg-primary border-primary text-white' : 'border-gray-300 group-hover:border-primary text-transparent'}`}>
                                        <Check size={14} />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">Dairy-Free</span>
                                    <input type="checkbox" className="hidden" checked={filters.dairyFree} onChange={() => toggleFilter('dairyFree')} />
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.glutenFree ? 'bg-primary border-primary text-white' : 'border-gray-300 group-hover:border-primary text-transparent'}`}>
                                        <Check size={14} />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">Gluten-Free</span>
                                    <input type="checkbox" className="hidden" checked={filters.glutenFree} onChange={() => toggleFilter('glutenFree')} />
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content: Grid */}
                    <main className="w-full lg:w-3/4">

                        {/* Results Count & Mobile View Cart */}
                        <div className="flex justify-between items-center mb-6 px-2">
                            <p className="text-gray-500 font-medium">Showing <span className="text-secondary font-bold">{filteredDishes.length}</span> dishes</p>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="lg:hidden flex items-center text-primary font-bold hover:underline"
                            >
                                <ShoppingBag size={18} className="mr-2" /> View Cart
                            </button>
                        </div>

                        {/* Products Grid */}
                        {filteredDishes.length > 0 ? (
                            <motion.div 
                                variants={{
                                    hidden: { opacity: 0 },
                                    show: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1 }
                                    }
                                }}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredDishes.map(dish => (
                                        <motion.div
                                            key={dish.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 30 },
                                                show: { opacity: 1, y: 0 }
                                            }}
                                            layout
                                        >
                                            <DishCard dish={dish} onClick={() => setSelectedItem(dish)} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 flex flex-col items-center">
                                <Search size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-2xl font-playfair text-secondary mb-2">No dishes found</h3>
                                <p className="text-brand-text-light mb-6">Try adjusting your category, filters, or search terms.</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); setFilters({ vegetarian: false, dairyFree: false, glutenFree: false }) }}
                                    className="btn-outline"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Item Details Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-md"
                            >
                                <X size={20} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                                <div className="h-64 md:h-full relative bg-gray-100">
                                    <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                                    <div className="absolute top-4 left-4 flex space-x-2">
                                        {selectedItem.type === 'veg' ? (
                                            <span className="bg-green-500 text-white p-1.5 rounded-md shadow-md" title="Vegetarian"><Leaf size={16} /></span>
                                        ) : (
                                            <span className="bg-red-500 text-white p-1.5 rounded-md shadow-md" title="Non-Vegetarian"><Drumstick size={16} /></span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col h-full bg-white">
                                    <div className="flex-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">{selectedItem.category}</span>
                                        <h2 className="text-3xl font-playfair text-secondary mb-2">{selectedItem.name}</h2>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {selectedItem.glutenFree && <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">Gluten-free</span>}
                                            {selectedItem.dairyFree && <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">Dairy-free</span>}
                                        </div>
                                        <p className="text-gray-600 leading-relaxed mb-6">{selectedItem.description}</p>
                                        <p className="text-3xl font-bold text-primary">{selectedItem.price}</p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        {cartItems.find(i => i.id === selectedItem.id) ? (
                                            <div className="w-full flex items-center justify-between bg-brand-cream p-3 rounded-xl border border-primary/20">
                                                <button onClick={() => updateQuantity(selectedItem.id, -1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-secondary hover:text-primary transition-colors">
                                                    <Minus size={20} />
                                                </button>
                                                <span className="text-xl font-bold text-secondary">{cartItems.find(i => i.id === selectedItem.id).quantity} in Cart</span>
                                                <button onClick={() => updateQuantity(selectedItem.id, 1)} className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-secondary hover:text-primary transition-colors">
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                                                className="w-full btn-primary py-4 text-lg rounded-xl flex justify-center items-center"
                                            >
                                                <ShoppingBag size={20} className="mr-3" />
                                                Add to Cart
                                            </button>
                                        )}
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

export default MenuPage;
