import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShoppingBag, MapPin, CalendarCheck, LogOut, Save, ArrowLeft, Calendar, Package, ChevronRight, Clock, CheckCircle2, Truck, CookingPot, Eye, Plus, Home, Briefcase, MoreHorizontal, X, Phone, Mail, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import PhoneInput from '../components/PhoneInput';

// ====================
// MOCK DATA
// ====================
const MOCK_ORDERS = [
    {
        id: 'ORD-7KF3X2',
        date: '5 Mar 2026, 2:10 pm',
        status: 'Delivered',
        paymentStatus: 'Paid',
        items: [
            { name: 'Classic Masala Dosa', qty: 2, price: 8.50, image: '/images/masal dosa.jpg' },
            { name: 'Hyderabadi Chicken Biriyani', qty: 1, price: 13.50, image: '/images/Chicken Briyani.jpg' },
        ],
        total: 30.50,
        deliveryFee: 0,
        contact: { phone: '+44 7384 048311', email: 'tastybitesrestaurant7@gmail.com' }
    },
    {
        id: 'ORD-9AB1C4',
        date: '2 Mar 2026, 6:45 pm',
        status: 'Preparing',
        paymentStatus: 'Paid',
        items: [
            { name: 'Kerala Parotta', qty: 4, price: 3.50, image: '/images/onion pakoda.jpg' },
            { name: 'Paneer Butter Masala', qty: 1, price: 11.95, image: '/images/Paneer Butter Masala.jpg' },
        ],
        total: 25.95,
        deliveryFee: 0,
        contact: { phone: '+44 7384 048311', email: 'tastybitesrestaurant7@gmail.com' }
    },
    {
        id: 'ORD-5XY8Z1',
        date: '28 Feb 2026, 1:00 pm',
        status: 'Delivered',
        paymentStatus: 'Paid',
        items: [
            { name: 'Mutton Chukka', qty: 1, price: 15.50, image: '/images/Gongura mutton.jpg' },
        ],
        total: 15.50,
        deliveryFee: 0,
        contact: { phone: '+44 7384 048311', email: 'tastybitesrestaurant7@gmail.com' }
    },
];

const MOCK_ADDRESSES = [
    { id: 1, title: 'Home', type: 'home', line1: '42 Baker Street', line2: 'Flat 3B', landmark: 'Near the Park', city: 'London', state: 'England', zip: 'W1U 7EU' },
    { id: 2, title: 'Work', type: 'work', line1: '100 Regent Street', line2: 'Suite 5', landmark: '', city: 'London', state: 'England', zip: 'W1B 5SF' },
];

const MOCK_RESERVATIONS = [
    { id: 'RES-001', date: '2026-03-10', time: '19:00', guests: 4, occasion: 'Birthday', status: 'Upcoming', name: 'Tasty Bites Admin' },
    { id: 'RES-002', date: '2026-02-14', time: '20:00', guests: 2, occasion: 'Anniversary', status: 'Past', name: 'Tasty Bites Admin' },
    { id: 'RES-003', date: '2026-03-20', time: '18:30', guests: 6, occasion: 'Business Meeting', status: 'Upcoming', name: 'Tasty Bites Admin' },
];

const ORDER_STATUSES = ['All', 'Delivered', 'Preparing', 'Confirmed', 'Cancelled'];
const ORDER_TIMELINE = ['Order Placed', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];

const statusColor = (s) => {
    if (s === 'Delivered') return 'bg-green-100 text-green-700';
    if (s === 'Preparing') return 'bg-yellow-100 text-yellow-700';
    if (s === 'Confirmed') return 'bg-blue-100 text-blue-700';
    if (s === 'Cancelled') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
};

const getTimelineIndex = (status) => {
    const map = { 'Order Placed': 0, 'Confirmed': 1, 'Preparing': 2, 'Ready': 3, 'Out for Delivery': 4, 'Delivered': 5 };
    return map[status] ?? 0;
};

// ====================
// SUB-COMPONENTS
// ====================

// --- PROFILE TAB ---
const ProfileTab = ({ user, updateProfile }) => {
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            updateProfile({ name: formData.name, phone: formData.phone });
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 800);
    };

    const handlePhoneChange = (value) => {
        setFormData({ ...formData, phone: value });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Personal Info (7 col) */}
            <div className="lg:col-span-7">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-100">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center"><User size={26} /></div>
                        <div>
                            <h2 className="text-2xl font-playfair text-secondary">Personal Information</h2>
                            <p className="text-sm text-gray-500">Update your personal details</p>
                        </div>
                    </div>
                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50 focus:bg-white transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="ml-2 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Not editable</span></label>
                            <input type="email" value={formData.email} disabled className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <PhoneInput
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                className="rounded-xl overflow-hidden border border-gray-200"
                                isDark={true}
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isSaving} className={`btn-primary py-4 px-10 rounded-xl flex items-center space-x-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}>
                                {isSaving ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></> : saved ? <><Save size={18} /><span className="text-green-200">Saved!</span></> : <><Save size={18} /><span>Save Changes</span></>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* Stats + Quick Actions (5 col) */}
            <div className="lg:col-span-5 space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-playfair text-secondary mb-6">Account Stats</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-brand-cream/50 rounded-2xl p-5 text-center">
                            <Calendar size={20} className="text-primary mx-auto mb-2" />
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Member Since</p>
                            <p className="text-base font-bold text-secondary">{user?.memberSince || 'N/A'}</p>
                        </div>
                        <div className="bg-brand-cream/50 rounded-2xl p-5 text-center">
                            <Package size={20} className="text-primary mx-auto mb-2" />
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Orders</p>
                            <p className="text-base font-bold text-secondary">{user?.totalOrders || 0}</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-playfair text-secondary mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        {[
                            { icon: <ShoppingBag size={20} />, label: 'View My Orders', desc: 'Track and review past orders', tab: 'orders' },
                            { icon: <MapPin size={20} />, label: 'Manage Addresses', desc: 'Add or edit delivery addresses', tab: 'addresses' },
                            { icon: <CalendarCheck size={20} />, label: 'My Reservations', desc: 'View and manage bookings', tab: 'reservations' },
                        ].map((a, i) => (
                            <button key={i} onClick={() => window.history.pushState(null, '', `/profile?tab=${a.tab}`) || window.dispatchEvent(new PopStateEvent('popstate'))} className="w-full flex items-center space-x-4 p-4 rounded-2xl hover:bg-brand-cream/50 transition-colors group text-left">
                                <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">{a.icon}</div>
                                <div className="flex-1">
                                    <p className="font-semibold text-secondary text-sm group-hover:text-primary transition-colors">{a.label}</p>
                                    <p className="text-xs text-gray-500">{a.desc}</p>
                                </div>
                                <ChevronRight size={16} className="text-gray-300" />
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- ORDERS TAB ---
const OrdersTab = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('Newest first');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getOrders();
            setOrders(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load orders.');
            toast.error(err.message || 'Failed to load orders.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => statusFilter === 'All' || o.status === statusFilter)
        .sort((a, b) => sortOrder === 'Newest first' ? -1 : 1);

    if (selectedOrder) {
        return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${statusFilter === s ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}>{s}</button>
                    ))}
                </div>
                {!error && !isLoading && (
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm bg-white">
                        <option>Newest first</option>
                        <option>Oldest first</option>
                    </select>
                )}
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center">
                    <AlertCircle size={40} className="mx-auto mb-4" />
                    <p className="font-bold mb-2">Failed to load orders</p>
                    <p className="text-sm mb-6">{error}</p>
                    <button onClick={fetchOrders} className="btn-primary py-2 px-6 rounded-xl text-sm inline-flex items-center space-x-2">
                        <RefreshCw size={16} /><span>Try Again</span>
                    </button>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500 animate-pulse">Fetching your orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <ShoppingBag size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex -space-x-2">
                                        {(order.items || []).slice(0, 3).map((item, i) => (
                                            <img key={i} src={item.image} alt={item.name} className="w-12 h-12 rounded-xl border-2 border-white object-cover" />
                                        ))}
                                    </div>
                                    <div>
                                        <p className="font-bold text-secondary">{order.id}</p>
                                        <p className="text-xs text-gray-500">{order.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>{order.status}</span>
                                    <span className="font-bold text-secondary">£{(order.total || 0).toFixed(2)}</span>
                                    <button onClick={() => setSelectedOrder(order)} className="flex items-center space-x-1 text-primary hover:text-secondary text-sm font-semibold transition-colors">
                                        <Eye size={16} /><span>View</span>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-50">
                                <p className="text-xs text-gray-500">{(order.items || []).map(i => `${i.name} x${i.qty}`).join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// --- ORDER DETAIL ---
const OrderDetail = ({ order, onBack }) => {
    const currentStep = getTimelineIndex(order.status);
    const navigate = useNavigate();

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} className="flex items-center space-x-2 text-brand-text-light hover:text-primary transition-colors mb-8">
                <ArrowLeft size={18} /><span>Back to Orders</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                    {/* Order Status & Timeline */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-playfair text-secondary">Order Status</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <div className="relative">
                            {ORDER_TIMELINE.map((step, idx) => (
                                <div key={idx} className="flex items-start mb-6 last:mb-0">
                                    <div className="flex flex-col items-center mr-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentStep ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            {idx <= currentStep ? <CheckCircle2 size={16} /> : idx + 1}
                                        </div>
                                        {idx < ORDER_TIMELINE.length - 1 && <div className={`w-0.5 h-8 ${idx < currentStep ? 'bg-primary' : 'bg-gray-200'}`} />}
                                    </div>
                                    <div className="pt-1">
                                        <p className={`font-semibold text-sm ${idx <= currentStep ? 'text-secondary' : 'text-gray-400'}`}>{step}</p>
                                        {idx === 0 && <p className="text-xs text-gray-500">{order.date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-playfair text-secondary mb-6">Order Items</h3>
                        <div className="space-y-4">
                            {(order.items || []).map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                                        <div>
                                            <p className="font-semibold text-secondary text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-secondary">£{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    {/* Contact Details */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-playfair text-secondary mb-6">Contact Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Phone size={18} className="text-primary" />
                                <span className="text-sm text-gray-600">{order.contact?.phone || order.customerPhone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail size={18} className="text-primary" />
                                <span className="text-sm text-gray-600">{order.contact?.email || order.customerEmail || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-playfair text-secondary mb-6">Order Summary</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-600"><span>Item Subtotal</span><span>£{(order.total || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between text-sm text-gray-600"><span>Delivery Fee</span><span className="text-green-600 font-semibold">Free</span></div>
                            <div className="flex justify-between text-lg font-bold text-secondary pt-3 border-t border-gray-100"><span>Total</span><span className="text-primary">£{(order.total || 0).toFixed(2)}</span></div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link to="/menu" className="flex-1 btn-primary py-3 rounded-xl flex items-center justify-center space-x-2 text-sm">
                                <ArrowRight size={16} /><span>Order Again</span>
                            </Link>
                            <button onClick={onBack} className="flex-1 py-3 rounded-xl border border-gray-200 text-secondary hover:border-primary hover:text-primary transition-colors text-sm font-semibold">
                                View All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- ADDRESSES TAB ---
const AddressesTab = () => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const emptyForm = { title: '', type: 'home', line1: '', line2: '', landmark: '', city: '', state: '', zip: '' };
    const [formData, setFormData] = useState(emptyForm);

    const fetchAddresses = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getAddresses();
            setAddresses(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load addresses. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const openAdd = () => { setFormData(emptyForm); setEditId(null); setError(null); setShowForm(true); };
    const openEdit = (addr) => { setFormData(addr); setEditId(addr.id); setError(null); setShowForm(true); };

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (editId) {
                const updated = await api.updateAddress(editId, formData);
                setAddresses(prev => prev.map(a => a.id === editId ? updated : a));
            } else {
                const created = await api.createAddress(formData);
                setAddresses(prev => [...prev, created]);
            }
            setShowForm(false);
        } catch (err) {
            setError(err.message || 'Failed to save address. Please try again.');
        }
    };

    const typeIcon = (t) => {
        if (t === 'home') return <Home size={18} />;
        if (t === 'work') return <Briefcase size={18} />;
        return <MoreHorizontal size={18} />;
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-playfair text-secondary">Saved Addresses</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your delivery addresses</p>
                </div>
                {!error && !isLoading && (
                    <button onClick={openAdd} className="btn-primary py-3 px-6 rounded-xl flex items-center space-x-2 text-sm">
                        <Plus size={18} /><span>Add New Address</span>
                    </button>
                )}
            </div>

            {error && (
                <div className="mb-8 bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <AlertCircle size={24} />
                        <div>
                            <p className="font-bold">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                    <button onClick={fetchAddresses} className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">
                        Retry
                    </button>
                </div>
            )}

            {/* Address Form Modal */}
            {showForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-playfair text-secondary">{editId ? 'Edit Address' : 'Add New Address'}</h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" placeholder="e.g. Home" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50">
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
                            <input required value={formData.line1} onChange={(e) => setFormData({ ...formData, line1: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" placeholder="Street address" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                            <input value={formData.line2} onChange={(e) => setFormData({ ...formData, line2: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" placeholder="Flat, suite, unit" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                            <input value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" placeholder="Near..." />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                <input required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                                <input required value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-gray-50" />
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-4 pt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="py-3 px-8 rounded-xl border border-gray-200 text-secondary hover:border-primary hover:text-primary transition-colors font-semibold text-sm">Cancel</button>
                            <button type="submit" className="btn-primary py-3 px-8 rounded-xl text-sm">Save Address</button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Address List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500 animate-pulse">Loading addresses...</p>
                </div>
            ) : addresses.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <MapPin size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No addresses saved yet</p>
                    <button onClick={openAdd} className="btn-primary py-3 px-8 rounded-xl text-sm">Add Your First Address</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                        <div key={addr.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">{typeIcon(addr.type)}</div>
                                    <div>
                                        <p className="font-bold text-secondary">{addr.title}</p>
                                        <span className="text-xs text-gray-400 uppercase tracking-wider">{addr.type}</span>
                                    </div>
                                </div>
                                <button onClick={() => openEdit(addr)} className="text-xs text-primary font-semibold hover:text-secondary transition-colors opacity-0 group-hover:opacity-100">Edit</button>
                            </div>
                            <p className="text-sm text-gray-600">{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                            {addr.landmark && <p className="text-xs text-gray-400 mt-1">{addr.landmark}</p>}
                            <p className="text-sm text-gray-600 mt-1">{addr.city}, {addr.state} {addr.zip}</p>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// --- RESERVATIONS TAB ---
const ReservationsTab = () => {
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReservations = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getReservations();
            setReservations(data || []);
        } catch (err) {
            setError(err.message || 'Failed to load reservations.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const filtered = reservations.filter(r => filter === 'All' || r.status === filter);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-playfair text-secondary">My Reservations</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your table bookings</p>
                </div>
                {!error && !isLoading && (
                    <button onClick={() => navigate('/book')} className="btn-primary py-3 px-6 rounded-xl flex items-center space-x-2 text-sm">
                        <Plus size={18} /><span>New Reservation</span>
                    </button>
                )}
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2 mb-8">
                {['All', 'Upcoming', 'Past'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${filter === f ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary'}`}>{f}</button>
                ))}
            </div>

            {error ? (
                <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center">
                    <AlertCircle size={40} className="mx-auto mb-4" />
                    <p className="font-bold mb-2">Failed to load reservations</p>
                    <p className="text-sm mb-6">{error}</p>
                    <button onClick={fetchReservations} className="btn-primary py-2 px-6 rounded-xl text-sm inline-flex items-center space-x-2">
                        <RefreshCw size={16} /><span>Try Again</span>
                    </button>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-gray-500 animate-pulse">Loading bookings...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <CalendarCheck size={48} className="text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No reservations found</p>
                    <button onClick={() => navigate('/book')} className="btn-primary py-3 px-8 rounded-xl text-sm">Make a Reservation</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(res => (
                        <div key={res.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                                        <CalendarCheck size={22} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-secondary">{res.id}</p>
                                        <p className="text-sm text-gray-600">{res.date} at {res.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">{res.guests || 0} guests</span>
                                    <span className="text-sm text-gray-600">•</span>
                                    <span className="text-sm text-gray-600">{res.occasion || 'General'}</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${res.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>{res.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// ====================
// MAIN PROFILE PAGE
// ====================
const TABS = [
    { key: 'profile', label: 'Profile', icon: <User size={18} /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { key: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
    { key: 'reservations', label: 'Reservations', icon: <CalendarCheck size={18} /> },
];

const ProfilePage = () => {
    const { user, logout, updateProfile, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Listen for popstate changes from quick action buttons
    useEffect(() => {
        const handler = () => {
            const params = new URLSearchParams(window.location.search);
            setSearchParams(params);
        };
        window.addEventListener('popstate', handler);
        return () => window.removeEventListener('popstate', handler);
    }, [setSearchParams]);

    if (!isAuthenticated || !user) return null;

    const setTab = (key) => setSearchParams({ tab: key });

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <div className="min-h-screen bg-brand-cream pt-28 pb-24">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-playfair text-secondary">Welcome, <span className="text-primary italic">{user.name?.split(' ')[0]}</span></h1>
                        <p className="text-gray-500 mt-1 text-sm">Manage your account</p>
                    </div>
                    <button onClick={handleLogout} className="mt-4 sm:mt-0 flex items-center space-x-2 text-red-500 hover:text-red-700 font-semibold transition-colors bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-xl text-sm">
                        <LogOut size={16} /><span>Sign Out</span>
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-10 flex overflow-x-auto">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setTab(tab.key)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-primary'}`}
                        >
                            {tab.icon}<span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'addresses' && <AddressesTab />}
                {activeTab === 'reservations' && <ReservationsTab />}
            </div>
        </div>
    );
};

export default ProfilePage;
