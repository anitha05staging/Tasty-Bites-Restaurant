import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, ArrowLeft, Lock, ShieldCheck, ChevronDown, Plus, Minus, Trash2, UtensilsCrossed, Clock, Info, User, Mail, Phone, MessageSquare } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import StripePaymentModal from '../components/StripePaymentModal';
import PhoneInput from '../components/PhoneInput';

const CheckoutPage = () => {
    const { cartItems, subtotal, clearCart, updateQuantity, removeFromCart, cartCount, orderType, tableNumber, setIsOrderTypeModalOpen } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [phone, setPhone] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [localTableNumber, setLocalTableNumber] = useState(tableNumber || '');
    const [collectionTime, setCollectionTime] = useState('');
    const [noteToChef, setNoteToChef] = useState('');
    const [errors, setErrors] = useState({});

    const [customerData, setCustomerData] = useState({
        fullName: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setCustomerData({
                fullName: user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.name || '',
                email: user.email || ''
            });
            if (user.phone) {
                setPhone(user.phone);
            }
        }
    }, [user]);

    useEffect(() => {
        if (tableNumber) {
            setLocalTableNumber(tableNumber);
        }
    }, [tableNumber]);

    useEffect(() => {
        if (!user && !isProcessing) {
            navigate('/signup', { state: { from: '/checkout' }, replace: true });
        }
    }, [user, isProcessing, navigate]);

    // If cart is empty, user shouldn't really be here
    if (cartItems.length === 0 && !isProcessing) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-24 px-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <UtensilsCrossed size={40} />
                </div>
                <h2 className="text-3xl font-playfair text-slate-900 mb-4">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-8 max-w-xs font-medium">Your cart is empty. Add something delicious to get started!</p>
                <Link to="/menu" className="btn-primary px-8 py-3 rounded-xl">Browse Menu</Link>
            </div>
        );
    }

    const total = subtotal + 0;

    const validateForm = () => {
        const newErrors = {};

        if (orderType === 'Collection' || orderType === 'Takeaway') {
            if (!customerData.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!customerData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
                newErrors.email = 'Invalid email format';
            }
            if (!phone.trim()) {
                newErrors.phone = 'Phone number is required';
            } else if (phone.length < 10) {
                newErrors.phone = 'Please enter a valid phone number';
            }
            if (!collectionTime || collectionTime === 'Select a time') {
                newErrors.collectionTime = 'Please select a collection time';
            }
        }

        if (orderType === 'Dine-In') {
            if (!localTableNumber.trim()) {
                newErrors.tableNumber = 'Table number is required for Dine-In';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        // Only require payment for Collection/Takeaway orders in this refinement
        // Dine-In is often paid later or can be submitted directly to kitchen
        if ((orderType === 'Collection' || orderType === 'Takeaway') && selectedPayment === 'card' && !isPaymentSuccessful) {
            setIsPaymentModalOpen(true);
            return;
        }

        setIsProcessing(true);
        try {
            const orderItems = cartItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: parseFloat(String(item.price).replace(/[^0-9.]/g, '')),
                image: item.image
            }));

            const orderData = {
                items: orderItems,
                total,
                customerPhone: phone,
                customerName: customerData.fullName,
                customerEmail: customerData.email,
                orderType,
                tableNumber: orderType === 'Dine-In' ? localTableNumber : null,
                instructions: noteToChef,
                collectionTime: (orderType === 'Collection' || orderType === 'Takeaway') ? collectionTime : null
            };

            const response = await api.createOrder(orderData);
            if (response.success) {
                clearCart();
                navigate('/order-confirmation', {
                    state: {
                        orderId: response.orderId,
                        orderType,
                        tableNumber: orderType === 'Dine-In' ? localTableNumber : null,
                        waiterName: response.waiterName,
                        collectionTime: (orderType === 'Collection' || orderType === 'Takeaway') ? collectionTime : null
                    }
                });
            } else {
                toast.error(response.message || 'Order could not be placed. Please try again.');
            }
        } catch (err) {
            console.error('Order creation error:', err);
            toast.error(err.message || 'Error processing your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 text-slate-500 hover:text-primary transition-colors mb-4 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                            <span className="whitespace-nowrap">Back to Menu</span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-playfair text-slate-900">
                            Checkout
                        </h1>
                        <div className="flex items-center mt-3 space-x-4">
                            <span className="text-sm text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                                {orderType || 'Order'}
                            </span>
                            <button
                                onClick={() => setIsOrderTypeModalOpen(true)}
                                className="text-xs text-slate-600 hover:text-primary font-bold underline transition-colors"
                            >
                                Change order type
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Forms (8 col) — FIRST in DOM so it appears at top on mobile */}
                    <div className="lg:col-span-8 lg:order-1 space-y-8">
                        {/* Conditional Form Rendering */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            {(orderType === 'Collection' || orderType === 'Takeaway') ? (
                                <>
                                    {/* Personal Details for Collection */}
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                        <div className="flex items-center space-x-3 mb-8">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <User size={20} />
                                            </div>
                                            <h2 className="text-2xl font-playfair text-slate-900">Your Details</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Full Name *</label>
                                                <div className="relative">
                                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                    <input
                                                        type="text"
                                                        value={customerData.fullName}
                                                        onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
                                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${errors.fullName ? 'border-red-500 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all placeholder:text-[11px] sm:placeholder:text-sm text-sm`}
                                                        placeholder="e.g. John Doe"
                                                    />
                                                </div>
                                                {errors.fullName && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-tight">{errors.fullName}</p>}
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Email Address *</label>
                                                <div className="relative">
                                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                    <input
                                                        type="email"
                                                        value={customerData.email}
                                                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                                        className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${errors.email ? 'border-red-500 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 transition-all placeholder:text-[11px] sm:placeholder:text-sm text-sm`}
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                                {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-tight">{errors.email}</p>}
                                            </div>

                                            <div className="col-span-1">
                                                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Phone Number *</label>
                                                <div className={errors.phone ? 'ring-1 ring-red-500 rounded-2xl' : ''}>
                                                    <PhoneInput
                                                        value={phone}
                                                        onChange={(val) => setPhone(val)}
                                                        placeholder="7123 456789"
                                                        className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                                                        isDark={true}
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-tight">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Collection Preferences */}
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                        <div className="flex items-center space-x-3 mb-8">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <Clock size={20} />
                                            </div>
                                            <h2 className="text-2xl font-playfair text-slate-900">Collection Timing</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Preferred Time (Today) *</label>
                                                <div className="relative">
                                                    <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                                    <select
                                                        value={collectionTime}
                                                        onChange={(e) => setCollectionTime(e.target.value)}
                                                        className={`w-full pl-12 pr-10 py-4 rounded-2xl border ${errors.collectionTime ? 'border-red-500 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 appearance-none cursor-pointer transition-all`}
                                                    >
                                                        <option value="">Select a time</option>
                                                        <option value="ASAP">ASAP (15-20 mins)</option>
                                                        <option value="18:30">18:30 - 19:00</option>
                                                        <option value="19:00">19:00 - 19:30</option>
                                                        <option value="19:30">19:30 - 20:00</option>
                                                        <option value="20:00">20:00 - 20:30</option>
                                                    </select>
                                                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                                </div>
                                                {errors.collectionTime && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase tracking-tight">{errors.collectionTime}</p>}
                                                <div className="mt-3 flex items-start space-x-2 text-primary/60">
                                                    <Info size={14} className="shrink-0 mt-0.5" />
                                                    <p className="text-[10px] font-bold uppercase tracking-wider">Preparation takes 20-30 mins on average.</p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-widest">Special Instructions (Optional)</label>
                                                <div className="relative">
                                                    <MessageSquare size={18} className="absolute left-4 top-4 text-slate-300" />
                                                    <textarea
                                                        rows="3"
                                                        value={noteToChef}
                                                        onChange={(e) => setNoteToChef(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-300 resize-none transition-all font-medium"
                                                        placeholder="e.g. Allergies, spice level..."
                                                    ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment selection for Collection */}
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                        <div className="flex items-center space-x-3 mb-8">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                                <CreditCard size={20} />
                                            </div>
                                            <h2 className="text-2xl font-playfair text-slate-900">Payment Method</h2>
                                        </div>

                                        <div
                                            onClick={() => {
                                                setSelectedPayment('card');
                                                if (!isPaymentSuccessful) setIsPaymentModalOpen(true);
                                            }}
                                            className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center space-x-6 ${isPaymentSuccessful ? 'border-green-600 bg-green-50/10' : 'border-slate-100 hover:border-primary/30'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isPaymentSuccessful ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <CreditCard size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900 text-lg">Pay by Card</h4>
                                                <p className={`text-sm font-medium ${isPaymentSuccessful ? 'text-green-600' : 'text-slate-400'}`}>
                                                    {isPaymentSuccessful ? 'Card verified successfully' : 'Secure payment'}
                                                </p>
                                            </div>
                                            {isPaymentSuccessful ? (
                                                <CheckCircle2 size={24} className="text-green-600" />
                                            ) : (
                                                <div className="p-2 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">Select</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Dine-In Checkout Flow */}
                                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 text-center">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-3xl text-primary mb-8">
                                            <UtensilsCrossed size={40} />
                                        </div>
                                        <h2 className="text-3xl font-playfair text-slate-900 mb-4">Dine-In Order</h2>
                                        <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">Please provide your table number and any special requests. Your order will be sent straight to our kitchen.</p>

                                        <div className="max-w-md mx-auto space-y-8 text-left">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-900 mb-3 uppercase tracking-widest text-center">Your Table Number *</label>
                                                <input
                                                    type="text"
                                                    value={localTableNumber}
                                                    onChange={(e) => setLocalTableNumber(e.target.value)}
                                                    className={`w-full px-6 py-5 rounded-2xl border text-center text-2xl font-black ${errors.tableNumber ? 'border-red-500 bg-red-50/10' : 'border-slate-100 bg-slate-50/50'} focus:outline-none focus:ring-4 focus:ring-primary/10 text-slate-900 transition-all shadow-inner placeholder:text-sm placeholder:font-normal placeholder:text-slate-400`}
                                                    placeholder="e.g. 12"
                                                />
                                                {errors.tableNumber && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tight text-center">{errors.tableNumber}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-900 mb-3 uppercase tracking-widest">Any kitchen requests? (Optional)</label>
                                                <textarea
                                                    rows="3"
                                                    value={noteToChef}
                                                    onChange={(e) => setNoteToChef(e.target.value)}
                                                    className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-300 placeholder:text-xs placeholder:font-normal resize-none transition-all font-medium text-sm"
                                                    placeholder="e.g. Extra napkins, no cilantro, etc..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </div>

                    {/* Order Summary (4 col) — SECOND in DOM so it appears below form on mobile */}
                    <div className="lg:col-span-4 lg:order-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 lg:sticky lg:top-32">
                            <h2 className="text-2xl font-playfair text-slate-900 mb-6 border-b border-slate-100 pb-4">
                                Order Summary
                            </h2>

                            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative shrink-0 overflow-visible">
                                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                            <span className="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full border-2 border-white shadow-lg z-10 min-w-[28px]">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                                            <p className="text-xs text-slate-400 font-medium">£{parseFloat(String(item.price).replace(/[^0-9.]/g, '')).toFixed(2)} / unit</p>
                                        </div>
                                        <div className="font-bold text-slate-900 text-sm">
                                            £{(parseFloat(String(item.price).replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-dashed border-slate-200">
                                <div className="flex justify-between text-slate-500 text-sm font-medium">
                                    <span>Subtotal</span>
                                    <span>£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">
                                    <span>Total</span>
                                    <span className="text-primary">£{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button
                                    onClick={handlePlaceOrder}
                                    className={`w-full btn-primary py-3 rounded-2xl flex items-center justify-center space-x-3 text-sm shadow-premium group transition-all ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Lock size={18} className="shrink-0" />
                                            <span className="whitespace-nowrap">Place Order</span>
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-slate-400 text-center mt-4 uppercase tracking-[0.1em] font-bold leading-tight flex items-center justify-center">
                                    <ShieldCheck size={12} className="mr-1 text-green-500" />
                                    Secure checkout
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StripePaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={() => setIsPaymentSuccessful(true)}
                total={total}
            />
        </div>
    );
};

export default CheckoutPage;
