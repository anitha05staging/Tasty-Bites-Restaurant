import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, ArrowLeft, Lock, ShieldCheck, ChevronDown, Plus, Minus, Trash2, UtensilsCrossed, Clock, Info } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import StripePaymentModal from '../components/StripePaymentModal';
import PhoneInput from '../components/PhoneInput';

const CheckoutPage = () => {
    const { cartItems, subtotal, clearCart, updateQuantity, removeFromCart, cartCount, orderType, tableNumber } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [phone, setPhone] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('card');
    const [localTableNumber, setLocalTableNumber] = useState(tableNumber || '');
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
            <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center pt-24 px-6 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <UtensilsCrossed size={40} />
                </div>
                <h2 className="text-3xl font-playfair text-secondary mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added any authentic flavours to your cart yet.</p>
                <Link to="/menu" className="btn-primary px-10 py-4">Browse Menu</Link>
            </div>
        );
    }

    const total = subtotal + 0;

    const validateForm = () => {
        const newErrors = {};
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

        if (orderType === 'Dine-In' && !localTableNumber.trim()) {
            newErrors.tableNumber = 'Table number is required for Dine-In';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        if (selectedPayment === 'card' && !isPaymentSuccessful) {
            setIsPaymentModalOpen(true);
            return;
        }

        setIsProcessing(true);
        try {
            const orderItems = cartItems.map(item => ({
                name: item.name, qty: item.quantity, price: parseFloat(String(item.price).replace(/[^0-9.]/g, '')), image: item.image
            }));
            const orderData = {
                items: orderItems,
                total,
                customerPhone: phone,
                customerName: customerData.fullName,
                customerEmail: customerData.email,
                orderType,
                tableNumber: orderType === 'Dine-In' ? localTableNumber : null
            };
            const response = await api.createOrder(orderData);
            if (response.success) {
                clearCart();
                const successMsg = orderType === 'Dine-In'
                    ? "Your order has been received and is being prepared. Please wait, your order will arrive shortly."
                    : "Your order has been placed successfully!";

                navigate('/order-confirmation', {
                    state: {
                        orderId: response.orderId,
                        successChoice: successMsg
                    }
                });
            } else {
                toast.error(response.message || 'Order could not be placed. Please try again.');
            }
        } catch (err) {
            console.error('Order simulation/creation error:', err);
            toast.error(err.message || 'Error processing your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-brand-cream min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* ... (previous header code) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center space-x-2 text-brand-text-light hover:text-primary transition-colors mb-4 group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Menu</span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-playfair text-secondary whitespace-nowrap">
                            Secure Checkout
                        </h1>
                        <p className="text-sm md:text-base text-primary font-medium mt-2 lowercase">
                            {cartCount} {cartCount === 1 ? 'item' : 'items'} in the cart
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left side: Order Details & Customer Info (7 col) */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-cream">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-8">
                                <h2 className="text-2xl font-playfair text-secondary">
                                    Your Selection
                                </h2>
                                <Link to="/menu" className="inline-flex items-center space-x-2 text-primary font-bold hover:scale-105 transition-transform bg-white px-4 py-2 rounded-xl shadow-sm border border-brand-cream text-sm">
                                    <Plus size={16} />
                                    <span>Add more dishes</span>
                                </Link>
                            </div>

                            <div className="space-y-6">
                                {cartItems.map((item) => {
                                    const priceString = String(item.price);
                                    const priceVal = parseFloat(priceString.replace(/[^0-9.]/g, ''));
                                    const itemTotal = priceVal * item.quantity;

                                    return (
                                        <div key={item.id} className="flex justify-between items-start gap-4 group pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="relative mt-1 shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl shadow-sm" />
                                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <h4 className="font-bold text-secondary text-base sm:text-lg leading-tight mb-1 truncate whitespace-break-spaces">{item.name}</h4>
                                                    <p className="text-sm text-gray-400 font-medium mb-3">£{priceVal.toFixed(2)} / unit</p>

                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-2 py-1 border border-gray-100">
                                                            <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center text-secondary hover:text-primary hover:shadow-md transition-all">
                                                                <Minus size={14} strokeWidth={2.5} />
                                                            </button>
                                                            <span className="w-4 text-center font-bold text-secondary text-sm">{item.quantity}</span>
                                                            <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-[28px] h-[28px] rounded-full bg-white flex items-center justify-center text-secondary hover:text-primary hover:shadow-md transition-all">
                                                                <Plus size={14} strokeWidth={2.5} />
                                                            </button>
                                                        </div>
                                                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 sm:p-1">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center mt-2 sm:mt-0 ml-auto shrink-0 pl-2">
                                                <span className="font-bold text-secondary text-lg text-right">£{itemTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-10 pt-8 border-t border-dashed border-gray-200 space-y-4">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium pb-2">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-600 font-bold uppercase text-xs tracking-widest">Free</span>
                                </div>
                                <div className="flex justify-between text-2xl font-bold text-secondary pt-6 border-t border-gray-100">
                                    <div className="flex flex-col">
                                        <span>Total Amount</span>
                                        <span className="text-xs text-gray-400 font-normal uppercase tracking-widest">inc. all taxes</span>
                                    </div>
                                    <span className="text-primary tracking-tight">£{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Form */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-cream">
                            <h2 className="text-2xl font-playfair text-secondary mb-8">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wide">Full Name *</label>
                                    <input
                                        type="text"
                                        value={customerData.fullName}
                                        onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
                                        className={`w-full px-5 py-4 rounded-2xl border ${errors.fullName ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:ring-primary/20'} focus:outline-none focus:ring-2 bg-brand-cream/30 text-secondary placeholder:text-gray-300 transition-all shadow-sm`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wide">Email Address *</label>
                                    <input
                                        type="email"
                                        value={customerData.email}
                                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                                        className={`w-full px-5 py-4 rounded-2xl border ${errors.email ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:ring-primary/20'} focus:outline-none focus:ring-2 bg-brand-cream/30 text-secondary placeholder:text-gray-300 transition-all shadow-sm`}
                                        placeholder="your@email.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wide">Phone Number *</label>
                                    <div className={errors.phone ? 'ring-1 ring-red-500 rounded-2xl' : ''}>
                                        <PhoneInput
                                            value={phone}
                                            onChange={(val) => setPhone(val)}
                                            placeholder="7123 456789"
                                            className="shadow-sm rounded-2xl overflow-hidden border border-gray-100"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                                </div>
                                {orderType === 'Dine-In' && (
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wide flex items-center">
                                            <UtensilsCrossed size={16} className="mr-2 text-primary" />
                                            Table Number *
                                        </label>
                                        <input
                                            type="text"
                                            value={localTableNumber}
                                            onChange={(e) => setLocalTableNumber(e.target.value)}
                                            className={`w-full px-5 py-4 rounded-2xl border ${errors.tableNumber ? 'border-red-500 focus:ring-red-100' : 'border-gray-100 focus:ring-primary/20'} focus:outline-none focus:ring-2 bg-brand-cream/30 text-secondary placeholder:text-gray-300 transition-all shadow-sm font-bold`}
                                            placeholder="e.g. Table 12"
                                        />
                                        {errors.tableNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.tableNumber}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right side: Preferences & Payment (5 col) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* ... (rest of the preferences and payment code remains same) */}
                        {/* Preferences */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-cream">
                            <h2 className="text-2xl font-playfair text-secondary mb-8">Your Preferences</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wide flex items-center">
                                        <Clock size={16} className="mr-2 text-primary" />
                                        Preferred Collection Time (Today) *
                                    </label>
                                    <div className="relative">
                                        <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-brand-cream/30 text-secondary appearance-none cursor-pointer transition-all shadow-sm">
                                            <option>Select a time</option>
                                            <option>ASAP (15-20 mins)</option>
                                            <option>18:00 - 18:30</option>
                                            <option>18:30 - 19:00</option>
                                            <option>19:00 - 19:30</option>
                                            <option>19:30 - 20:00</option>
                                        </select>
                                        <ChevronDown size={18} className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                                    </div>
                                    <p className="mt-3 text-xs text-primary/80 font-medium flex items-center">
                                        <Info size={14} className="mr-1.5" />
                                        Please allow us 20-30 mins at least to prepare your food.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-2 uppercase tracking-wide">Note to Chef (Optional)</label>
                                    <textarea rows="3" className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-brand-cream/30 text-secondary placeholder:text-gray-400 resize-none transition-all shadow-sm" placeholder="e.g. Less spicy, remove onions, allergies..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-brand-cream">
                            {/* ... (payment method code) */}
                            <h2 className="text-2xl font-playfair text-secondary mb-8 flex items-center">
                                <CreditCard size={24} className="mr-3 text-primary" />
                                Payment Method
                            </h2>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    onClick={() => {
                                        setSelectedPayment('card');
                                        if (!isPaymentSuccessful) setIsPaymentModalOpen(true);
                                    }}
                                    className={`relative cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${isPaymentSuccessful ? 'border-green-600 bg-green-50/30 shadow-md' : 'border-gray-100 hover:border-primary/30 hover:shadow-md'}`}
                                >
                                    {isPaymentSuccessful && (
                                        <div className="absolute top-4 right-4 text-green-600">
                                            <div className="bg-white rounded-full">
                                                <CheckCircle2 size={24} fill="currentColor" stroke="white" className="text-green-600" />
                                            </div>
                                        </div>
                                    )}
                                    <CreditCard size={32} className={`${isPaymentSuccessful ? 'text-secondary' : 'text-gray-300'}`} />
                                    <div className="text-center">
                                        <p className="font-bold text-secondary">Card</p>
                                        <p className={`text-xs font-medium ${isPaymentSuccessful ? 'text-green-600' : 'text-gray-400'}`}>
                                            {isPaymentSuccessful ? 'Payment Secured' : 'Pay now'}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            <button
                                type="button"
                                onClick={handlePlaceOrder}
                                className={`w-full btn-primary py-5 rounded-2xl flex items-center justify-center space-x-3 text-xl shadow-premium group transition-all ${isProcessing ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Lock size={20} className="group-hover:scale-110 transition-transform" />
                                        <span>Complete Order</span>
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center space-x-2 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                                <span>Powered by</span>
                                <span className="text-secondary opacity-100">Stripe</span>
                                <ShieldCheck size={14} className="text-green-500" />
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
