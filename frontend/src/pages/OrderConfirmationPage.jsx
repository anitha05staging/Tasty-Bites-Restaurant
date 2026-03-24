import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Utensils, Clock, MapPin, ChefHat, Heart } from 'lucide-react';
import { useLocation, Link, Navigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const location = useLocation();
    const [seconds, setSeconds] = React.useState(300);
    const [status, setStatus] = React.useState('Preparing');

    React.useEffect(() => {
        const { orderType } = location.state || {};
        if (orderType === 'Dine-In' && !['Served', 'Delivered'].includes(status)) {
            const interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        return 300; // Loop back to 5 minutes
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [location.state, status]);

    // Optional: Real-time status polling (e.g., every 30s)
    React.useEffect(() => {
        const { orderId, orderType } = location.state || {};
        if (orderType === 'Dine-In' && orderId) {
            const pollStatus = async () => {
                try {
                    // Assuming we have an endpoint or method to get single order status
                    const response = await api.getOrder(orderId);
                    if (response.status === 'Served' || response.status === 'Delivered' || response.status === 'Ready') {
                        setStatus(response.status);
                    }
                } catch (err) {
                    console.error('Status poll error:', err);
                }
            };
            const pollInterval = setInterval(pollStatus, 30000);
            return () => clearInterval(pollInterval);
        }
    }, [location.state]);

    if (!location.state?.orderId) {
        return <Navigate to="/" replace />;
    }

    const { orderId, orderType, tableNumber, collectionTime } = location.state;
    const isDineIn = orderType === 'Dine-In';
    const isReady = ['Served', 'Delivered'].includes(status);

    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const steps = [
        { id: 1, label: 'Order Placed', icon: ShoppingBag, active: true },
        { id: 2, label: 'Preparing Your Food', icon: ChefHat, active: status === 'Preparing' || status === 'Ready' || isReady },
        { id: 3, label: isDineIn ? 'Almost Ready' : 'Ready for Pickup', icon: isDineIn ? Utensils : MapPin, active: status === 'Ready' || isReady },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto bg-white rounded-[2.5rem] p-10 lg:p-14 text-center shadow-2xl relative overflow-hidden border border-slate-100"
                >
                    {/* Background decoration */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200"
                    >
                        <CheckCircle2 size={40} />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-slate-900 mb-2">
                        {isDineIn ? "Order Received!" : "Order Confirmed!"}
                    </h1>
                    <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                        {isDineIn
                            ? "We've sent your order to our chefs. Sit back and relax, your meal is being prepared with love."
                            : `Awesome! We'll have your food ready for collection at Tasty Bites by ${collectionTime || 'selected time'}.`}
                    </p>

                    {/* Progress Tracker */}
                    <div className="relative mb-12 px-4">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                        <div className="flex justify-between relative z-10">
                            {steps.map((step, idx) => (
                                <div key={step.id} className="flex flex-col items-center group">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${step.active
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                        : 'bg-white border-2 border-gray-200 text-gray-400'
                                        }`}>
                                        <step.icon size={20} />
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-widest font-bold mt-3 ${step.active ? 'text-primary' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details Cards */}
                    <div className={`grid grid-cols-1 ${isDineIn ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 mb-10`}>
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Order ID</span>
                            <span className="text-2xl font-mono font-black text-slate-900">#{orderId}</span>
                        </div>

                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">
                                {isDineIn ? "Your Table" : "Pickup Time"}
                            </span>
                            <div className="flex items-center space-x-2 text-primary font-bold">
                                {isDineIn ? <Utensils size={18} /> : <Clock size={18} />}
                                <span className="text-2xl">{isDineIn ? `Table ${tableNumber}` : (collectionTime || 'ASAP')}</span>
                            </div>
                        </div>

                        {isDineIn && (
                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-2">Service Timer</span>
                                <div className="flex items-center space-x-2 text-primary font-bold">
                                    <Clock size={18} />
                                    <span className="text-2xl font-mono">{formatTime(seconds)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/" className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-brand-cream text-secondary rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-brand-cream transition-all text-center whitespace-nowrap">
                            Back to Home
                        </Link>
                        <Link to={isDineIn ? "/dine-in-menu" : "/menu"} className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-center flex justify-center items-center group whitespace-nowrap">
                            Order More
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
                        </Link>
                    </div>
                </motion.div>

                <div className="mt-12 flex flex-col items-center">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-brand-cream/60 to-transparent mb-8" />
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm italic text-slate-500"
                    >
                        <Heart size={14} className="text-primary fill-primary/20" />
                        <p className="text-sm font-medium tracking-tight">
                            Thank you for choosing Tasty Bites. We hope you enjoy your meal!
                        </p>
                        <Heart size={14} className="text-primary fill-primary/20" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
