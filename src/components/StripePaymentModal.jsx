import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, CreditCard } from 'lucide-react';

const StripePaymentModal = ({ isOpen, onClose, onPaymentSuccess, total }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) return v.substring(0, 2) + ' / ' + v.substring(2, 4);
        return v;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess();
            onClose();
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-secondary/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden md:mx-4"
                >
                    <div className="p-5 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-playfair text-secondary">Pay with Card</h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <p className="text-gray-500 text-sm mb-1">Amount to pay</p>
                            <p className="text-3xl font-bold text-secondary">£{total.toFixed(2)}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Card Number</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={19}
                                        value={cardData.number}
                                        onChange={(e) => setCardData({ ...cardData, number: formatCardNumber(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white pr-10 font-mono"
                                        placeholder="4242 4242 4242 4242"
                                    />
                                    <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Name on Card</label>
                                <input
                                    required
                                    type="text"
                                    value={cardData.name}
                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                                    placeholder="J. DOE"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Expiry</label>
                                    <input
                                        required
                                        type="text"
                                        maxLength={7}
                                        value={cardData.expiry}
                                        onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white font-mono"
                                        placeholder="MM / YY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CVC</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="password"
                                            maxLength={4}
                                            value={cardData.cvc}
                                            onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/[^0-9]/g, '') })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white font-mono"
                                            placeholder="•••"
                                        />
                                        <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`w-full bg-secondary text-white py-4 rounded-xl flex items-center justify-center space-x-2 font-bold transition-all hover:bg-secondary/90 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Pay £{total.toFixed(2)}</span>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 flex flex-col items-center space-y-3">
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                <ShieldCheck size={14} />
                                <span>Secured by Stripe SSL encryption</span>
                            </div>
                            <div className="flex space-x-3 opacity-30 grayscale">
                                <span className="text-[10px] font-bold border border-gray-800 px-1 rounded">VISA</span>
                                <span className="text-[10px] font-bold border border-gray-800 px-1 rounded">MASTERCARD</span>
                                <span className="text-[10px] font-bold border border-gray-800 px-1 rounded">AMEX</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StripePaymentModal;
